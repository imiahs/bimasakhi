import React from 'react';

const IncomeBlock = ({ condensed = false, title = "The Reality of Income" }) => {
    return (
        <div className="income-block">
            {!condensed && <h2>{title}</h2>}

            <div className="reality-check">
                <p>
                    <strong>Strict Note:</strong> This is a COMMISSION-BASED profession.
                    There is NO fixed salary.
                </p>
            </div>

            <ul className="income-points">
                <li>
                    Income depends on your effort, consistency, and the number of clients you serve.
                </li>
                <li>
                    The first 6 months are primarily for learning, training, and building your client base.
                </li>
                <li>
                    As part of the Bima Sakhi initiative, performance-based stipend support may be available
                    during the initial years, as per LIC norms.
                </li>
                <li>
                    Real growth typically starts after Year 1, when renewal commissions begin to add up
                    along with new business.
                </li>
                <li>
                    Policy servicing and sales can be done digitally using LIC’s official platforms
                    such as LIC Ananda.
                </li>
            </ul>

            {!condensed && (
                <p className="income-summary">
                    If you are looking for a fixed monthly salary without responsibility, this opportunity
                    may not be suitable for you. However, if you want to build a long-term career where
                    your income grows with experience and effort, this path can be rewarding.
                </p>
            )}
        </div>
    );
};

export default IncomeBlock;
