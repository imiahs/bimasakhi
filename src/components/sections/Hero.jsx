import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const Hero = ({ title, subtitle, ctaText, ctaLink, isAdsMode = false }) => {
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
                    <Link to={ctaLink}>
                        <Button variant="primary">{ctaText}</Button>
                    </Link>
                )}
            </div>
        </section>
    );
};

export default Hero;
