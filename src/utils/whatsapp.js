export const formatWhatsAppMessage = (data) => {
    const {
        name = '',
        city = '',
        education = '',
        occupation = '',
        email = '',
        source = '',
        leadId = ''
    } = data || {};
    // User facing message
    let message = `Hello Team Bima Sakhi,\n\n`;

    message += `My name is ${name}. I have just completed my application on bimasakhi.com after going through the opportunity details.\n\n`;

    message += `Here are my details:\n`;
    message += `• City: ${city || 'Not Provided'}\n`;
    message += `• Education: ${education || 'Not Provided'}\n`;
    message += `• Current Status: ${occupation || 'Not Provided'}\n`;

    if (leadId) message += `• Reference ID: ${leadId}\n`;

    message += `\nI understand that this is a commission-based LIC agency opportunity (not a salaried job), and I am genuinely interested in knowing the next steps.\n\n`;

    message += `Kindly guide me regarding the training and onboarding process.\n\n`;

    message += `For a complete overview of the program, you may also refer to:\n`;
    message += `https://bimasakhi.com?source=whatsapp\n\n`;

    message += `Thank you.\n`;
    // Hidden/System metadata for parsing
    message += `\n\n--- Internal System Info ---\n`;
    message += `Source: ${source || 'Website'}\n`;
    message += `Email: ${email || 'Not Provided'}\n`;
    message += `Intent: Application Submitted`;

    return encodeURIComponent(message);
};

export const getWhatsAppUrl = (data) => {
    const phone = '919311073365';
    const text = formatWhatsAppMessage(data);
    return `https://wa.me/${phone}?text=${text}`;
};
