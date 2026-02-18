import React, { useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Hero from '../components/sections/Hero';
import Benefits from '../components/sections/Benefits';
import IncomeBlock from '../components/sections/IncomeBlock';
import ApplyForm from '../features/leads/ApplyForm';
import Card from '../components/ui/Card';

const AdsLanding = () => {
    const { setSource } = useContext(UserContext);

    useEffect(() => {
        setSource('ads');
    }, []);

    return (
        <div className="page-ads-landing">
            {/* 1. Short Intro */}
            <Hero
                title="LIC Agency Career for Women – Delhi NCR"
                subtitle="Start your professional journey today. Dignity, Income, Flexibility."
                ctaText="Apply Below"
                isAdsMode={true}
            />

            <div className="container">
                {/* 2. Mini Why - reusing Benefits */}
                <Benefits />

                {/* 3. Mini Income Reality */}
                <Card className="my-4">
                    <h3>Important: Income Reality</h3>
                    <IncomeBlock condensed={true} />
                </Card>

                {/* 4. Simple Checklist (Visual only, form validation handles the real check) */}
                <Card className="my-4 bg-light">
                    <h3>Eligibility</h3>
                    <ul>
                        <li>✅ Woman (18-70 Years)</li>
                        <li>✅ 10th Pass Minimum</li>
                        <li>✅ Resident of Delhi NCR</li>
                    </ul>
                </Card>

                {/* 5. Application Form */}
                <div id="application-form" className="py-4">
                    <h2>Apply Now</h2>
                    <ApplyForm />
                </div>
            </div>
        </div>
    );
};

export default AdsLanding;
