import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="site-header">
            <div className="container">
                <Link to="/" className="brand-logo"><img src="/public/images/home/logo.png" alt="Bima Sakhi" /> <span>Bima Sakhi</span></Link>
                {/* Navigation is minimal as per spec, driven by page flow */}
            </div>
        </header>
    );
};

export default Header;
