import React from 'react';

const BenefitsSection = () => {
    return (
        <section className="benefits">
            <div className="benefits-inner">
                <div className="benefits-header">
                    <h2>Support & Learning Structure</h2>
                    <p>
                        When you choose to become a Bima Sakhi, you receive access to a structured learning process.
                        This includes preparation for the licensing examination and practical understanding of
                        insurance concepts needed to work responsibly.
                    </p>
                </div>

                <div className="benefits-grid">
                    <div className="benefit-item">
                        <h3>Flexible Learning</h3>
                        <p>
                            Much of the training and guidance is designed to be flexible,
                            allowing you to learn alongside your existing responsibilities.
                        </p>
                    </div>

                    <div className="benefit-item">
                        <h3>Ongoing Support</h3>
                        <p>
                            Ongoing support is also provided for administrative procedures,
                            understanding policy options, and handling customer questions correctly.
                        </p>
                    </div>

                    <div className="benefit-item">
                        <h3>Professional Network</h3>
                        <p>
                            The focus is on helping you work independently with confidence.
                            You have the flexibility to plan your schedule while staying connected
                            to a professional support network anytime guidance is needed.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;
