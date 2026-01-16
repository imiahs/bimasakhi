import React, { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import '../../styles/LanguageToggle.css';

const LanguageToggle = () => {
    const { language, switchLanguage } = useContext(LanguageContext);

    return (
        <div className="language-toggle-floating">
            <button
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => switchLanguage('en')}
            >
                ENG
            </button>
            <button
                className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
                onClick={() => switchLanguage('hi')}
            >
                हिंदी
            </button>
        </div>
    );
};

export default LanguageToggle;
