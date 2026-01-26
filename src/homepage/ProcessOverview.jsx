import React from 'react';

const ProcessOverview = () => {
    return (
        <section className="process">
            <div className="process-inner">
                <div className="process-header">
                    <h2>How the Process Works</h2>
                    <p>
                        Becoming a Bima Sakhi follows a defined process. We guide you through each step
                        so that you understand what is involved before moving forward.
                    </p>
                </div>

                <div className="process-steps">

                    {/* Step 1 */}
                    <div className="process-step">
                        <div className="process-step-header">
                            1. Check Eligibility
                        </div>
                        <div className="process-step-body">
                            You first check whether you meet the basic criteria such as age, education, and location.
                            This helps confirm if the opportunity is suitable for you.
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="process-step">
                        <div className="process-step-header">
                            2. Talk to a Mentor
                        </div>
                        <div className="process-step-body">
                            After eligibility is confirmed, you can start a WhatsApp conversation with a real person (Didi).
                            This is a manual discussion to answer your questions and explain the next steps clearly.
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="process-step">
                        <div className="process-step-header">
                            3. Training & Exam
                        </div>
                        <div className="process-step-body">
                            If you decide to proceed, you complete the required training and appear for the LIC agent
                            examination as per the prescribed process.
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="process-step">
                        <div className="process-step-header">
                            4. License & Start Work
                        </div>
                        <div className="process-step-body">
                            After clearing the examination, you receive your LIC agent license and can begin working
                            independently as an authorized agent.
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ProcessOverview;
