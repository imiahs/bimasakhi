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
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, mobile, city, occupation, reason, source, medium, campaign, visitedPages } = req.body;

    // 1. Strict Validation
    if (!name || !mobile || !city || !occupation) {
        return res.status(400).json({ error: 'Missing required fields: name, mobile, city, occupation' });
    }

    // Indian Mobile Validation (starts with 6-9, 10 digits)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
        return res.status(400).json({ error: 'Invalid Indian mobile number' });
    }

    // 2. Mandatory Metadata
    if (!source) {
        // We can be slightly lenient on medium/campaign if missing, but source is critical
        return res.status(400).json({ error: 'Missing mandatory metadata: source' });
    }

    // Zoho Field Mapping
    const leadData = {
        Last_Name: name,
        Mobile: mobile,
        City: city,
        Designation: occupation,
        Description: `${reason || ''}\n\nVisited Pages: ${JSON.stringify(visitedPages || [])}`,
        Lead_Source: source || 'Website',
        Lead_Medium: medium || 'Direct', // Ensure these API Names exist in Zoho
        Campaign_Source: campaign || 'Bima Sakhi'
    };

    try {
        const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_API_DOMAIN = 'https://www.zohoapis.in' } = process.env;

        if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) {
            console.error("Missing Zoho ENV Variables");
            return res.status(500).json({ error: "Server Configuration Error" });
        }

        // A. Get Access Token (Server-to-Server OAuth)
        const accountsUrl = ZOHO_API_DOMAIN.replace('www.zohoapis', 'accounts.zoho'); // e.g. https://accounts.zoho.in
        const tokenUrl = `${accountsUrl}/oauth/v2/token`;

        const tokenResponse = await axios.post(tokenUrl, null, {
            params: {
                refresh_token: ZOHO_REFRESH_TOKEN,
                client_id: ZOHO_CLIENT_ID,
                client_secret: ZOHO_CLIENT_SECRET,
                grant_type: 'refresh_token'
            }
        });

        if (tokenResponse.data.error) {
            console.error("Zoho Token Refresh Error:", tokenResponse.data.error);
            throw new Error(`Auth Failed: ${tokenResponse.data.error}`);
        }

        const accessToken = tokenResponse.data.access_token;
        if (!accessToken) {
            throw new Error("No access token received from Zoho");
        }

        // B. Create Lead in Zoho CRM
        const crmUrl = `${ZOHO_API_DOMAIN}/crm/v2.1/Leads`;

        // Trigger Workflow is vital for assignment rules/emails
        const crmResponse = await axios.post(crmUrl, { data: [leadData], trigger: ['approval', 'workflow', 'blueprint'] }, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        // C. Handle CRM Response
        const result = crmResponse.data.data ? crmResponse.data.data[0] : null;

        if (result && (result.status === 'success' || result.status === 'duplicate')) {
            const zohoId = result.details.id;
            console.log(`Lead Processed (Status: ${result.status}, ID: ${zohoId})`);

            return res.status(200).json({
                success: true,
                message: "Lead processed successfully",
                lead_id: zohoId,
                status: result.status
            });
        } else {
            // CRM Data Error (Validation etc)
            console.error("Zoho CRM Data Error:", JSON.stringify(crmResponse.data));
            return res.status(400).json({
                success: false,
                error: "CRM Validation Failed",
                details: result
            });
        }

    } catch (error) {
        console.error("System Error in Create-Lead:", error.response ? error.response.data : error.message);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
}
