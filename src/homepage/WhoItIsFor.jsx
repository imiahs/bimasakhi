import React from 'react';

const WhoItIsFor = () => {
    return (
        <section className="who-for">
            <div className="who-for-inner">
                <div className="who-for-header">
                    <h2>Who is this for?</h2>
                </div>

                <div className="who-for-grid">

                    {/* Suitable Block (Yes) */}
                    <div className="who-for-block who-for-yes">
                        <h3>This is suitable for you if:</h3>
                        <div className="who-for-list">
                            <ul>
                                <li>You are a woman based in Delhi NCR (Delhi, Noida, Gurgaon, Faridabad, Ghaziabad).</li>
                                <li>You are looking for work that offers flexible timings rather than a strict 9-to-5 schedule.</li>
                                <li>You are willing to learn about financial products and talk to people.</li>
                                <li>You are comfortable with an income model based on commission (performance-based earnings).</li>
                            </ul>
                        </div>
                    </div>

                    {/* Not Suitable Block (No) */}
                    <div className="who-for-block who-for-no">
                        <h3>This may NOT be suitable for you if:</h3>
                        <div className="who-for-list">
                            <ul>
                                <li>You are looking for an immediate fixed monthly salary without sales targets.</li>
                                <li>You are unable to travel or attend occasional meetings in or around Delhi.</li>
                                <li>You are not comfortable interacting with new people or clients.</li>
                                <li>You are currently living outside the Delhi NCR region.</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default WhoItIsFor;
