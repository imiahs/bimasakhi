import React from 'react';

const IncomeBlock = ({ condensed = false }) => {
    return (
        <div className="income-block">
            {!condensed && <h2>The Reality of Income</h2>}

            <div className="reality-check">
                <p><strong>Strict Note:</strong> This is a COMMISSION-BASED profession. There is NO fixed salary.</p>
            </div>

            <ul className="income-points">
                <li>You earn when you work.</li>
                <li>First 6 months are for learning and building a client base.</li>
                <li>Real growth happens after Year 1 when renewal commissions start coming in.</li>
            </ul>

            {!condensed && (
                <p className="income-summary">
                    If you are looking for a job where you get paid just for showing up, this is NOT for you.
                    But if you want to build a business that pays you for a lifetime, read on.
                </p>
            )}
        </div>
    );
};

export default IncomeBlock;
