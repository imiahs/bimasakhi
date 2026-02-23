import React, { useContext, useEffect, useRef } from "react";
import { LanguageContext } from "../../../context/LanguageContext";
import "./PrestigeClubsSection.css";

const PrestigeClubsSection = () => {

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

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const content = {
        en: {
            title: "Performance-Based Prestige & Recognition",
            subtitle:
                "LIC Agency Career rewards excellence through structured national and global achievement clubs.",
            licClubsTitle: "LIC Achievement Clubs",
            licClubs: [
                { name: "BM Club", icon: "🥇" },
                { name: "DM Club", icon: "🏆" },
                { name: "ZM Club", icon: "🎖️" },
                { name: "CM Club", icon: "🏅" },
                { name: "Galaxy Club", icon: "🌌" },
                { name: "Corporate Club", icon: "🏢" },
                { name: "Elite Club", icon: "👑" }
            ],
            globalTitle: "Global Recognition Clubs",
            globalClubs: [
                { name: "MDRT", desc: "Million Dollar Round Table" },
                { name: "COT", desc: "Court of the Table" },
                { name: "TOT", desc: "Top of the Table" }
            ],
            dream: "Dream Big. Perform Big. Rise Globally.",
            note:
                "Club qualification depends on performance criteria defined by LIC and international bodies."
        },
        hi: {
            title: "प्रदर्शन आधारित प्रतिष्ठा और मान्यता",
            subtitle:
                "LIC एजेंसी करियर उत्कृष्ट प्रदर्शन पर राष्ट्रीय और वैश्विक क्लबों के माध्यम से पहचान देता है।",
            licClubsTitle: "LIC उपलब्धि क्लब",
            licClubs: [
                { name: "BM क्लब", icon: "🥇" },
                { name: "DM क्लब", icon: "🏆" },
                { name: "ZM क्लब", icon: "🎖️" },
                { name: "CM क्लब", icon: "🏅" },
                { name: "Galaxy क्लब", icon: "🌌" },
                { name: "Corporate क्लब", icon: "🏢" },
                { name: "Elite क्लब", icon: "👑" }
            ],
            globalTitle: "वैश्विक मान्यता क्लब",
            globalClubs: [
                { name: "MDRT", desc: "मिलियन डॉलर राउंड टेबल" },
                { name: "COT", desc: "कोर्ट ऑफ द टेबल" },
                { name: "TOT", desc: "टॉप ऑफ द टेबल" }
            ],
            dream: "बड़ा सोचें। बड़ा प्रदर्शन करें। वैश्विक स्तर तक पहुँचें।",
            note:
                "क्लब पात्रता LIC और अंतरराष्ट्रीय निकायों द्वारा निर्धारित प्रदर्शन मानकों पर आधारित होती है।"
        }
    };

    const t = content[language] || content.en;

    return (
        <section ref={sectionRef} className="prestige-section fade-in-section">

            <div className="prestige-container">

                <h2>{t.title}</h2>
                <p className="prestige-subtitle">{t.subtitle}</p>

                {/* LIC Clubs */}
                <div className="club-group">
                    <h3>{t.licClubsTitle}</h3>
                    <div className="club-grid">
                        {t.licClubs.map((club, index) => (
                            <div key={index} className="club-card">
                                <div className="club-icon">{club.icon}</div>
                                {club.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Global Clubs */}
                <div className="club-group global">
                    <h3>{t.globalTitle}</h3>
                    <div className="club-grid">
                        {t.globalClubs.map((club, index) => (
                            <div key={index} className="club-card premium">
                                <div className="premium-badge">🌟</div>
                                <div className="global-name">{club.name}</div>
                                <div className="global-desc">{club.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dream-message">
                    {t.dream}
                </div>

                <div className="prestige-note">
                    {t.note}
                </div>

            </div>

        </section>
    );
};

export default PrestigeClubsSection;