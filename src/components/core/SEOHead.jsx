import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SEOHead = ({
    title = "Bima Sakhi",
    description = "Women career & financial independence opportunity.",
    path,
    ogImage = "/images/home/hero-bg.jpg",
    noIndex = false,
    schema = null
}) => {

    const location = useLocation();

    // 🔥 IMPORTANT: Keep domain consistent (choose ONE version only)
    const baseUrl = "https://bimasakhi.com";

    // If path is passed, use it. Otherwise use current route.
    const currentPath = path || location.pathname;
    const currentUrl = `${baseUrl}${currentPath}`;

    const fullImageUrl = `${baseUrl}${ogImage}`;

    return (
        <Helmet prioritizeSeoTags>

            {/* ===== PRIMARY META ===== */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={currentUrl} />

            {noIndex && <meta name="robots" content="noindex, nofollow" />}

            {/* ===== OPEN GRAPH ===== */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImageUrl} />
            <meta property="og:site_name" content="Bima Sakhi" />

            {/* ===== TWITTER ===== */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImageUrl} />

            {/* ===== OPTIONAL SCHEMA ===== */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}

        </Helmet>
    );
};

export default SEOHead;