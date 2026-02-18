// ⚠️ Temporary static homepage (V1 fast ship)
// Will be replaced by dynamic SectionRenderer in V2

import React from 'react';
import './homepage.css'; // Phase 5B: Styles
import SEOHead from '../components/core/SEOHead';

// Section Imports (Locked Order)
import HeroSection from './HeroSection';
import WhatIsBimaSakhi from './WhatIsBimaSakhi';
import WhoItIsFor from './WhoItIsFor';
import ProcessOverview from './ProcessOverview';
import TransparencySection from './TransparencySection';
import SocialProofSection from './SocialProofSection';
import AuthoritySection from './AuthoritySection';
import BenefitsSection from './BenefitsSection';
import LocalTrustSection from './LocalTrustSection';
import FAQSection from './FAQSection';
import FinalCTASection from './FinalCTASection';

const HomePage = () => {
    return (
        <div className="homepage-wrapper">
            <SEOHead
                title="Bima Sakhi - LIC Agency Career for Women (Delhi NCR)"
                description="Opportunity for women to start an independent LIC agency in Delhi NCR. No fixed salary, full commission-based career."
                path="/"
            />

            <HeroSection />
            <WhatIsBimaSakhi />
            <WhoItIsFor />
            <ProcessOverview />
            <TransparencySection />
            <SocialProofSection />
            <AuthoritySection />
            <BenefitsSection />
            <LocalTrustSection />
            <FAQSection />
            <FinalCTASection />
        </div>
    );
};

export default HomePage;
