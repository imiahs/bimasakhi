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
                        <h4>LIC & Government of India Initiative</h4>
                        <h1>Bima Sakhi Yojana</h1>
                        <h2>Mahila Career Agency Scheme in Delhi NCR</h2>
                        <p>
                            Launched by Hon. PM to empower women and provide them with an opportunity to become financially independent.
                        </p>
                        <p>
                            <li> Full Time</li>
                            <li> Part Time</li>
                            <li> Flexible Hours</li>
                            <li> Zero Investment</li>
                            <li> Only for Female</li>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
