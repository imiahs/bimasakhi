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

    const {
        name, mobile, email,
        pincode, city, state, locality,
        education, occupation, reason,
        source, medium, campaign, visitedPages
    } = req.body;

    // 1. Strict Validation
    if (!name || !mobile || !city || !occupation || !email || !pincode) {
        return res.status(400).json({ error: 'Missing required fields: name, mobile, email, pincode, city, occupation' });
    }

    // Indian Mobile Validation (starts with 6-9, 10 digits)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
        return res.status(400).json({ error: 'Invalid Indian mobile number' });
    }

    // 2. Mandatory Metadata
    if (!source) {
        return res.status(400).json({ error: 'Missing mandatory metadata: source' });
    }

    // Zoho Field Mapping
    // Note: 'Street' in Zoho often maps to Locality/Address line 1
    const leadData = {
        Last_Name: name,
        Mobile: mobile,
        Email: email,
        City: city,
        State: state,
        Zip_Code: pincode,
        Street: locality,
        Designation: occupation,
        Description: `Education: ${education}\nReason: ${reason || ''}\n\nVisited Pages: ${JSON.stringify(visitedPages || [])}`,
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

        // B. Upsert Lead in Zoho CRM
        // Using /upsert to handle duplicates cleanly (updates existing record)
        const crmUrl = `${ZOHO_API_DOMAIN}/crm/v2.1/Leads/upsert`;

        // Trigger Workflow is vital for assignment rules/emails
        const crmResponse = await axios.post(crmUrl, {
            data: [leadData],
            duplicate_check_fields: ['Mobile'], // Use Mobile as unique identifier
            trigger: ['approval', 'workflow', 'blueprint']
        }, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        // C. Handle CRM Response
        const result = crmResponse.data.data ? crmResponse.data.data[0] : null;

        if (result && (result.status === 'success' || result.status === 'duplicate')) {
            const zohoId = result.details.id;
            const action = result.action; // 'insert' or 'update'
            console.log(`Lead Processed (Status: ${result.status}, Action: ${action}, ID: ${zohoId})`);

            return res.status(200).json({
                success: true,
                message: "Lead processed successfully",
                lead_id: zohoId,
                status: result.status,
                action: action
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
