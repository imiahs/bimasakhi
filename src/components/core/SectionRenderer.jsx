import React from 'react';
import Hero from '../sections/Hero';
import ApplyForm from '../sections/ApplyForm';
import Benefits from '../sections/Benefits';
import IncomeBlock from '../sections/IncomeBlock';

// Component Map: Maps string 'type' from JSON to React Component
const COMPONENT_MAP = {
    'HeroSection': Hero,
    'ApplyFormBlock': ApplyForm,
    'TrustBlock': Benefits, // Mapping Benefits to TrustBlock for now
    'IncomeRealityBlock': IncomeBlock
};

const SectionRenderer = ({ sections = [] }) => {
    if (!Array.isArray(sections) || sections.length === 0) {
        return null;
    }

    return (
        <>
            {sections.map((section, index) => {
                const Component = COMPONENT_MAP[section.type];
                if (!Component) {
                    console.warn(`Unknown section type: ${section.type}`);
                    return null;
                }

                // Pass all props from JSON + unique key
                return <Component key={section.id || index} {...section.props} />;
            })}
        </>
    );
};

export default SectionRenderer;
