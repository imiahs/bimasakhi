import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="container">
                <p>&copy; {new Date().getFullYear()} Bima Sakhi. All Rights Reserved.</p>
                <p className="footer-note">Only for women in Delhi NCR.</p>
                <div className="footer-links" style={{ marginTop: '10px', fontSize: '0.85em', display: 'flex', gap: '15px', justifyContent: 'center', opacity: 0.8 }}>
                    <Link to="/privacy-policy">Privacy Policy</Link>
                    <Link to="/terms-conditions">Terms</Link>
                    <Link to="/disclaimer">Disclaimer</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
