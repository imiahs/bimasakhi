import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const EligibilityBlock = ({ id }) => {
    const [canProceed, setCanProceed] = useState(false);
    const [checks, setChecks] = useState({
        age: false,
        education: false,
        delhi: false,
        understanding: false
    });

    useEffect(() => {
        setCanProceed(
            checks.age &&
            checks.education &&
            checks.delhi &&
            checks.understanding
        );
    }, [checks]);

    const handleCheck = (field) => {
        setChecks(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleProceed = () => {
        const applySection = document.getElementById('apply_default');
        if (applySection) {
            applySection.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.warn("Apply Form section not found (ID: apply_default)");
        }
    };

    return (
        <div className="section-eligibility container py-8">
            <h2 className="text-center mb-4">
                Check Your Eligibility
            </h2>

            <p className="text-center mb-6 opacity-80">
                This opportunity is not suitable for everyone.
                Please proceed only if you meet all the conditions below.
            </p>

            <Card className="checklist max-w-2xl mx-auto">
                <div className="checkbox-group mb-4 flex items-start gap-3">
                    <input
                        type="checkbox"
                        id={`${id}_age`}
                        checked={checks.age}
                        onChange={() => handleCheck('age')}
                        className="mt-1 w-5 h-5 accent-pink-600"
                    />
                    <label htmlFor={`${id}_age`}>
                        I am a woman between 18 and 70 years of age.
                    </label>
                </div>

                <div className="checkbox-group mb-4 flex items-start gap-3">
                    <input
                        type="checkbox"
                        id={`${id}_education`}
                        checked={checks.education}
                        onChange={() => handleCheck('education')}
                        className="mt-1 w-5 h-5 accent-pink-600"
                    />
                    <label htmlFor={`${id}_education`}>
                        I have completed at least 10th standard education.
                    </label>
                </div>

                <div className="checkbox-group mb-4 flex items-start gap-3">
                    <input
                        type="checkbox"
                        id={`${id}_delhi`}
                        checked={checks.delhi}
                        onChange={() => handleCheck('delhi')}
                        className="mt-1 w-5 h-5 accent-pink-600"
                    />
                    <label htmlFor={`${id}_delhi`}>
                        I currently live in Delhi NCR and can serve clients locally.
                    </label>
                </div>

                <div className="checkbox-group flex items-start gap-3">
                    <input
                        type="checkbox"
                        id={`${id}_understanding`}
                        checked={checks.understanding}
                        onChange={() => handleCheck('understanding')}
                        className="mt-1 w-5 h-5 accent-pink-600"
                    />
                    <label htmlFor={`${id}_understanding`}>
                        I understand that this is a commission-based LIC career opportunity,
                        not a fixed-salary job.
                    </label>
                </div>
            </Card>

            <div className="action-area text-center mt-8">
                <Button
                    variant="primary"
                    disabled={!canProceed}
                    onClick={handleProceed}
                    className="w-full sm:w-auto"
                >
                    {canProceed
                        ? "Proceed to Application ↓"
                        : "Confirm All Conditions to Proceed"}
                </Button>
            </div>
        </div>
    );
};

export default EligibilityBlock;
