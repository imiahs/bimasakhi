// ============================================
// AdsLanding.jsx
// Purpose: High Conversion Google Ads Landing Page
// Target: Delhi NCR (Phase 1)
// Strategy: Fast clarity + Emotional trigger + Social proof + Clear CTA
// ============================================

import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import SEOHead from '../components/core/SEOHead';
import { UserContext } from '../context/UserContext';
import { LanguageContext } from '../context/LanguageContext';

// Reusable Components
import Hero from '../features/dynamic-home/components/dynamic/Hero';
import Testimonials from '../features/dynamic-home/components/dynamic/Testimonials';
import QuickInfoStrip from '../features/ads-landing/components/QuickInfoStrip';
import UrgencyTicker from '../features/ads-landing/components/UrgencyTicker';
import EmotionalSection from '../features/ads-landing/components/EmotionalSection';
import SocialProofSection from '../features/ads-landing/components/SocialProofSection';
import FinalCTASection from '../features/ads-landing/components/FinalCTASection';
import IncomeJourneySection from '../features/ads-landing/components/IncomeJourneySection';
import PerformanceTierSection from '../features/ads-landing/components/PerformanceTierSection';
import EligibilityHighlightSection from '../features/ads-landing/components/EligibilityHighlightSection';
import TrustMicroSection from '../features/ads-landing/components/TrustMicroSection';
import PrestigeClubsSection from '../features/ads-landing/components/PrestigeClubsSection';
import '../styles/AdsLanding.css';


const AdsLanding = () => {

    // ---------------- CONTEXT ----------------
    const { setSource } = useContext(UserContext);
    const { language } = useContext(LanguageContext);
    const navigate = useNavigate();

    // ---------------- SET TRAFFIC SOURCE ----------------
    useEffect(() => {
        setSource('google_ads');
    }, [setSource]);

    // ---------------- CTA HANDLER ----------------
    const handleApplyClick = () => {

        // Google Tag Manager Event
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "ads_landing_apply_click",
            page: "ads_landing",
            source: "google_ads"
        });

        navigate('/apply?source=google_ads');
    };
    // Structured Data (Job Posting Style - Cleaner SEO Signal)
    const jobSchema = useMemo(() => ({
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": "LIC Insurance Advisor – Bima Sakhi Program",
        "description": "Commission-based LIC agency career opportunity for women in Delhi NCR. Flexible income, training support and long-term growth.",
        "employmentType": "Contractor",
        "hiringOrganization": {
            "@type": "Organization",
            "name": "Bima Sakhi",
            "sameAs": "https://bimasakhi.com"
        },
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Delhi NCR",
                "addressCountry": "IN"
            }
        }
    }), []);
    // ---------------- BILINGUAL CONTENT ----------------
    const content = {
        en: {
            heroTitle: "Become a Successful LIC Agent with Bima Sakhi Support",
            heroSub: "A Flexible, Respectable & Commission-Based Career in Delhi NCR",
            heroTrust: "3 Years Stipend Support | Free Training | No Joining Fee",
            heroBtn: "Check Eligibility & Apply Now",

            emotionalTitle: "Why Do People Choose LIC Agency Career?",
            emotionalText:
                "Because it gives freedom. Income control. Respect in society. And the power to build your own identity.",

            socialProofTitle: "2.5 Lakh+ Women Have Already Joined Across India",
            socialProofText:
                "Thousands have transformed their lives through this opportunity.",


            finalCTA: "Take the First Step Towards Your Independent Future",
            finalBtn: "Apply Now"
        },

        hi: {
            heroTitle: "Bima Sakhi सपोर्ट के साथ सफल LIC एजेंट बनें",
            heroSub: "दिल्ली NCR में लचीला, सम्मानजनक और कमीशन आधारित करियर",
            heroTrust: "3 साल स्टाइपेंड सहायता | निःशुल्क प्रशिक्षण | कोई जॉइनिंग फीस नहीं",
            heroBtn: "अपनी योग्यता जांचें और आवेदन करें",

            emotionalTitle: "लोग LIC एजेंट क्यों बनते हैं?",
            emotionalText:
                "क्योंकि यह देता है स्वतंत्रता। आय पर नियंत्रण। समाज में सम्मान। और अपनी पहचान बनाने का अवसर।",

            socialProofTitle: "2.5 लाख+ महिलाएं पूरे भारत में जुड़ चुकी हैं",
            socialProofText:
                "हजारों लोगों ने इस अवसर से अपना जीवन बदला है।",


            finalCTA: "अपने आत्मनिर्भर भविष्य की ओर पहला कदम उठाएं",
            finalBtn: "अभी आवेदन करें"
        }
    };

    const t = content[language] || content.en;

    return (
        <div className="ads-landing-wrapper">

            {/* ================= SEO ================= */}
            <SEOHead
                title="Bima Sakhi Delhi – Commission Based LIC Career for Women"
                description="Join Bima Sakhi LIC agency opportunity in Delhi, Noida & Ghaziabad. 3-year stipend support + commission-based career. Apply if serious."
                path="/bima-sakhi-delhi"
                ogImage="/images/home/community.jpg"
                schema={jobSchema}
            />

            {/* ================= URGENCY STRIP ================= */}
            <UrgencyTicker />

            {/* ================= HERO SECTION ================= */}
            <Hero
                isAdsMode={true}
                customTitle={t.heroTitle}
                customSubtitle={t.heroSub}
                customTrust={t.heroTrust}
                primaryCTA={t.heroBtn}
                onApplyClick={handleApplyClick}
            />

            {/* ================= QUICK INFO STRIP ================= */}
            <QuickInfoStrip />

            {/* ================= EMOTIONAL CONVERSION SECTION ================= */}
            <EmotionalSection />
            {/* ================= INCOME JOURNEY SECTION ================= */}
            <IncomeJourneySection />
            {/* ================= PERFORMANCE TIER SECTION ================= */}
            <PerformanceTierSection />
            {/* ================= ELIGIBILITY HIGHLIGHT SECTION ================= */}
            <EligibilityHighlightSection />
            {/* ================= TRUST MICRO SECTION ================= */}
            <TrustMicroSection />
            {/* ================= PRESTIGE CLUBS SECTION ================= */}
            <PrestigeClubsSection />
            {/* ================= SOCIAL PROOF BLOCK ================= */}
            <SocialProofSection />

            {/* ================= TESTIMONIALS ================= */}
            <Testimonials />

            {/* ================= FINAL CTA ================= */}
            <FinalCTASection onApplyClick={handleApplyClick} />

        </div>
    );
};

export default AdsLanding;