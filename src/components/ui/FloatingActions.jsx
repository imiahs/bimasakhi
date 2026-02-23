import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FloatingApply from './FloatingApply';
import FloatingWhatsApp from './FloatingWhatsApp';
import '../../styles/FloatingActions.css';

const FloatingActions = () => {

    const [visible, setVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 250) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (location.pathname === "/apply") return null;
    if (!visible) return null;

    return (
        <div className="floating-actions-wrapper">
            <FloatingWhatsApp />
            <FloatingApply />
        </div>
    );
};

export default FloatingActions;