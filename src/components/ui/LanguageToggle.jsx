import React, { useContext, useState } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import '../../styles/LanguageToggle.css';

const LanguageToggle = () => {
    const { language, switchLanguage } = useContext(LanguageContext);
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleSelect = (lang) => {
        switchLanguage(lang);
        setIsOpen(false);
    };

    return (
        <div className={`language-toggle-floating ${isOpen ? 'open' : 'collapsed'}`}>
            {/* When collapsed, show only active language (or toggle button) */}
            {/* When open, show both options */}

            {/* Option: Hindi */}
            {(isOpen || language === 'hi') && (
                <button
                    className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
                    onClick={isOpen ? () => handleSelect('hi') : toggleOpen}
                    aria-label="Switch to Hindi"
                >
                    हिंदी
                </button>
            )}

            {/* Option: English */}
            {(isOpen || language === 'en') && (
                <button
                    className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                    onClick={isOpen ? () => handleSelect('en') : toggleOpen}
                    aria-label="Switch to English"
                >
                    ENG
                </button>
            )}

            {/* Close/Toggle Indication (Optional, but good for UX) */}
            {!isOpen && (
                <div className="toggle-hint" onClick={toggleOpen}></div>
            )}
        </div>
    );
};

export default LanguageToggle;
