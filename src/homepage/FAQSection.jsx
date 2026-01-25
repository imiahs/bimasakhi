import React from 'react';

const FAQSection = () => {
    return (
        <div className="section-faq">
            <h2>Frequently Asked Questions</h2>

            <div className="faq-item">
                <strong>Is this a salaried job?</strong>
                <p>
                    No. This is a commission-based independent agency role with LIC.
                    There is no fixed monthly salary. Your income depends on the work you do as an agent.
                </p>
            </div>

            <div className="faq-item">
                <strong>Is there any fee to join?</strong>
                <p>
                    We do not charge any joining fee. As part of the mandatory licensing process,
                    candidates are required to pay the prescribed examination and registration fees
                    to the appropriate regulatory authorities.
                </p>
            </div>

            <div className="faq-item">
                <strong>Is there an exam?</strong>
                <p>
                    Yes. Clearing the pre-licensing examination is mandatory to become a licensed insurance agent.
                    Training is provided to help candidates prepare for this examination.
                </p>
            </div>

            <div className="faq-item">
                <strong>Who can apply?</strong>
                <p>
                    This program is intended for women who meet the basic eligibility criteria
                    related to age and education and are based in the Delhi NCR region.
                </p>
            </div>

            <div className="faq-item">
                <strong>Is this safe and legitimate?</strong>
                <p>
                    Yes. Agents work after completing the prescribed licensing process.
                    LIC of India is a government-owned corporation, and the agent licensing
                    process follows established regulatory guidelines.
                </p>
            </div>

            <div className="faq-item">
                <strong>Can I do this part-time?</strong>
                <p>
                    Yes. Since this is an independent agency role, many women choose to manage it
                    alongside household responsibilities or other work, based on their availability.
                </p>
            </div>
        </div>
    );
};

export default FAQSection;
