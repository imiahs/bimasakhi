import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const EligibilityBlock = ({ id }) => {
    const [canProceed, setCanProceed] = useState(false);
    const [checks, setChecks] = useState({
        age: false,
        education: false,
        delhi: false
    });

    useEffect(() => {
        setCanProceed(checks.age && checks.education && checks.delhi);
    }, [checks]);

    const handleCheck = (field) => {
        setChecks(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleProceed = () => {
        // Scroll to the next section (Apply Form)
        const applySection = document.getElementById('apply_default');
        if (applySection) {
            applySection.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.warn("Apply Form section not found (ID: apply_default)");
        }
    };

    return (
        <div className="section-eligibility container py-8">
            <h2 className="text-center mb-6">Eligibility Check</h2>
            <p className="text-center mb-6">Before applying, please confirm you meet the criteria:</p>

            <Card className="checklist max-w-2xl mx-auto">
                <div className="checkbox-group mb-4 flex items-center gap-3">
                    <input
                        type="checkbox"
                        id={`${id}_age`}
                        checked={checks.age}
                        onChange={() => handleCheck('age')}
                        className="w-5 h-5 accent-pink-600"
                    />
                    <label htmlFor={`${id}_age`}>I am a woman between 18-70 years old.</label>
                </div>

                <div className="checkbox-group mb-4 flex items-center gap-3">
                    <input
                        type="checkbox"
                        id={`${id}_education`}
                        checked={checks.education}
                        onChange={() => handleCheck('education')}
                        className="w-5 h-5 accent-pink-600"
                    />
                    <label htmlFor={`${id}_education`}>I have completed at least 10th standard education.</label>
                </div>

                <div className="checkbox-group mb-4 flex items-center gap-3">
                    <input
                        type="checkbox"
                        id={`${id}_delhi`}
                        checked={checks.delhi}
                        onChange={() => handleCheck('delhi')}
                        className="w-5 h-5 accent-pink-600"
                    />
                    <label htmlFor={`${id}_delhi`}>I live in Delhi NCR (Delhi, Noida, Gurugram, etc).</label>
                </div>
            </Card>

            <div className="action-area text-center mt-8">
                <Button
                    variant="primary"
                    disabled={!canProceed}
                    onClick={handleProceed}
                    className="w-full sm:w-auto"
                >
                    {canProceed ? "Proceed to Apply ↓" : "Confirm Above to Proceed"}
                </Button>
            </div>
        </div>
    );
};

export default EligibilityBlock;
