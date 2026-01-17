import React, { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const Testimonials = () => {
    const { language } = useContext(LanguageContext);

    const stories = {
        en: {
            title: "Real Stories of Women",
            items: [
                {
                    name: "Suman",
                    loc: "Delhi",
                    role: "Homemaker to Agent",
                    text: "I started after 10th pass. Today I am able to support my family independently."
                },
                {
                    name: "Pooja",
                    loc: "Noida",
                    role: "Digital Agent",
                    text: "Digital training made the work very easy. I gained respect too."
                }
            ]
        },
        hi: {
            title: "महिलाओं की असली कहानियाँ",
            items: [
                {
                    name: "सुमन",
                    loc: "दिल्ली",
                    role: "गृहिणी से एजेंट",
                    text: "मैंने 10वीं पास के बाद शुरुआत की। आज मैं अपने परिवार को सपोर्ट कर पा रही हूँ।"
                },
                {
                    name: "पूजा",
                    loc: "नॉएडा",
                    role: "डिजिटल एजेंट",
                    text: "डिजिटल ट्रेनिंग से काम बहुत आसान हो गया। सम्मान भी मिला।"
                }
            ]
        }
    };

    const t = stories[language];

    console.log("Testimonials rendering for language:", language); // Debug log

    return (
        <section className="py-12 bg-white">
            <div className="container px-4 mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    {t.title}
                </h2>
                <p className="text-center text-gray-500 mb-10">
                    {language === 'hi' ? 'Bima Sakhi परिवार की सफलता' : 'Success of Bima Sakhi Family'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {t.items.map((item, index) => (
                        <div key={index} className="bg-pink-50 p-8 rounded-2xl relative">
                            {/* Quote Icon */}
                            <div className="text-4xl text-pink-300 absolute top-4 left-4 font-serif">"</div>

                            <p className="text-gray-700 italic mb-6 relative z-10 text-lg">
                                {item.text}
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center text-pink-700 font-bold">
                                    {item.name[0]}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                                    <p className="text-xs text-gray-500">{item.role} | {item.loc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
