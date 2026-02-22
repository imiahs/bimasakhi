import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../../components/ui/Button';
import { LanguageContext } from '../../../../context/LanguageContext';
import './Hero.css';

const Hero = ({
    isAdsMode = false,
    customTitle,
    customSubtitle,
    customTrust,
    primaryCTA,
    secondaryCTA
}) => {
    const { language } = useContext(LanguageContext);
    const navigate = useNavigate();

    const content = {
        en: {
            title: "Become a Successful Bima Sakhi (LIC Agent)",
            subtitle: "A Respectable & Flexible Career Opportunity in Delhi NCR",
            trust: "3 Years Stipend + Commission | Free Training | No Joining Fee",
            cta: "Apply Now (2 Mins)",
            ctaSecondary: "See Details First"
        },
        hi: {
            title: "बनिए एक सफल Bima Sakhi (LIC एजेंट)",
            subtitle: "दिल्ली NCR में सम्मानजनक और लचीला करियर अवसर",
            trust: "3 साल स्टाइपेंड + कमीशन | निःशुल्क प्रशिक्षण | कोई जॉइनिंग फीस नहीं",
            cta: "अभी अप्लाई करें (2 मिनट)",
            ctaSecondary: "पहले पूरी जानकारी देखें"
        }
    };

    const t = content[language] || content.en;

    const handlePrimaryClick = () => {
        if (isAdsMode) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: "ads_hero_apply_click"
            });

            navigate('/apply?source=ads');
        }
    };

    return (
        <section className="hero-section relative overflow-hidden bg-gradient-to-b from-blue-900 to-blue-600 text-white pt-16 pb-20">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12">

                    {/* TEXT */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left z-10">

                        <div className="inline-block bg-white text-blue-700 px-4 py-1 rounded-full text-xs font-semibold mb-6 shadow-sm">
                            {customTrust || t.trust}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
                            {customTitle || t.title}
                        </h1>

                        <p className="text-lg opacity-90 mb-8">
                            {customSubtitle || t.subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

                            {isAdsMode ? (
                                <Button
                                    variant="primary"
                                    className="text-lg px-8 py-4 shadow-xl"
                                    onClick={handlePrimaryClick}
                                >
                                    {primaryCTA || t.cta}
                                </Button>
                            ) : (
                                <Link to="/apply">
                                    <Button variant="primary" className="text-lg px-8 py-4 shadow-xl">
                                        {t.cta}
                                    </Button>
                                </Link>
                            )}

                            {!isAdsMode && (
                                <a href="#trust_default">
                                    <Button variant="secondary" className="text-lg px-8 py-4 bg-white text-gray-700">
                                        {secondaryCTA || t.ctaSecondary}
                                    </Button>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* IMAGE */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                            <img
                                src="/Bima_Sakhi_Ai.png"
                                alt="Confident Bima Sakhi"
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;