import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="container footer-grid">

                {/* Column 1 - About */}
                <div>
                    <h4>Bima Sakhi</h4>
                    <p>
                        A structured LIC agency opportunity platform focused on
                        empowering women through financial independence.
                    </p>
                </div>

                {/* Column 2 - Explore */}
                <div>
                    <h4>Explore</h4>
                    <ul>
                        <li><Link to="/income">Income Model</Link></li>
                        <li><Link to="/eligibility">Eligibility</Link></li>
                        <li><Link to="/why">Why Join</Link></li>
                        <li><Link to="/apply">Apply Now</Link></li>
                    </ul>
                </div>

                {/* Column 3 - Legal */}
                <div>
                    <h4>Legal</h4>
                    <ul>
                        <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                        <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
                        <li><Link to="/disclaimer">Disclaimer</Link></li>
                    </ul>
                </div>

                {/* Column 4 - Mission */}
                <div>
                    <h4>Our Mission</h4>
                    <p>
                        Supporting women across India in building sustainable
                        careers through LIC’s Bima Sakhi initiative.
                    </p>
                </div>

            </div>

            <div className="footer-bottom">
                © {new Date().getFullYear()} Bima Sakhi. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;