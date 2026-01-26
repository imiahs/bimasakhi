import React from 'react';

const SocialProofSection = () => {
    return (
        <section className="social-proof">
            <div className="social-proof-inner">
                <div className="social-proof-header">
                    <h2>Women working as Bima Sakhi</h2>
                    <p>
                        Women from different professional and personal backgrounds across Delhi NCR choose this role
                        for the flexibility and independence it offers alongside their existing responsibilities.
                    </p>
                </div>

                <div className="social-proof-grid">
                    <div className="proof-item">
                        <p><strong>Homemakers:</strong> Many women begin this journey after a career break.
                            They appreciate the flexibility to plan their work around household and family commitments.</p>
                    </div>
                    <div className="proof-item">
                        <p><strong>Teachers & Tutors:</strong> Educators often find this role familiar because it involves
                            explaining concepts clearly and patiently. Many manage this work alongside their teaching schedules.</p>
                    </div>
                    <div className="proof-item">
                        <p><strong>Retired Professionals:</strong> Women who wish to remain active after retirement
                            use their experience and personal networks to continue working in a structured way.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SocialProofSection;
