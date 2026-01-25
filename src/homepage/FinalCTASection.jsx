import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const FinalCTASection = () => {
    return (
        <div className="section-final-cta">
            <h2>Ready to take the next step?</h2>
            <p>
                If you feel this opportunity aligns with your goals, you can choose to move forward at your own pace.
                You may check your basic eligibility to understand whether this path is suitable for you.
            </p>

            <div className="action-wrapper">
                <Link to="/why">
                    <Button variant="primary">Why Bima Sakhi?</Button>
                </Link>
            </div>
        </div>
    );
};

export default FinalCTASection;
