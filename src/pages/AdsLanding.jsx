import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '../components/core/SEOHead';
import { UserContext } from '../context/UserContext';

const AdsLanding = () => {
    const { setSource } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        setSource('ads');
    }, []);

    const handleApplyClick = () => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "ads_landing_apply_click"
        });

        navigate('/apply?source=ads');
    };

    return (
        <div className="ads-landing-page">

            <SEOHead
                title="Bima Sakhi Yojana – LIC Agency Career for Women in Delhi NCR"
                description="Apply for Bima Sakhi LIC Agency opportunity in Delhi NCR. 3-year stipend + commission. 10th pass women eligible. Free training provided."
                path="/bima-sakhi-delhi"
            />

            {/* HERO SECTION */}
            <section className="ads-hero">
                <div className="ads-hero-container">

                    <div className="ads-hero-text">
                        <h1>
                            Bima Sakhi Yojana – LIC Agency Career for Women in Delhi NCR
                        </h1>

                        <p className="ads-subtitle">
                            3 Years Stipend + Commission | 10th Pass | Age 18–70
                        </p>

                        <p className="ads-trust">
                            Free Training | Government Supported | No Joining Fee
                        </p>

                        <button className="ads-primary-btn" onClick={handleApplyClick}>
                            Check Eligibility & Apply Now
                        </button>
                    </div>

                    <div className="ads-hero-image">
                        <img
                            src="/images/home/hero-bg.jpg"
                            alt="Professional Woman LIC Agent"
                        />
                    </div>

                </div>
            </section>

            {/* BENEFITS */}
            <section className="ads-section">
                <div className="ads-container">
                    <h2>Why Consider This Opportunity?</h2>
                    <ul className="ads-benefits">
                        <li>✔ Monthly Stipend Support for 3 Years (As per LIC norms)</li>
                        <li>✔ Flexible Work in Your Local Area</li>
                        <li>✔ Unlimited Commission-Based Income Potential</li>
                    </ul>
                </div>
            </section>

            {/* INCOME REALITY */}
            <section className="ads-section alt-bg">
                <div className="ads-container">
                    <h2>Important: Income Reality</h2>
                    <p>
                        This is a commission-based LIC agency career. Stipend support is
                        available during the initial period as per LIC guidelines. Long-term
                        income depends on your dedication, client relationships, and
                        performance.
                    </p>
                </div>
            </section>

            {/* ELIGIBILITY */}
            <section className="ads-section">
                <div className="ads-container">
                    <h2>Basic Eligibility</h2>
                    <ul className="ads-benefits">
                        <li>✔ Woman (18–70 Years)</li>
                        <li>✔ Minimum 10th Pass</li>
                        <li>✔ Resident of Delhi NCR</li>
                    </ul>

                    <div style={{ textAlign: "center", marginTop: "30px" }}>
                        <button className="ads-primary-btn" onClick={handleApplyClick}>
                            Proceed to Application
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default AdsLanding;