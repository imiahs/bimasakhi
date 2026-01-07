// Webhook handler for Zoho Flow / Automation
// Replace with actual Zoho Flow Webhook URL when available
const ZOHO_WEBHOOK_URL = ''; // e.g., 'https://flow.zoho.in/7xxxxx/flow/webhook/incoming?zapikey=...'

export const postToWebhook = async (data) => {
    if (!ZOHO_WEBHOOK_URL) {
        console.warn('Zoho Webhook URL not configured. Skipping automation push.');
        return false;
    }

    try {
        // Send data using 'no-cors' mode if Zoho doesn't support CORS preflight (common in webhooks)
        // Or 'cors' if it does. Usually triggers require proper CORS or a proxy.
        // For V1, we will try standard POST.
        // NOTE: Direct browser-to-webhook often hits CORS issues. 
        // Recommended to use 'no-cors' (opaque response) or a backend proxy.
        // We will use 'no-cors' as fire-and-forget.

        await fetch(ZOHO_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        console.log('Lead pushed to automation successfully');
        return true;
    } catch (error) {
        console.error('Webhook push failed:', error);
        return false;
    }
};
