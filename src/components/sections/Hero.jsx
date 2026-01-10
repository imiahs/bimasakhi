import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const Hero = ({
    title = "Become a LIC Agent",
    subtitle = "Join the team today",
    ctaText = "Apply Now",
    ctaLink = "/apply",
    isAdsMode = false
}) => {
    return (
        <section className="hero-section">
            <div className="container">
                <h1>{title}</h1>
                <p className="hero-subtitle">{subtitle}</p>

                {isAdsMode ? (
                    <div className="ads-cta">
                        {/* In ads mode, we might scroll to form or link to it */}
                        <a href="#application-form"><Button variant="primary">{ctaText}</Button></a>
                    </div>
                ) : (
                    <div className="flex gap-4 justify-center mt-6 flex-wrap">
                        <Link to="/apply">
                            <Button variant="primary">Apply Now</Button>
                        </Link>
                        <Link to="/why">
                            <Button variant="secondary">Next: Why Bima Sakhi</Button>
                        </Link>
                        {/* Scroll hint for linear flow */}
                        <div className="w-full text-center mt-4 text-sm opacity-70">
                            <a href="#why_default">↓ Or Scroll to Learn More</a>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Hero;
