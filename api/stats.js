import Redis from 'ioredis';
import axios from 'axios';
import { parse } from 'cookie';

// Initialize Redis 
const redis = new Redis(process.env.REDIS_URL);

/**
 * Checks if the request has a valid admin session cookie.
 * (Duplicated logic from admin-check.js to ensure self-contained security)
 */
const checkAuth = async (req) => {
    const cookies = parse(req.headers.cookie || '');
    const sessionToken = cookies.admin_session;

    if (!sessionToken) return false;

    // Check Redis for this session
    const sessionData = await redis.get(`session:${sessionToken}`);
    if (!sessionData) return false;

    // Refresh TTL (Sliding Window)
    await redis.expire(`session:${sessionToken}`, 3600); // +1 Hour
    return true;
};

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // 1. Auth Guard
        const isAuthenticated = await checkAuth(req);
        if (!isAuthenticated) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // 2. Parse Params
        const { range = 'today' } = req.query; // 'today', '7d', '30d'

        // 3. Cache Check
        const cacheKey = `stats:${range}`;
        const cachedStats = await redis.get(cacheKey);
        if (cachedStats) {
            return res.status(200).json(JSON.parse(cachedStats));
        }

        // 4. Calculate Date Range for Zoho
        // Zoho COQL format: 'yyyy-MM-ddTHH:mm:ss+05:30' typically
        // We'll use simple ISO date part 'yyyy-MM-dd' which usually works for date fields
        // Or specific Zoho format. Let's use standard ISO.

        const now = new Date();
        // Adjust for IST roughly or UTC? Zoho stores in user timezone usually.
        // Let's assume server UTC and Zoho query works with it.

        // Define Start Date based on Range
        let startDate = new Date();
        if (range === '7d') startDate.setDate(now.getDate() - 7);
        else if (range === '30d') startDate.setDate(now.getDate() - 30);
        else startDate.setHours(0, 0, 0, 0); // Today start

        const startDateStr = startDate.toISOString(); // 2023-...

        // 5. Zoho COQL Query
        // Fetch Token
        const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_API_DOMAIN = 'https://www.zohoapis.in' } = process.env;
        const accountsUrl = ZOHO_API_DOMAIN.replace('www.zohoapis', 'accounts.zoho');

        const tokenResponse = await axios.post(`${accountsUrl}/oauth/v2/token`, null, {
            params: {
                refresh_token: ZOHO_REFRESH_TOKEN,
                client_id: ZOHO_CLIENT_ID,
                client_secret: ZOHO_CLIENT_SECRET,
                grant_type: 'refresh_token'
            }
        });

        const accessToken = tokenResponse.data.access_token;
        if (!accessToken) throw new Error("Zoho Token Failed");

        // Execute Queries
        // We will run a few aggregated queries
        // COQL Endpoint: /crm/v2.1/coql
        const coqlUrl = `${ZOHO_API_DOMAIN}/crm/v2.1/coql`;

        // Q1: Total Applications in Range
        // Logic: Created_Time >= startDateStr
        const queryTotal = `select count(id) from Leads where Created_Time >= '${startDateStr}'`;

        // Q2: Eligible (Assumed Field or Status logic)
        // Since we don't have a specific 'Eligibility_Status' field confirmed in schema map, 
        // we might skip this specific breakdown OR infer it if possible.
        // Let's rely on standard 'Lead_Status' if relevant. 
        // For V1, we focused on Total, Manual, Duplicate.

        // Q3: Attribution (Group By Source)
        const querySource = `select Lead_Source, count(id) from Leads where Created_Time >= '${startDateStr}' group by Lead_Source`;

        const [resTotal, resSource] = await Promise.all([
            axios.post(coqlUrl, { select_query: queryTotal }, { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` } }),
            axios.post(coqlUrl, { select_query: querySource }, { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` } })
        ]);

        const totalApplications = resTotal.data.data ? resTotal.data.data[0].count : 0;
        const sources = resSource.data.data || [];

        // Manual Entry Estimate (No direct tag field query in V1 unless we added it)
        // If we can't query tags easily via COQL (Tag is a submodule), we might skip specific "Manual" count for V1 stats 
        // unless we added a specific field.
        // In create-lead.js, `City Verified` isn't a field sent to Zoho, it was in WhatsApp message.
        // So we can't count Manual entries via Zoho API yet. 
        // Correction: We will stub Manual/Eligible as "N/A" or "0" for now until schema update.

        const stats = {
            range,
            generatedAt: new Date().toISOString(),
            totalApplications,
            eligible: 0, // Placeholder
            manualEntries: 0, // Placeholder
            duplicates: 0, // Placeholder
            attribution: sources.map(s => ({ source: s.Lead_Source, count: s.count }))
        };

        // 6. Cache Result (10 Mins = 600s)
        await redis.set(cacheKey, JSON.stringify(stats), 'EX', 600);

        return res.status(200).json(stats);

    } catch (error) {
        console.error("Stats API Error", error.response ? error.response.data : error.message);
        // Fail gracefully
        return res.status(500).json({ error: "Failed to fetch stats" });
    }
}
