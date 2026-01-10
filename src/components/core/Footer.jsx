import React from 'react';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="container">
                <p>&copy; {new Date().getFullYear()} Bima Sakhi. All Rights Reserved.</p>
                <p className="footer-note">Only for women in Delhi NCR.</p>
                <div className="footer-links" style={{ marginTop: '10px', fontSize: '0.85em', display: 'flex', gap: '15px', justifyContent: 'center', opacity: 0.8 }}>
                    <a href="/privacy-policy">Privacy Policy</a>
                    <a href="/terms-conditions">Terms</a>
                    <a href="/disclaimer">Disclaimer</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
