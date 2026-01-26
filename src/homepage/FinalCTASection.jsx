import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const FinalCTASection = () => {
    return (
        <section className="final-cta">
            <div className="final-cta-inner">

                <div className="final-cta-content">
                    <h2>Ready to take the next step?</h2>
                    <p>
                        If you feel this opportunity aligns with your goals, you can choose to move forward at your own pace.
                        You may check your basic eligibility to understand whether this path is suitable for you.
                    </p>
                </div>

                <div className="final-cta-action">
                    <Link to="/why">
                        <Button variant="primary">Why Bima Sakhi?</Button>
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default FinalCTASection;
