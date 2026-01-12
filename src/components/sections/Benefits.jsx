import React from 'react';
import Card from '../ui/Card';

const Benefits = ({ title = "Why Bima Sakhi?", items = [] }) => {
    // Default content aligned with Bima Sakhi Yojana
    const displayItems = items.length > 0 ? items : [
        {
            title: 'Respect & Professional Identity',
            description:
                'Build your own identity as a trained LIC professional and serve families in your community with trust and responsibility.'
        },
        {
            title: 'Income Growth Potential',
            description:
                'This is a commission-based career with no fixed salary. Your income grows with experience, effort, and long-term client relationships.'
        },
        {
            title: 'Structured Learning & Support',
            description:
                'Training, guidance, and performance-based support are provided during the initial phase, as per LIC norms.'
        },
        {
            title: 'Flexible Work Structure',
            description:
                'Plan your work schedule based on your availability while balancing family and professional responsibilities.'
        },
        {
            title: 'Digital LIC Platforms',
            description:
                'Policy issuance, servicing, and follow-ups can be handled digitally using LIC’s official platforms such as LIC Ananda.'
        }
    ];

    return (
        <section className="benefits-section">
            <div className="container">
                <h2>{title}</h2>
                <div className="benefits-grid">
                    {displayItems.map((b, index) => (
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
