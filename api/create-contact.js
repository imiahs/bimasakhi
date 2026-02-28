import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    try {

        const {
            name,
            mobile,
            email,
            reason,
            message,
            source,
            pipeline,
            tag
        } = req.body;

        // =========================
        // 1️⃣ Basic Validation
        // =========================

        if (!name || !mobile || !email || !reason || !message) {
            return res.status(400).json({
                success: false,
                error: "All fields are required"
            });
        }

        // =========================
        // 2️⃣ Duplicate Check
        // =========================

        const { data: existing } = await supabase
            .from("contact_inquiries")
            .select("*")
            .or(`email.eq.${email},mobile.eq.${mobile}`)
            .limit(1);

        if (existing && existing.length > 0) {
            return res.status(200).json({
                success: true,
                duplicate: true,
                contact_id: existing[0].contact_id
            });
        }

        // =========================
        // 3️⃣ Generate Contact ID
        // =========================

        const contactId = `CNT-${Date.now()}`;

        // =========================
        // 4️⃣ Insert into Supabase
        // =========================

        const { error: insertError } = await supabase
            .from("contact_inquiries")
            .insert([
                {
                    contact_id: contactId,
                    name,
                    mobile,
                    email,
                    reason,
                    message,
                    source,
                    pipeline,
                    tag,
                    created_at: new Date()
                }
            ]);

        if (insertError) {
            throw insertError;
        }

        // =========================
        // 5️⃣ Push to Zoho CRM
        // =========================

        await fetch("https://www.zohoapis.in/crm/v2/Leads", {
            method: "POST",
            headers: {
                "Authorization": `Zoho-oauthtoken ${process.env.ZOHO_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: [
                    {
                        Last_Name: name,
                        Email: email,
                        Phone: mobile,
                        Lead_Source: source || "Website",
                        Description: message,
                        Tag: tag || "Contact Inquiry",
                        Lead_Status: "Contacted"
                    }
                ]
            })
        });

        // =========================
        // 6️⃣ Email Auto-Responder
        // =========================

        await fetch("https://api.zeptomail.in/v1.1/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Zoho-enczapikey ${process.env.ZEPTO_API_KEY}`
            },
            body: JSON.stringify({
                from: {
                    address: "info@bimasakhi.com",
                    name: "Bima Sakhi Team"
                },
                to: [
                    {
                        email_address: {
                            address: email,
                            name: name
                        }
                    }
                ],
                subject: "We Have Received Your Inquiry",
                htmlbody: `
          <h3>Hello ${name},</h3>
          <p>Thank you for contacting Bima Sakhi.</p>
          <p>Your inquiry regarding <strong>${reason}</strong> has been received.</p>
          <p>Our team will review and respond shortly.</p>
          <br/>
          <p>Regards,<br/>Team Bima Sakhi<br/>Empower Your True YOU</p>
        `
            })
        });

        // =========================
        // 7️⃣ Return Response
        // =========================

        return res.status(200).json({
            success: true,
            contact_id: contactId
        });

    } catch (error) {

        console.error("Contact API Error:", error);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
}