import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../../context/LanguageContext';
import Button from '../ui/Button';

const HowItWorks = () => {
    const { language } = useContext(LanguageContext);

    const text = {
        en: {
            title: "How to Start?",
            steps: [
                { num: 1, title: "Apply Online", desc: "Fill simple form in 2 mins" },
                { num: 2, title: "Get Training", desc: "Online exam prep (25 Hours)" },
                { num: 3, title: "Start Earning", desc: "Get License & Commission" }
            ],
            cta: "Start Application"
        },
        hi: {
            title: "शुरुआत कैसे करें?",
            steps: [
                { num: 1, title: "फॉर्म भरें", desc: "सिर्फ 2 मिनट में अर्जी डालें" },
                { num: 2, title: "ट्रेनिंग पाएं", desc: "ऑनलाइन एग्जाम की तैयारी (25 घंटे)" },
                { num: 3, title: "कमाई शुरू", desc: "लाइसेंस पाएं और कमीशन कमाएं" }
            ],
            cta: "अभी फॉर्म भरें"
        }
    };

    const t = text[language];

    return (
        <section className="py-8 bg-gray-50">
            <div className="container text-center">
                <h2 className="text-2xl font-bold mb-8 text-gray-800">{t.title}</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 relative">
                    {/* Visual Connector Line (Hidden on Mobile) */}
                    <div className="hidden md:block absolute top-6 left-1/6 right-1/6 h-1 bg-gray-200 -z-10"></div>

                    {t.steps.map((step, index) => (
                        <div key={index} className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border-4 border-white shadow-md">
                                {step.num}
                            </div>
                            <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                            <p className="text-gray-600 text-sm">{step.desc}</p>
                        </div>
                    ))}
                </div>

                <Link to="/apply">
                    <Button variant="primary" className="px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all">
                        {t.cta} ➝
                    </Button>
                </Link>
            </div>
        </section>
    );
};

export default HowItWorks;
