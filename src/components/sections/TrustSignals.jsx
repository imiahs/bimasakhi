import React, { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const TrustSignals = () => {
    const { language } = useContext(LanguageContext);

    const content = {
        en: {
            title: "Why is Bima Sakhi Trusted?",
            items: [
                { icon: "🏛️", title: "Operated by LIC", desc: "India's most trusted institution" },
                { icon: "🇮🇳", title: "Govt Backed", desc: "Supported by Govt of India" },
                { icon: "👩‍💼", title: "Million+ Women", desc: "Joined across India" },
                { icon: "📱", title: "100% Digital", desc: "Work via LIC ANANDA App" }
            ]
        },
        hi: {
            title: "क्यों भरोसेमंद है Bima Sakhi योजना?",
            items: [
                { icon: "🏛️", title: "LIC द्वारा संचालित", desc: "भारत की सबसे भरोसेमंद संस्था" },
                { icon: "🇮🇳", title: "भारत सरकार समर्थित", desc: "सुरक्षित और सम्मानजनक करियर" },
                { icon: "👩‍💼", title: "लाखों महिलाएँ", desc: "पहले से इस योजना से जुड़ी हैं" },
                { icon: "📱", title: "100% डिजिटल काम", desc: "LIC ANANDA ऐप से घर बैठे काम" }
            ]
        }
    };

    const t = content[language];

    return (
        <section className="py-12 bg-white border-b border-gray-100">
            <div className="container">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
                    {t.title}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center mb-12">
                    {t.items.map((item, index) => (
                        <div key={index} className="p-6 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="text-4xl mb-4">{item.icon}</div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Stat Bar - Very Important */}
                <div className="bg-pink-50 rounded-lg p-6 text-center border border-pink-100 max-w-4xl mx-auto">
                    <p className="text-lg md:text-xl font-semibold text-pink-800">
                        {language === 'hi'
                            ? "📊 2,50,000+ महिलाएँ पहले से LIC एजेंट के रूप में कार्यरत | 70+ वर्षों की विश्वसनीय संस्था"
                            : "📊 2,50,000+ Women already working as LIC Agents | 70+ Years of Trust"}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default TrustSignals;
