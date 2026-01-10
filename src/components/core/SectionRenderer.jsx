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

// Error Boundary for individual sections
class SectionErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Section Render Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Return null or a placeholder in dev
            return this.props.fallback || null;
        }
        return this.props.children;
    }
}

const SectionRenderer = ({ sections = [] }) => {
    if (!Array.isArray(sections) || sections.length === 0) {
        return null;
    }

    return (
        <div className="sections-container">
            {sections.map((section, index) => {
                const Component = COMPONENT_MAP[section.type];

                // Graceful fallback for unknown types
                if (!Component) {
                    console.warn(`Unknown section type: ${section.type}`);
                    return (
                        <div key={index} className="hidden debug-unknown-section">
                            {/* Hidden in prod, maybe visible in dev? Keeping hidden for safety */}
                        </div>
                    );
                }

                return (
                    <SectionErrorBoundary key={section.id || index}>
                        <div id={section.id} className={`section-wrapper section-${section.type.toLowerCase()}`}>
                            <Component {...section.props} />
                        </div>
                    </SectionErrorBoundary>
                );
            })}
        </div>
    );
};

export default SectionRenderer;
