import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {

    const [menuOpen, setMenuOpen] = useState(false);

    // Disable body scroll when mobile menu open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [menuOpen]);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <header className="site-header">

            <div className="container nav-wrapper">

                {/* Logo */}
                <Link to="/" className="brand-logo" onClick={closeMenu}>
                    <img src="/images/home/logo.png" alt="Bima Sakhi Logo" />
                    <div className="brand-text">
                        <span className="brand-name">Bima Sakhi</span>
                        <span className="brand-tagline">
                            Women Empowerment through LIC Opportunity
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="nav-links desktop-menu">
                    <NavLink to="/" end>Home</NavLink>
                    <NavLink to="/income">Income</NavLink>
                    <NavLink to="/eligibility">Eligibility</NavLink>
                    <NavLink to="/why">Why Join?</NavLink>
                    <NavLink to="/AdsLanding">Bima Sakhi Delhi</NavLink>
                    <NavLink to="/About">About Us</NavLink>
                    <NavLink to="/Contact">Contact Us</NavLink>
                </nav>

                {/* Desktop CTA */}
                <div className="nav-cta desktop-menu">
                    <Link to="/apply" className="apply-btn">
                        Apply Now
                    </Link>
                </div>

                {/* Hamburger */}
                <div
                    className={`hamburger ${menuOpen ? 'active' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`mobile-overlay ${menuOpen ? 'show' : ''}`}
                onClick={closeMenu}
            ></div>

            {/* Mobile Slide Menu */}
            <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>

                <NavLink to="/" onClick={closeMenu}>Home</NavLink>
                <NavLink to="/income" onClick={closeMenu}>Income</NavLink>
                <NavLink to="/eligibility" onClick={closeMenu}>Eligibility</NavLink>
                <NavLink to="/why" onClick={closeMenu}>Why Join?</NavLink>
                <NavLink to="/AdsLanding" onClick={closeMenu}>Bima Sakhi Delhi</NavLink>
                <NavLink to="/About">About Us</NavLink>
                <NavLink to="/Contact">Contact Us</NavLink>

                <Link to="/apply" className="apply-btn mobile-apply" onClick={closeMenu}>
                    Apply Now
                </Link>

            </div>

        </header>
    );
};

export default Navbar;