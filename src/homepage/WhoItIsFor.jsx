import React from 'react';

const WhoItIsFor = () => {
    return (
        <div className="section-who-for">
            <h2>Who is this for?</h2>

            <div className="suitability-block">
                <h3>This is suitable for you if:</h3>
                <ul>
                    <li>You are a woman based in Delhi NCR (Delhi, Noida, Gurgaon, Faridabad, Ghaziabad).</li>
                    <li>You are looking for work that offers flexible timings rather than a strict 9-to-5 schedule.</li>
                    <li>You are willing to learn about financial products and talk to people.</li>
                    <li>You are comfortable with an income model based on commission (performance-based earnings).</li>
                </ul>
            </div>

            <div className="suitability-block">
                <h3>This may NOT be suitable for you if:</h3>
                <ul>
                    <li>You are looking for an immediate fixed monthly salary without sales targets.</li>
                    <li>You are unable to travel or attend occasional meetings in or around Delhi.</li>
                    <li>You are not comfortable interacting with new people or clients.</li>
                    <li>You are currently living outside the Delhi NCR region.</li>
                </ul>
            </div>
        </div>
    );
};

export default WhoItIsFor;
