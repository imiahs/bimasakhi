import React, { useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LanguageContext } from '../../context/LanguageContext';
import "../../styles/FloatingActions.css";


const FloatingApply = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { language } = useContext(LanguageContext);

    // Detect source from URL
    const getSource = () => {
        const params = new URLSearchParams(location.search);
        return params.get("source") || "direct";
    };

    const handleClick = (e) => {
        // Log for live troubleshooting
        console.log("Floating Apply Clicked", { source: getSource() });

        const source = getSource();

        // Google Tag Manager Event
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "apply_click",
            source: source,
            location: "floating_button"
        });

        // Ensure user lands at top of page
        window.scrollTo(0, 0);
    };

    const text = language === 'hi'
        ? 'अभी अप्लाई करें'
        : 'Apply Now';

    const source = getSource();

    return (
        <Link
            to={`/apply?source=${source}`}
            className="floating-pill apply-pill attention-pulse"
            onClick={handleClick}
            aria-label="Apply for Bima Sakhi Opportunity"
        >
            📝 {text}
        </Link>
    );
};

export default FloatingApply;