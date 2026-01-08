import React from 'react';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="container">
                <p>&copy; {new Date().getFullYear()} Bima Sakhi. All Rights Reserved.</p>
                <p className="footer-note">Only for women in Delhi NCR.</p>
            </div>
        </footer>
    );
};

export default Footer;
