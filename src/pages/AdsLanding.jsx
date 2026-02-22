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
            source: "google_ads"
        });

        navigate('/apply?source=google_ads');
    };

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

            urgency: "Limited Phase-1 Onboarding for Delhi NCR – Apply Before Seats Fill",

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

            urgency: "दिल्ली NCR के लिए सीमित Phase-1 ऑनबोर्डिंग – सीटें सीमित हैं",

            finalCTA: "अपने आत्मनिर्भर भविष्य की ओर पहला कदम उठाएं",
            finalBtn: "अभी आवेदन करें"
        }
    };

    const t = content[language] || content.en;

    return (
        <div className="ads-landing-wrapper">

            {/* ================= SEO ================= */}
            <SEOHead
                title="Bima Sakhi – LIC Agency Career Opportunity in Delhi NCR"
                description="Join Bima Sakhi LIC Agency opportunity in Delhi NCR. 3-year stipend support + commission-based career. Empowering agents across India."
                path="/bima-sakhi-delhi"
            />

            {/* ================= URGENCY STRIP ================= */}
            <div className="ads-urgency-bar">
                {t.urgency}
            </div>

            {/* ================= HERO SECTION ================= */}
            <Hero
                isAdsMode={true}
                customTitle={t.heroTitle}
                customSubtitle={t.heroSub}
                customTrust={t.heroTrust}
                primaryCTA={t.heroBtn}
            />

            {/* ================= QUICK INFO STRIP ================= */}
            <QuickInfoStrip />

            {/* ================= EMOTIONAL CONVERSION SECTION ================= */}
            <section className="ads-section light">
                <div className="ads-container">
                    <h2>{t.emotionalTitle}</h2>
                    <p className="section-description">
                        {t.emotionalText}
                    </p>
                </div>
            </section>

            {/* ================= SOCIAL PROOF BLOCK ================= */}
            <section className="ads-section highlight">
                <div className="ads-container">
                    <h2>{t.socialProofTitle}</h2>
                    <p>{t.socialProofText}</p>
                </div>
            </section>

            {/* ================= TESTIMONIALS ================= */}
            <Testimonials />

            {/* ================= FINAL CTA ================= */}
            <section className="ads-final-cta">
                <div className="ads-container">
                    <h2>{t.finalCTA}</h2>

                    <button
                        className="ads-btn-primary"
                        onClick={handleApplyClick}
                    >
                        {t.finalBtn}
                    </button>
                </div>
            </section>

        </div>
    );
};

export default AdsLanding;