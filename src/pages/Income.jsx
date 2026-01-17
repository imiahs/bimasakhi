import React, { useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import IncomeBlock from '../components/sections/IncomeBlock';
import SEOHead from '../components/core/SEOHead';

const Income = () => {
    const { markPageVisited } = useContext(UserContext);

    useEffect(() => {
        markPageVisited('income');
    }, []);

    return (
        <div className="page-income container">
            <SEOHead
                title="कमाई की सच्चाई – Commission vs Salary"
                description="यह जॉब नहीं, बिज़नेस है। जानिए कमीशन स्ट्रक्चर और परफॉरमेंस-आधारित स्टाइपेंड की सच्चाई।"
                path="/income"
            />
            <IncomeBlock />

            <div className="action-area">
                <Link to="/eligibility">
                    <Button variant="primary">Next: Check Eligibility</Button>
                </Link>
            </div>
        </div>
    );
};

export default Income;
