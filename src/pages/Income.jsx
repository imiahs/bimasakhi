import React, { useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import IncomeBlock from '../components/sections/IncomeBlock';

const Income = () => {
    const { markPageVisited } = useContext(UserContext);

    useEffect(() => {
        markPageVisited('income');
    }, []);

    return (
        <div className="page-income container">
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
