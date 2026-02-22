import React, { useEffect, useContext } from 'react';
import SEOHead from '../components/core/SEOHead';
import ApplyForm from '../features/leads/ApplyForm';
import { UserContext } from '../context/UserContext';

const AdsLanding = () => {
    const { setSource } = useContext(UserContext);

    useEffect(() => {
        setSource('ads');
    }, []);

    return (
        <div className="ads-landing">

            <SEOHead
                title="Bima Sakhi Yojana – LIC Agency Career for Women in Delhi NCR"
                description="Apply for Bima Sakhi LIC Agency career in Delhi NCR. 3-year stipend + commission. 10th pass women eligible. Free training."
                path="/bima-sakhi-delhi"
            />

            {/* HERO */}
            <section className="ads-hero">
                <div className="container text-center">
                    <h1>Bima Sakhi Yojana – LIC Agency Career for Women in Delhi NCR</h1>
                    <p className="subtitle">
                        3 Years Stipend + Commission | 10th Pass | Age 18–70
                    </p>
                    <p className="trust-line">
                        Free Training | Government Supported | No Joining Fee
                    </p>
                    <a href="#apply-form" className="cta-button">
                        Check Eligibility & Apply Now
                    </a>
                </div>
            </section>

            {/* BENEFITS */}
            <section className="ads-benefits container">
                <ul>
                    <li>✔ Earn Monthly Stipend for First 3 Years</li>
                    <li>✔ Flexible Work in Your Local Area</li>
                    <li>✔ Unlimited Commission Potential</li>
                </ul>
            </section>

            {/* INCOME REALITY */}
            <section className="ads-income container">
                <h2>Important: Income Reality</h2>
                <p>
                    This is a commission-based career. Stipend support is available for
                    first 3 years (as per LIC norms). Long-term income depends on your
                    performance and dedication.
                </p>
            </section>

            {/* ELIGIBILITY */}
            <section className="ads-eligibility container">
                <h2>Eligibility</h2>
                <ul>
                    <li>✔ Woman (18–70 Years)</li>
                    <li>✔ Minimum 10th Pass</li>
                    <li>✔ Resident of Delhi NCR</li>
                </ul>
            </section>

            {/* APPLY FORM */}
            <section id="apply-form" className="container">
                <h2>Apply Now</h2>
                <ApplyForm />
            </section>

        </div>
    );
};

export default AdsLanding;