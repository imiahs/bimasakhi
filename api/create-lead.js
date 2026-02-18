import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// --- PRODUCTION HARDENING (PHASE 2) ---

// 1. Mobile Normalization (Standardized Logic)
const normalizeMobile = (mobile = '') => {
    const cleaned = mobile.toString().replace(/\D/g, '');
    return cleaned.length >= 10 ? cleaned.slice(-10) : cleaned;
};

// 2. Safe Supabase Initialization
let supabase = null;
try {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    } else {
        if (process.env.SUPABASE_ENABLED === 'true') {
            console.warn("Supabase credentials missing. Supabase will be skipped.");
        }
    }
} catch (e) {
    console.error("Supabase Init Error:", e);
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // --- INPUT VALIDATION & NORMALIZATION ---
    let {
        name, mobile, email,
        pincode, city, state, locality,
        education, occupation, reason,
        source, medium, campaign, visitedPages
    } = req.body;

    // FIX 1: Normalize Mobile BEFORE Validation
    const normalizedMobile = normalizeMobile(mobile);

    // FIX 5: Ensure No Double Normalization (We use normalizedMobile henceforth)

    if (!name || !normalizedMobile || !city || !occupation || !email || !pincode) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(normalizedMobile)) {
        return res.status(400).json({ error: 'Invalid Indian mobile number' });
    }

    if (!source) {
        return res.status(400).json({ error: 'Missing mandatory metadata: source' });
    }

    // --- SUPABASE FLOW (SAFE & HARDENED) ---

    const isSupabaseEnabled = process.env.SUPABASE_ENABLED === 'true' && supabase !== null;

    let isDuplicate = false;
    let supabaseLeadId = null;
    let existingLeadData = null;

    if (isSupabaseEnabled) {
        try {
            // A. Check for Duplicate (Optimistic Check)
            const { data: existingLead, error: checkError } = await supabase
                .from('leads')
                .select('id, city, created_at, zoho_lead_id, full_name')
                .eq('mobile', normalizedMobile)
                .maybeSingle();

            if (checkError) {
                console.error("Supabase Check Error:", checkError);
            } else if (existingLead) {
                isDuplicate = true;
                existingLeadData = existingLead;

                // Log Duplicate Event
                await supabase.from('lead_events').insert({
                    lead_id: existingLead.id,
                    event_type: 'duplicate_detected',
                    metadata: { attempt_source: source }
                }).catch(err => console.error("Audit Log Error:", err));
            }

            // B. Insert New Lead (If Not Duplicate)
            if (!isDuplicate) {
                try {
                    const { data: newLead, error: insertError } = await supabase
                        .from('leads')
                        .insert({
                            full_name: name,
                            mobile: normalizedMobile,
                            email,
                            city,
                            state,
                            pincode,
                            locality,
                            education,
                            occupation,
                            source,
                            medium,
                            campaign,
                            status: 'new' // FIX 4: Ensure valid enum default
                        })
                        .select()
                        .single();

                    if (insertError) throw insertError;

                    supabaseLeadId = newLead.id;

                    // Log Metadata
                    await supabase.from('lead_metadata').insert({
                        lead_id: newLead.id,
                        utm_source: source,
                        utm_medium: medium,
                        utm_campaign: campaign,
                        visited_pages: visitedPages,
                        user_agent: req.headers['user-agent']
                    }).catch(err => console.error("Meta Log Error:", err));

                    // Log Creation Event
                    await supabase.from('lead_events').insert({
                        lead_id: newLead.id,
                        event_type: 'created'
                    }).catch(err => console.error("Event Log Error:", err));

                } catch (insertError) {
                    // FIX 3: HANDLE UNIQUE CONSTRAINT RACE CONDITION
                    if (insertError.code === '23505') { // Unique Violation
                        console.warn("Race Condition Detected: Duplicate Insert Attempt");

                        // Fetch the existing record that caused the conflict
                        const { data: raceLead } = await supabase
                            .from('leads')
                            .select('id, city, created_at')
                            .eq('mobile', normalizedMobile)
                            .maybeSingle();

                        if (raceLead) {
                            isDuplicate = true;
                            existingLeadData = raceLead;

                            await supabase.from('lead_events').insert({
                                lead_id: raceLead.id,
                                event_type: 'duplicate_race_condition'
                            }).catch(e => console.error(e));
                        }
                    } else {
                        // Real Error -> Re-throw to fall back to Zoho
                        throw insertError;
                    }
                }
            }

        } catch (sbError) {
            // FIX 6: ENSURE SAFE FALLBACK
            console.error("Supabase Critical Failure (Falling back to Zoho-only):", sbError);
            // Verify state is clean for Zoho fallback
            isDuplicate = false;
            supabaseLeadId = null;
        }
    }

    // --- STOP IF DUPLICATE ---
    if (isDuplicate) {
        return res.status(200).json({
            success: true,
            duplicate: true,
            lead_id: existingLeadData.id,
            data: existingLeadData,
            message: "Welcome back! We already have your application."
        });
    }

    // --- ZOHO CRM LOGIC (EXISTING) ---

    // FIX 2: Unleash strict payload (Remove Unknown Custom Fields)
    const leadData = {
        Last_Name: name,
        Mobile: normalizedMobile, // Use normalized
        Email: email,
        City: city,
        State: state,
        Zip_Code: pincode,
        Street: locality,
        Designation: occupation,
        Description: `Education: ${education}\nReason: ${reason || ''}\n\nVisited Pages: ${JSON.stringify(visitedPages || [])}`,
        Lead_Source: source || 'Website',
        Lead_Medium: medium || 'Direct',
        Campaign_Source: campaign || 'Bima Sakhi'
        // REMOVED: Bima_Sakhi_Ref_ID (Unsafe custom field)
    };

    try {
        const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_API_DOMAIN = 'https://www.zohoapis.in' } = process.env;

        if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) {
            console.error("Missing Zoho ENV Variables");
            return res.status(500).json({ error: "Server Configuration Error" });
        }

        // A. Get Access Token
        const accountsUrl = ZOHO_API_DOMAIN.replace('www.zohoapis', 'accounts.zoho');
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
            throw new Error(`Auth Failed: ${tokenResponse.data.error}`);
        }

        const accessToken = tokenResponse.data.access_token;

        // B. Upsert Lead
        const crmUrl = `${ZOHO_API_DOMAIN}/crm/v2.1/Leads/upsert`;

        const crmResponse = await axios.post(crmUrl, {
            data: [leadData],
            duplicate_check_fields: ['Mobile'],
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
            const action = result.action;

            // --- UPDATE SUPABASE BACK-REF ---
            if (isSupabaseEnabled && supabaseLeadId && zohoId) {
                // Fire and forget update
                supabase.from('leads').update({
                    zoho_lead_id: zohoId,
                    status: 'contacted', // FIX 4: Use SAFE enum value (was 'synced')
                    updated_at: new Date()
                })
                    .eq('id', supabaseLeadId)
                    .then(() => {
                        return supabase.from('lead_events').insert({
                            lead_id: supabaseLeadId,
                            event_type: 'zoho_synced',
                            metadata: { zoho_id: zohoId, action: action }
                        });
                    })
                    .catch(err => console.error("Back-ref Update Error:", err));
            }
            // ----------------------------------------

            return res.status(200).json({
                success: true,
                message: "Lead processed successfully",
                lead_id: supabaseLeadId || zohoId,
                zoho_id: zohoId,
                status: result.status,
                action: action,
                duplicate: false
            });
        } else {
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
