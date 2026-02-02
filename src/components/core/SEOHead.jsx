import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEOHead = ({
    title,
    description,
    path,
    ogImage = 'images/home/hero-bg.jpg', // Default Ad Creative
    schema = null
}) => {
    const location = useLocation();
    const currentUrl = `https://www.bimasakhi.com${path || location.pathname}`;

    // Organization Schema (Safe Context)
    const orgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Bima Sakhi",
        "url": "https://www.bimasakhi.com",
        "logo": "https://www.bimasakhi.com/images/logo.png", // Assuming logo exists or will exist, purely metadata
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "email": "info@bimasakhi.com",
            "telephone": "+91 9311073365",
            "areaServed": "Delhi NCR",
            "availableLanguage": ["Hindi", "English"]
        },
        "areaServed": "Delhi NCR",
        "slogan": "Women Career & Financial Independence"
    };

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph / Facebook / WhatsApp */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={`https://www.bimasakhi.com${ogImage}`} />
            <meta property="og:locale" content="hi_IN" />
            <meta property="og:site_name" content="Bima Sakhi" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={currentUrl} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={`https://www.bimasakhi.com${ogImage}`} />

            {/* Schema.org JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(orgSchema)}
            </script>

            {/* Page Specific Schema */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEOHead;
