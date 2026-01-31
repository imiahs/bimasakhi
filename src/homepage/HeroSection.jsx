import React, { useState, useEffect } from 'react';

const HeroSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const totalSlides = 4;

    // Auto-rotate every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % totalSlides);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Manual navigation
    const goToSlide = (index) => setActiveIndex(index);
    const nextSlide = () => setActiveIndex((prev) => (prev + 1) % totalSlides);
    const prevSlide = () => setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);

    return (
        <section className="hero">
            <div className="hero-bg"></div>
            <div className="hero-overlay">
                <div className="hero-inner">

                    {/* Slide 1 */}
                    <div className={`hero-content ${activeIndex === 0 ? "active" : ""}`}>
                        <h2 className="hero-intro">LIC & Government of India Initiative</h2>
                        <h1 className="hero-title">Bima Sakhi Yojana</h1>
                        <h3 className="hero-subtitle">Mahila Career Agency Scheme in Delhi NCR</h3>
                        <img src="/images/home/hero-bg.jpg" alt="Bima Sakhi Visual" className="hero-image" />
                        <p className="hero-description">
                            Launched to empower women and provide them with an opportunity to become financially independent.
                        </p>
                        <ul className="hero-options">
                            <li>Full Time</li>
                            <li>Part Time</li>
                            <li>Zero Investment</li>
                            <li>Only for Female</li>
                        </ul>
                        <div className="hero-cta"><button>Know More</button></div>
                    </div>

                    {/* Slide 2 */}
                    <div className={`hero-content ${activeIndex === 1 ? "active" : ""}`}>
                        <h2 className="hero-intro">New Opportunities for Women</h2>
                        <h1 className="hero-title">Financial Freedom Program</h1>
                        <h3 className="hero-subtitle">Skill Development & Training</h3>
                        <img src="/images/bima_sakhi_ai.png" alt="Empowerment Visual" className="hero-image" />
                        <p className="hero-description">
                            A new initiative under Bima Sakhi Yojana to provide skill training, career guidance, and financial literacy.
                        </p>
                        <ul className="hero-options">
                            <li>Skill Training</li>
                            <li>Career Guidance</li>
                            <li>Financial Literacy</li>
                            <li>Women Empowerment</li>
                        </ul>
                        <div className="hero-cta"><button>Join Now</button></div>
                    </div>

                    {/* Slide 3 */}
                    <div className={`hero-content ${activeIndex === 2 ? "active" : ""}`}>
                        <h2 className="hero-intro">Nationwide Expansion</h2>
                        <h1 className="hero-title">Bima Sakhi Outreach</h1>
                        <h3 className="hero-subtitle">Connecting Women Across India</h3>
                        <img src="/images/bima_sakhi_amita.png" alt="Outreach Visual" className="hero-image" />
                        <p className="hero-description">
                            Expanding the program to reach women in rural and urban areas, ensuring inclusivity and equal opportunity.
                        </p>
                        <ul className="hero-options">
                            <li>Rural Outreach</li>
                            <li>Urban Inclusion</li>
                            <li>Equal Opportunity</li>
                            <li>Pan-India Coverage</li>
                        </ul>
                        <div className="hero-cta"><button>Get Involved</button></div>
                    </div>

                    {/* Slide 4 */}
                    <div className={`hero-content ${activeIndex === 3 ? "active" : ""}`}>
                        <h2 className="hero-intro">Future Ready Women</h2>
                        <h1 className="hero-title">Digital Sakhi Program</h1>
                        <h3 className="hero-subtitle">Technology & Entrepreneurship</h3>
                        <img src="/images/bima_sakhi_avneet.png" alt="Digital Visual" className="hero-image" />
                        <p className="hero-description">
                            Preparing women for the digital economy with entrepreneurship training, online tools, and modern skills.
                        </p>
                        <ul className="hero-options">
                            <li>Entrepreneurship</li>
                            <li>Digital Tools</li>
                            <li>Online Business</li>
                            <li>Future Skills</li>
                        </ul>
                        <div className="hero-cta"><button>Start Today</button></div>
                    </div>

                    {/* Navigation Controls */}
                    <div className="hero-nav">
                        <button onClick={prevSlide} className="nav-btn">‹</button>
                        <button onClick={nextSlide} className="nav-btn">›</button>
                    </div>

                    {/* Dots Navigation */}
                    <div className="hero-dots">
                        {[...Array(totalSlides)].map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${activeIndex === index ? "active" : ""}`}
                                onClick={() => goToSlide(index)}
                            ></span>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeroSection;
