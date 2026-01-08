import React, { useContext, useEffect } from 'react';
import { ConfigContext } from '../context/ConfigContext';
import { UserContext } from '../context/UserContext';
import SectionRenderer from '../components/core/SectionRenderer';

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
            {/* Dynamic Render Engine */}
            <SectionRenderer sections={sections} />
        </div>
    );
};

export default Home;

