import React, { useContext, useEffect } from 'react';
import ApplyForm from '../components/sections/ApplyForm';
import { UserContext } from '../context/UserContext';
import SEOHead from '../components/core/SEOHead';

const Apply = () => {
    const { userState } = useContext(UserContext);

    const missingSteps = [];
    if (!userState.visitedPages.includes('income')) missingSteps.push('Income Reality');
    if (!userState.visitedPages.includes('eligibility')) missingSteps.push('Eligibility');

    return (
        <div className="page-apply container">
            <SEOHead
                title="अभी अप्लाई करें – Bima Sakhi Application Form"
                description="2 मिनट में अप्लाई करें। LIC के साथ जुड़कर आत्मनिर्भर बनें। सुरक्षित और आसान प्रोसेस।"
                path="/apply"
            />
            <h1>Final Step: Application</h1>

            {userState.source === 'website' && missingSteps.length > 0 && (
                <div className="warning-banner">
                    <p>Warning: You have skipped important details ({missingSteps.join(', ')}).</p>
                    <p>Please make sure you understand this is a COMMISSION-ONLY role.</p>
                </div>
            )}

            <ApplyForm />
        </div>
    );
};

export default Apply;
