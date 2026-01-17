import React, { useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

import SEOHead from '../components/core/SEOHead';

const Why = () => {
    const { markPageVisited } = useContext(UserContext);

    useEffect(() => {
        markPageVisited('why');
    }, []);

    return (
        <div className="page-why container">
            <SEOHead
                title="क्यों बनें Bima Sakhi? – फायदे और सम्मान"
                description="घर से काम, फ्रीडम और सम्मान। जानिए Bima Sakhi बनने के असली फायदे और LIC का भरोसा।"
                path="/why"
            />
            <h1>Why Bima Sakhi?</h1>

            <Card className="content-block">
                <h3>More Than a Job</h3>
                <p>This is not a 9-to-5 job where you work for a boss. This is your own business. You decide your hours, your clients, and your growth.</p>
            </Card>

            <Card className="content-block">
                <h3>Social Respect</h3>
                <p>As an LIC agent, you help families secure their future. You become a trusted advisor in your community, earning respect and gratitude.</p>
            </Card>

            <Card className="content-block">
                <h3>Work-Life Balance</h3>
                <p>Manage your household responsibilities while building a career. Attend school meetings, family functions, and work when you are free.</p>
            </Card>

            <div className="action-area">
                <Link to="/income">
                    <Button variant="primary">Next: Understand Income</Button>
                </Link>
            </div>
        </div>
    );
};

export default Why;
