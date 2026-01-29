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
                        <h3>Mahila Career Agency Yojana in Delhi NCR</h3>
                        <p>
                            Bima Sakhi is an initiative that helps women become licensed LIC agents and work independently
                            as insurance advisors. The focus is on guidance, training, and step-by-step support
                            required to start and sustain an agency career with LIC.
                        </p>
                        <p>
                            This website exists to explain how the Bima Sakhi opportunity works, who it is suitable for,
                            and what the actual process looks like before taking any next step.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
