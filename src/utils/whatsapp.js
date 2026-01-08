export const formatWhatsAppMessage = (data) => {
    const { name, city, occupation, source } = data;

    // User facing message
    let message = `Hello,\nI have read all pages of bimasakhi.com.\n\n`;
    message += `Name: ${name}\n`;
    message += `City: ${city}\n`;
    message += `Occupation: ${occupation}\n\n`;
    message += `I am interested in the Bima Sakhi (LIC Agency) program.\nPlease guide me for the next step.`;

    // Hidden/System metadata for parsing
    message += `\n\n--- System Info ---\n`;
    message += `Source: ${source || 'Website'}\n`;
    message += `City Verified: Yes\n`;
    message += `Intent: Application Submitted`;

    return encodeURIComponent(message);
};

export const getWhatsAppUrl = (data) => {
    const phone = '919311073365';
    const text = formatWhatsAppMessage(data);
    return `https://wa.me/${phone}?text=${text}`;
};
