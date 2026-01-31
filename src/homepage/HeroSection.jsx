import React from 'react';

const HeroSection = () => {
    return (
        <section className="hero">
            {/* Background Layer */}
            <div className="hero-bg">
                {/* cosmetic background element */}
            </div>

            {/* Content Overlay Layer */}
            <div className="hero-overlay">
                <div className="hero-inner">
                    <div className="hero-content">
                        <h2 className="hero-intro">LIC & Government of India Initiative</h2> {/* supporting intro */}
                        <h1 className="hero-title">Bima Sakhi Yojana</h1> {/* main title */}
                        <h3 className="hero-subtitle">Mahila Career Agency Scheme in Delhi NCR</h3> {/* subtitle */}
                        {/* ✅ Image above description */}
                        <img src="/public/images/Bima_Sakhi_Ai.png" alt="Bima Sakhi Visual" className="hero-image" />
                        <p className="hero-description"> Launched by Hon. PM to empower women and provide them with an opportunity to become financially independent. </p>
                        <ul className="hero-options">
                            <li>Full Time</li>
                            <li>Part Time</li>
                            <li>Zero Investment</li>
                            <li>Only for Female</li>
                        </ul>
                        <div className="hero-cta"> <button>Know More</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
