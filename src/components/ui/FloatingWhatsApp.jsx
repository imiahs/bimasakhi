import React from 'react';
import "../../styles/FloatingActions.css";

const FloatingWhatsApp = () => {

    const getUTMSource = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("source") || "direct";
    };

    const handleClick = () => {

        const source = getUTMSource();

        // Google Tag Manager Event
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "whatsapp_click",
            source: source,
            location: "floating_button"
        });
    };

    const source = getUTMSource();

    const whatsappURL = `https://wa.me/919311073365?text=Hi%20I%20am%20interested%20in%20Bima%20Sakhi%20Opportunity%20(Source:%20${source})`;

    return (
        <a
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            className="floating-pill whatsapp-pill"
            onClick={handleClick}
        >
            💬 WhatsApp
        </a>
    );
};

export default FloatingWhatsApp;