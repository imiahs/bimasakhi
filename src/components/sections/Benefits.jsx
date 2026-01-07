import React from 'react';
import Card from '../ui/Card';

const Benefits = () => {
    const benefits = [
        {
            title: 'Respect & Dignity',
            description: 'Build your own identity as a professional financial advisor in your society.'
        },
        {
            title: 'Unlimited Income',
            description: 'No salary cap. Your income grows with your effort and client base.'
        },
        {
            title: 'Flexibility',
            description: 'Work at your own pace. Balance family and profession perfectly.'
        }
    ];

    return (
        <section className="benefits-section">
            <div className="container">
                <h2>Why Join Us?</h2>
                <div className="benefits-grid">
                    {benefits.map((b, index) => (
                        <Card key={index} className="benefit-card">
                            <h3>{b.title}</h3>
                            <p>{b.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Benefits;
