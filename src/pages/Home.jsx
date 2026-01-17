import React, { useContext, useEffect } from 'react';
import { ConfigContext } from '../context/ConfigContext';
import { UserContext } from '../context/UserContext';
import SectionRenderer from '../components/core/SectionRenderer';
import FloatingCTA from '../components/ui/FloatingCTA';
import SEOHead from '../components/core/SEOHead';
import FAQSchema from '../components/core/FAQSchema';

const Home = () => {
    const { config } = useContext(ConfigContext);
    const { markPageVisited, setSource } = useContext(UserContext);

    useEffect(() => {
        markPageVisited('home');
        setSource('website');
    }, []);

    // Fallback if config isn't loaded or page is missing
    const pageConfig = config.pages?.home;
    const sections = pageConfig?.sections || [];

    if (!pageConfig) {
        return <div className="p-8 text-center">Loading Content...</div>;
    }

    return (
        <div className="page-home">
            <SEOHead
                title="Bima Sakhi – महिलाओं के लिए LIC करियर (Delhi NCR)"
                description="10वीं पास महिलाओं के लिए सरकारी समर्थित करियर। कोई फिक्स सैलरी नहीं – कमीशन आधारित अवसर। आज ही अप्लाई करें।"
                path="/"
            />
            <FAQSchema />
            {/* Dynamic Render Engine */}
            <SectionRenderer sections={sections} />
            <FloatingCTA />
        </div>
    );
};

export default Home;

