import axios from 'axios';

// Mock Zoho CRM API URL (Replace with actual Zoho API or Logic App URL)
// For V1, we might be hitting a proxy or a Logic App that handles the OAuth dance.
// If using direct Zoho API, we'd need OAuth token management which is complex for a simple serverless function without a DB.
// Strategy: We will assume a "Zoho Flow" Webhook or a wrapper API is available, OR we implement the Zoho OAuth here if keys are provided.
// Given constraints & "Serverless API (Node.js)" description:
// We will implement a sturdy validation layer that PREPARES the data for Zoho.
// If no backend endpoint exists yet, we will MOCK the success to allow frontend development but LOG the failure.
// CAVEAT: Production requires a real backend endpoint.

export default async function handler(req, res) {
    // CORS headers for local dev/Vite access
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, mobile, city, occupation, reason, source, medium, campaign } = req.body;

    // 1. Strict Validation
    if (!name || !mobile || !city || !occupation) {
        return res.status(400).json({ error: 'Missing required fields: name, mobile, city, occupation' });
    }

    // Indian Mobile Validation (starts with 6-9, 10 digits)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
        return res.status(400).json({ error: 'Invalid Indian mobile number' });
    }

    // 2. Mandatory Metadata (Safe Architecture Rule) - STRICT ENFORCEMENT
    if (!source || !medium || !campaign) {
        return res.status(400).json({ error: 'Missing mandatory metadata: source, medium, campaign' });
    }

    const leadData = {
        Last_Name: name, // Zoho standard
        Mobile: mobile,
        City: city,
        Designation: occupation,
        Description: reason,
        Lead_Source: source || 'Website',
        Lead_Medium: medium || 'Direct',
        Campaign_Source: campaign || 'Bima Sakhi',
        Created_Time: new Date().toISOString()
    };

    try {
        // 3. Real Zoho Logic
        const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_API_DOMAIN = 'https://www.zohoapis.in' } = process.env;

        if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) {
            throw new Error("Missing Server-Side Configuration (Zoho Keys)");
        }

        // A. Get Access Token
        // URL for India DC: https://accounts.zoho.in/oauth/v2/token (Check domain)
        const tokenUrl = `${ZOHO_API_DOMAIN.replace('www.zohoapis', 'accounts.zoho')}/oauth/v2/token`;

        const tokenResponse = await axios.post(tokenUrl, null, {
            params: {
                refresh_token: ZOHO_REFRESH_TOKEN,
                client_id: ZOHO_CLIENT_ID,
                client_secret: ZOHO_CLIENT_SECRET,
                grant_type: 'refresh_token'
            }
        });

        if (tokenResponse.data.error) {
            console.error("Zoho Token Error:", tokenResponse.data.error);
            throw new Error("Failed to authenticate with CRM");
        }

        const accessToken = tokenResponse.data.access_token;

        // B. Create Lead in Zoho CRM
        // Using v2.1 API
        const crmUrl = `${ZOHO_API_DOMAIN}/crm/v2.1/Leads`;

        const crmResponse = await axios.post(crmUrl, { data: [leadData] }, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        // C. Handle CRM Response
        const result = crmResponse.data.data[0];

        if (result.status === 'success') {
            const zohoId = result.details.id;
            console.log("Lead Created in Zoho:", zohoId);

            // 4. Return Success
            return res.status(200).json({
                success: true,
                message: "Lead created successfully",
                lead_id: zohoId
            });
        } else {
            console.error("Zoho CRM Error:", result);
            throw new Error("CRM rejected data");
        }

    } catch (error) {
        console.error("Zoho Creation Failed:", error);
        // Do NOT expose system details to frontend, just 500
        return res.status(500).json({
            success: false,
            error: "Failed to create lead in CRM. System Error."
        });
    }
}
