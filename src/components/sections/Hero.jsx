import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { LanguageContext } from '../../context/LanguageContext';

const Hero = ({ isAdsMode = false }) => {
    const { language } = useContext(LanguageContext);

    const content = {
        en: {
            title: "Government Backed Career for Women",
            subtitle: "Join LIC as an Agent. Work from home, earn commission, and get financial independence.",
            cta: "Apply Now (2 Mins)",
            trust: "✅ 100% Free Training | 🏛️ Govt Supported"
        },
        hi: {
            title: "LIC के साथ जुड़कर अपना करियर बनाएं",
            subtitle: "घर बैठे काम करें, कमीशन कमाएं और आत्मनिर्भर बनें। सरकारी सपोर्ट के साथ।",
            cta: "अभी अप्लाई करें (2 मिनट)",
            trust: "✅ 100% फ्री ट्रेनिंग | 🏛️ सरकारी सपोर्ट"
        }
    };

    const t = content[language];

    return (
        <section className="hero-section relative overflow-hidden bg-gradient-to-b from-pink-50 to-white pt-12 pb-16 lg:pt-20 lg:pb-24">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12">

                    {/* Text Column */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
                        <div className="inline-block bg-white px-3 py-1 rounded-full border border-pink-100 text-xs text-pink-600 font-semibold mb-6 shadow-sm">
                            {t.trust}
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                            {t.title}
                        </h1>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                            {t.subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/apply" className="w-full sm:w-auto">
                                <Button variant="primary" className="w-full text-lg px-8 py-4 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                                    {t.cta}
                                </Button>
                            </Link>

                        </div>
                    </div>

                    {/* Image Column */}
                    <div className="w-full lg:w-1/2 relative">
                        {/* Blob Background Effect */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-pink-100 rounded-full blur-3xl opacity-60 -z-10"></div>

                        {/* Placeholder for Professional Woman Image - Using CSS Logic to simulate visual if image fails */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-all duration-500">
                            <img
                                src="/hero-woman-professional.jpg"
                                alt="Professional Indian Woman"
                                className="w-full h-auto object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none'; // Fallback if image missing
                                    e.target.parentNode.style.backgroundColor = '#fce7f3'; // Pink fallback
                                    e.target.parentNode.innerHTML = '<div class="p-12 text-center text-pink-800 font-bold text-xl">👩‍💼<br/>Aatmanirbhar Baniyen</div>';
                                }}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
