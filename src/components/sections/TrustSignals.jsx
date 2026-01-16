import React, { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const TrustSignals = () => {
    const { language } = useContext(LanguageContext);

    const content = {
        en: [
            { icon: "🏠", title: "Work from Home", desc: "Manage house & career together" },
            { icon: "💰", title: "Zero Investment", desc: "100% Free Training & License" },
            { icon: "🏛️", title: "Govt Backed", desc: "Safe career with LIC India" }
        ],
        hi: [
            { icon: "🏠", title: "घर से काम करें", desc: "घर और करियर साथ संभालें" },
            { icon: "💰", title: "जीरो निवेश", desc: "100% फ्री ट्रेनिंग और लाइसेंस" },
            { icon: "🏛️", title: "सरकारी सपोर्ट", desc: "LIC India के साथ सुरक्षित करियर" }
        ]
    };

    const items = content[language];

    return (
        <section className="py-8 bg-white border-b border-gray-100">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    {items.map((item, index) => (
                        <div key={index} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                            <div className="text-3xl mb-2">{item.icon}</div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h3>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustSignals;
