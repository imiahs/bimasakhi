import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const Hero = ({
    title = "Bima Sakhi – LIC Career for Women",
    subtitle = "A government-backed, commission-based career opportunity with learning support",
    ctaText = "Check Eligibility",
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
                        {/* Ads mode: direct intent */}
                        <a href="#application-form">
                            <Button variant="primary">{ctaText}</Button>
                        </a>
                    </div>
                ) : (
                    <div className="flex gap-4 justify-center mt-6 flex-wrap">
                        <Link to={ctaLink}>
                            <Button variant="primary">Check Eligibility</Button>
                        </Link>

                        <Link to="/why">
                            <Button variant="secondary">Why Bima Sakhi?</Button>
                        </Link>

                        {/* Scroll hint for linear flow */}
                        <div className="w-full text-center mt-4 text-sm opacity-70">
                            <a href="#why_default">↓ Or scroll to understand income & process</a>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Hero;
