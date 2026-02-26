// ==============================================
// whatsapp.js
// Central WhatsApp Message Engine
// ==============================================

/**
 * IMPORTANT: Phone number is now managed via .env
 * 
 * In your .env file (or .env.local for development):
 * VITE_WHATSAPP_NUMBER=919311073365
 * 
 * For production (Vercel / Netlify / etc.):
 * → You MUST add this variable in your hosting platform's environment variables dashboard
 *   (Vercel → Project Settings → Environment Variables)
 *   Key: VITE_WHATSAPP_NUMBER
 *   Value: 919311073365
 * 
 * Why? .env is gitignored → never committed to Git
 *      But hosting platforms need these vars explicitly set for builds
 *      This prevents hard-coded numbers and makes changing number easy (one place only)
 */

export const formatWhatsAppMessage = (data = {}) => {
    const {
        name = '',
        city = '',
        education = '',
        occupation = '',
        email = '',
        source = '',
        leadId = '',
        waitlist = false,
        category = '',
        intent = 'Application Submitted'
    } = data;

    // ==============================
    // HUMAN FRIENDLY SECTION
    // ==============================

    let message = `Hello Team Bima Sakhi,\n\n`;

    message += `My name is ${name}. I have just completed my application on bimasakhi.com after going through the opportunity details.\n\n`;

    message += `Here are my details:\n`;
    message += `• City: ${city || 'Not Provided'}\n`;
    message += `• Education: ${education || 'Not Provided'}\n`;
    message += `• Current Status: ${occupation || 'Not Provided'}\n`;

    if (leadId) message += `• Reference ID: ${leadId}\n`;

    if (waitlist) {
        message += `\nI understand that onboarding is currently active in selected cities and I would like to stay updated regarding expansion in my area.\n`;
    }

    message += `\nI understand that this is a commission-based LIC agency opportunity (not a salaried job), and I am genuinely interested in knowing the next steps.\n\n`;

    message += `Kindly guide me regarding the training and onboarding process.\n\n`;

    message += `For a complete overview of the program, you may also refer to:\n`;
    message += `https://bimasakhi.com?source=whatsapp\n\n`;

    message += `Thank you.\n`;

    // ==============================
    // MACHINE PARSABLE SECTION
    // ==============================

    message += `\n\n--- Internal System Info ---\n`;
    message += `Source: ${source || 'Website'}\n`;
    message += `Email: ${email || 'Not Provided'}\n`;
    message += `ReferenceID: ${leadId || 'Not Available'}\n`;
    message += `Category: ${category || (waitlist ? 'Expansion Waitlist' : 'Direct Application')}\n`;
    message += `Intent: ${intent}\n`;
    message += `Waitlist: ${waitlist ? 'Yes' : 'No'}`;

    return encodeURIComponent(message);
};

export const getWhatsAppUrl = (data = {}) => {
    // Read from .env (Vite prefix VITE_ is required for client-side access)
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '919311073365'; // fallback for safety

    const text = formatWhatsAppMessage(data);
    return `https://wa.me/${phone}?text=${text}`;
};