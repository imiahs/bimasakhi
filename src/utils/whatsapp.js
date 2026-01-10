export const formatWhatsAppMessage = (data) => {
    const { name, city, occupation, source, leadId } = data; // leadId (RefID) added

    // User facing message
    let message = `Hello,\nI have read all pages of bimasakhi.com.\n\n`;
    message += `Name: ${name}\n`;
    message += `City: ${city || 'Not Provided'}\n`;
    message += `Occupation: ${occupation || 'Not Provided'}\n`;
    if (leadId) message += `Ref ID: ${leadId}\n\n`;
    else message += `\n`; // Spacer if no ID

    message += `I am interested in the Bima Sakhi (LIC Agency) program.\nPlease guide me for the next step.`;

    // Hidden/System metadata for parsing
    message += `\n\n--- System Info ---\n`;
    message += `Source: ${source || 'Website'}\n`;
    message += `City Verified: ${city ? 'Yes' : 'No'}\n`;
    message += `Intent: Application Submitted`;

    return encodeURIComponent(message);
};

export const getWhatsAppUrl = (data) => {
    const phone = '919311073365';
    const text = formatWhatsAppMessage(data);
    return `https://wa.me/${phone}?text=${text}`;
};
