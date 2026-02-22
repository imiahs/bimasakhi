import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '../components/core/SEOHead';
import { UserContext } from '../context/UserContext';
import { LanguageContext } from '../context/LanguageContext';
import '../styles/AdsLanding.css';
import Testimonials from '../components/dynamic/Testimonials';

const AdsLanding = () => {
    const { setSource } = useContext(UserContext);
    const { language } = useContext(LanguageContext);
    const navigate = useNavigate();

    useEffect(() => {
        setSource('ads');
    }, []);

    const handleApplyClick = () => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "ads_landing_apply_click"
        });

        navigate('/apply?source=ads');
    };

    const content = {
        en: {
            heroTitle: "Become a Successful Bima Sakhi (LIC Agent)",
            heroSub: "A Respectable & Flexible Career Opportunity in Delhi NCR",
            heroTrust: "3 Years Stipend + Commission | Free Training | No Joining Fee",
            heroBtn: "Check Eligibility & Apply Now",

            whyTitle: "Why Become a LIC Agent?",
            whyText: "Becoming a LIC Agent is not just about income — it is about identity, respect, and financial independence.",
            whyPoints: [
                "Complete control over your income",
                "Flexible working hours",
                "Respect in society",
                "Opportunity to secure families",
                "Long-term growth potential"
            ],

            bsTitle: "Special Benefits under Bima Sakhi",
            bsPoints: [
                "Monthly Stipend for 3 Years (₹7000 → ₹6000 → ₹5000)",
                "Dedicated training & guidance",
                "Safe start for beginners",
                "Strong support system"
            ],

            socialProofTitle: "2.5 Lakh+ Women Across India Have Already Joined",
            socialProofText: "You are not alone. Thousands of women are building successful LIC careers across India.",

            fearTitle: "Thinking 'Can I Really Do This?'",
            fearText: "Every successful agent started from zero. With proper guidance and effort, you can build your own respected career.",

            finalCTA: "Take the First Step Towards Your Independent Future",
            finalBtn: "Apply Now"
        },

        hi: {
            heroTitle: "बनिए एक सफल Bima Sakhi (LIC एजेंट)",
            heroSub: "दिल्ली NCR में सम्मानजनक और लचीला करियर अवसर",
            heroTrust: "3 साल स्टाइपेंड + कमीशन | निःशुल्क प्रशिक्षण | कोई जॉइनिंग फीस नहीं",
            heroBtn: "अपनी योग्यता जांचें और आवेदन करें",

            whyTitle: "LIC एजेंट क्यों बनें?",
            whyText: "LIC एजेंट बनना सिर्फ कमाई नहीं, बल्कि पहचान, सम्मान और आर्थिक स्वतंत्रता है।",
            whyPoints: [
                "अपनी आय पर पूरा नियंत्रण",
                "समय की स्वतंत्रता",
                "समाज में सम्मान",
                "परिवारों को सुरक्षा देने का अवसर",
                "लंबी अवधि का विकास"
            ],

            bsTitle: "Bima Sakhi के विशेष लाभ",
            bsPoints: [
                "3 साल मासिक स्टाइपेंड (₹7000 → ₹6000 → ₹5000)",
                "विशेष प्रशिक्षण और मार्गदर्शन",
                "सुरक्षित शुरुआत",
                "मजबूत सपोर्ट सिस्टम"
            ],

            socialProofTitle: "2.5 लाख+ महिलाएं पूरे भारत में जुड़ चुकी हैं",
            socialProofText: "आप अकेली नहीं हैं। हजारों महिलाएं LIC एजेंट बनकर सफल करियर बना रही हैं।",

            fearTitle: "क्या आप सोच रही हैं कि क्या मैं कर पाऊंगी?",
            fearText: "हर सफल एजेंट ने शून्य से शुरुआत की थी। सही मार्गदर्शन और मेहनत से आप भी सफल बन सकती हैं।",

            finalCTA: "अपने आत्मनिर्भर भविष्य की ओर पहला कदम उठाएं",
            finalBtn: "अभी आवेदन करें"
        }
    };

    const t = content[language] || content.en;

    return (
        <div className="ads-landing">

            <SEOHead
                title="Bima Sakhi – LIC Agency Career Opportunity in Delhi NCR"
                description="Join Bima Sakhi LIC Agency opportunity in Delhi NCR. 3-year stipend + commission-based career. Empowering women across India."
                path="/bima-sakhi-delhi"
            />
            <div className="ads-countdown">
                Limited Phase-1 Onboarding for Delhi NCR – Applications Closing Soon
            </div>
            {/* HERO */}
            <section className="ads-hero">
                <div className="ads-container ads-hero-flex">
                    <div className="ads-hero-text">
                        <h1>{t.heroTitle}</h1>
                        <p className="ads-sub">{t.heroSub}</p>
                        <p className="ads-trust">{t.heroTrust}</p>
                        <button className="ads-btn-primary" onClick={handleApplyClick}>
                            {t.heroBtn}
                        </button>
                    </div>

                    <div className="ads-hero-img">
                        <img
                            src="/Bima_Sakhi_Ai.png"
                            alt="Confident Bima Sakhi"
                        />
                    </div>
                </div>
            </section>

            {/* WHY LIC */}
            <section className="ads-section light">
                <div className="ads-container">
                    <h2>{t.whyTitle}</h2>
                    <p className="section-desc">{t.whyText}</p>
                    <ul className="ads-list">
                        {t.whyPoints.map((point, i) => (
                            <li key={i}>✔ {point}</li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* BIMA SAKHI BENEFITS */}
            <section className="ads-section">
                <div className="ads-container">
                    <h2>{t.bsTitle}</h2>
                    <ul className="ads-list">
                        {t.bsPoints.map((point, i) => (
                            <li key={i}>✔ {point}</li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* SOCIAL PROOF */}
            <section className="ads-section highlight">
                <div className="ads-container">
                    <h2>{t.socialProofTitle}</h2>
                    <p>{t.socialProofText}</p>
                </div>
            </section>

            {/* FEAR REMOVAL */}
            <section className="ads-section light">
                <div className="ads-container">
                    <h2>{t.fearTitle}</h2>
                    <p>{t.fearText}</p>
                </div>
            </section>
            <Testimonials />
            {/* FINAL CTA */}
            <section className="ads-final">
                <div className="ads-container">
                    <h2>{t.finalCTA}</h2>
                    <button className="ads-btn-primary" onClick={handleApplyClick}>
                        {t.finalBtn}
                    </button>
                </div>
            </section>

        </div>
    );
};

export default AdsLanding;