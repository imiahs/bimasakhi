import React from 'react';

const FAQSchema = () => {
    // Strictly copied from FAQ.jsx (Phase 5.7 content)
    const faqData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Bima Sakhi क्या है?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "यह LIC की योजना है जिसमें महिलाएँ एजेंट बनकर आत्मनिर्भर बनती हैं।"
                }
            },
            {
                "@type": "Question",
                "name": "क्या सैलरी मिलती है?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "नहीं। यह कमीशन आधारित काम है। शुरुआती समय में स्टाइपेंड का सपोर्ट हो सकता है।"
                }
            },
            {
                "@type": "Question",
                "name": "उम्र और पढ़ाई?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "10वीं पास और उम्र 18 से 70 वर्ष।"
                }
            },
            {
                "@type": "Question",
                "name": "क्या घर से काम हो सकता है?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "हाँ। ज़्यादातर काम डिजिटल है।"
                }
            }
        ]
    };

    return (
        null // The schema is injected via SEOHead usually, but since this is a standalone component requested by prompt as JSON-LD generator, 
        // we can either return a Helmet or just the object. 
        // However, to keep it clean and composable, I'll return the object structure to be passed into SEOHead or return a Helmet script block directly.
        // Given the prompt asked for "FAQSchema.jsx (JSON-LD only)", I will make it return a script tag wrapped in fragment or just use it inside Home.
        // Actually, simpler: Let it be a component that renders the script tag.
        < script type = "application/ld+json" dangerouslySetInnerHTML = {{ __html: JSON.stringify(faqData) }
} />
    );
};

export default FAQSchema;
