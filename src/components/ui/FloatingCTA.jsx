import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../../context/LanguageContext';
import Button from '../ui/Button';

const FloatingCTA = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { language } = useContext(LanguageContext);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling 30% of viewport height
            // This ensures it doesn't clash with Hero CTA immediately
            if (window.scrollY > window.innerHeight * 0.4) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const text = language === 'hi' ? 'अभी अप्लाई करें' : 'Apply Now';

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full p-4 z-50 bg-gradient-to-t from-white via-white to-transparent pb-6 md:hidden">
            <Link to="/apply">
                <Button variant="primary" className="w-full shadow-2xl py-3 text-lg font-bold animate-slide-up">
                    {text} ➝
                </Button>
            </Link>
        </div>
    );
};

export default FloatingCTA;
