import React, { useContext, useEffect, useRef } from "react";
import { LanguageContext } from "../../../context/LanguageContext";
import "./EligibilityHighlightSection.css";

const EligibilityHighlightSection = () => {

    const { language } = useContext(LanguageContext);
    const sectionRef = useRef(null);

    /* Scroll Fade-In */
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const content = {
        en: {
            title: "Basic Eligibility Criteria",
            subtitle: "Make sure you meet these requirements before applying",
            cards: [
                {
                    icon: "🎓",
                    title: "Minimum Qualification",
                    desc: "10th Pass or above"
                },
                {
                    icon: "📅",
                    title: "Age Requirement",
                    desc: "18 to 70 Years"
                },
                {
                    icon: "📍",
                    title: "Location",
                    desc: "Delhi NCR (Phase 1)"
                },
                {
                    icon: "💼",
                    title: "Career Type",
                    desc: "Commission-Based LIC Agency Role"
                }
            ],
            note:
                "No registration fee. Selection subject to eligibility verification."
        },
        hi: {
            title: "मूल पात्रता मानदंड",
            subtitle: "आवेदन करने से पहले इन आवश्यकताओं की पुष्टि करें",
            cards: [
                {
                    icon: "🎓",
                    title: "न्यूनतम योग्यता",
                    desc: "10वीं पास या उससे अधिक"
                },
                {
                    icon: "📅",
                    title: "आयु सीमा",
                    desc: "18 से 70 वर्ष"
                },
                {
                    icon: "📍",
                    title: "स्थान",
                    desc: "दिल्ली NCR (Phase 1)"
                },
                {
                    icon: "💼",
                    title: "करियर प्रकार",
                    desc: "कमीशन आधारित LIC एजेंसी भूमिका"
                }
            ],
            note:
                "कोई रजिस्ट्रेशन शुल्क नहीं। चयन पात्रता जांच पर निर्भर करता है।"
        }
    };

    const t = content[language] || content.en;

    return (
        <section ref={sectionRef} className="eligibility-section fade-in-section">

            <div className="eligibility-container">

                <h2>{t.title}</h2>
                <p className="eligibility-subtitle">{t.subtitle}</p>

                <div className="eligibility-grid">
                    {t.cards.map((card, index) => (
                        <div key={index} className="eligibility-card">
                            <div className="eligibility-icon">{card.icon}</div>
                            <h3>{card.title}</h3>
                            <p>{card.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="eligibility-note">
                    {t.note}
                </div>

            </div>

        </section>
    );
};

export default EligibilityHighlightSection;