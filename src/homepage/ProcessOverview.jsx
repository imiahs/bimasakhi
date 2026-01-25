import React from 'react';

const ProcessOverview = () => {
    return (
        <div className="section-process">
            <h2>How the Process Works</h2>
            <p>
                Becoming a Bima Sakhi follows a defined process. We guide you through each step
                so that you understand what is involved before moving forward.
            </p>

            <ol>
                <li>
                    <strong>Check Eligibility:</strong> You first check whether you meet the basic criteria
                    such as age, education, and location. This helps confirm if the opportunity is suitable for you.
                </li>
                <li>
                    <strong>Talk to a Mentor:</strong> After eligibility is confirmed, you can start a WhatsApp
                    conversation with a real person (Didi). This is a manual discussion to answer your questions
                    and explain the next steps clearly.
                </li>
                <li>
                    <strong>Training & Exam:</strong> If you decide to proceed, you complete the required training
                    and appear for the LIC agent examination as per the prescribed process.
                </li>
                <li>
                    <strong>License & Start Work:</strong> After clearing the examination, you receive your LIC
                    agent license and can begin working independently as an authorized agent.
                </li>
            </ol>
        </div>
    );
};

export default ProcessOverview;
