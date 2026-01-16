import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Default to 'hi' (Hinglish) as per Phase 5.6 Strategy
    const [language, setLanguage] = useState('hi');

    useEffect(() => {
        const savedLang = localStorage.getItem('app_lang');
        if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
            setLanguage(savedLang);
        }
    }, []);

    const switchLanguage = (lang) => {
        if (lang !== 'en' && lang !== 'hi') return;
        setLanguage(lang);
        localStorage.setItem('app_lang', lang);

        // Dynamic Title Update based on Language
        if (lang === 'hi') {
            document.title = "Bima Sakhi - LIC Mahila Agent Baney";
        } else {
            document.title = "Bima Sakhi - Government Backed Career for Women";
        }
    };

    return (
        <LanguageContext.Provider value={{ language, switchLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
