import React, { useContext, useEffect, useRef } from "react";
import { LanguageContext } from "../../../context/LanguageContext";
import "./TrustMicroSection.css";

const TrustMicroSection = () => {

    const { language } = useContext(LanguageContext);
    const sectionRef = useRef(null);

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
            title: "Why You Can Trust This Opportunity",
            points: [
                {
                    icon: "🏛️",
                    title: "Government-Backed LIC Framework",
                    desc: "Operates under LIC of India structure and regulatory norms."
                },
                {
                    icon: "💰",
                    title: "No Registration Fee",
                    desc: "No hidden charges. No joining cost at this stage."
                },
                {
                    icon: "📋",
                    title: "Transparent Selection Process",
                    desc: "Eligibility verification and structured onboarding."
                },
                {
                    icon: "🤝",
                    title: "Dedicated Guidance & Support",
                    desc: "Personal mentoring during early career stage."
                }
            ],
            footer:
                "This is a commission-based LIC agency career opportunity. Not a salaried job."
        },
        hi: {
            title: "आप इस अवसर पर भरोसा क्यों कर सकते हैं",
            points: [
                {
                    icon: "🏛️",
                    title: "LIC के नियामक ढांचे के अंतर्गत",
                    desc: "LIC of India की संरचना और नियमों के अनुसार संचालन।"
                },
                {
                    icon: "💰",
                    title: "कोई रजिस्ट्रेशन शुल्क नहीं",
                    desc: "कोई छुपा शुल्क या जॉइनिंग फीस नहीं।"
                },
                {
                    icon: "📋",
                    title: "पारदर्शी चयन प्रक्रिया",
                    desc: "पात्रता सत्यापन और संरचित ऑनबोर्डिंग।"
                },
                {
                    icon: "🤝",
                    title: "समर्पित मार्गदर्शन",
                    desc: "शुरुआती चरण में व्यक्तिगत सहायता।"
                }
            ],
            footer:
                "यह एक कमीशन आधारित LIC एजेंसी अवसर है, वेतन वाली नौकरी नहीं।"
        }
    };

    const t = content[language] || content.en;

    return (
        <section ref={sectionRef} className="trust-section fade-in-section">

            <div className="trust-container">

                <h2>{t.title}</h2>

                <div className="trust-grid">
                    {t.points.map((item, index) => (
                        <div key={index} className="trust-card">
                            <div className="trust-icon">{item.icon}</div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="trust-footer">
                    {t.footer}
                </div>

            </div>

        </section>
    );
};

export default TrustMicroSection;