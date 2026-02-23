import React, { useEffect, useState, useContext } from 'react';
import { LanguageContext } from '../../../context/LanguageContext';
import '../../../styles/AdsLanding.css';

const UrgencyTicker = () => {
    const { language } = useContext(LanguageContext);
    const [index, setIndex] = useState(0);

    const messages = {
        en: [
            "Limited Onboarding for Delhi NCR – Apply Before Seats Fill",
            "2.5 Lakh+ Already Joined | Many Applicants Reviewing Today"
        ],
        hi: [
            "दिल्ली NCR के लिए सीमित ऑनबोर्डिंग – सीटें सीमित हैं",
            "2.5 लाख+ लोग जुड़ चुके हैं | आज कई आवेदन समीक्षा में हैं"
        ]
    };

    const currentMessages = messages[language] || messages.en;

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % currentMessages.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [currentMessages.length]);

    return (
        <div className="ads-urgency-wrapper">
            <div key={index} className="ads-urgency-slide">
                🚨 {currentMessages[index]}
            </div>
        </div>
    );
};

export default UrgencyTicker;