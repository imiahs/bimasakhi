import { Builder } from '@builder.io/react';
import ApplyForm from './sections/ApplyForm';
import Hero from './sections/Hero'; // Assuming this exists or will be created/renamed from Hero.jsx

// 1. Register ApplyForm as a Builder Block
// This ALLOWS placing the form on any page, but KEEPS logic locked in React.
Builder.registerComponent(ApplyForm, {
    name: 'ApplyFormBlock',
    inputs: [
        {
            name: 'title',
            type: 'string',
            defaultValue: 'Apply Now',
            friendlyName: 'Section Title' // Cosmetic only, logic is internal
        }
    ],
    // Safety: Restricted inputs prevents admin from breaking logic
});

// 2. Register Hero (If adaptations needed, doing it here or in Hero.jsx)
Builder.registerComponent(Hero, {
    name: 'HeroSection',
    inputs: [
        { name: 'title', type: 'string', defaultValue: 'Become a LIC Agent' },
        { name: 'subtitle', type: 'string' },
        { name: 'ctaText', type: 'string', defaultValue: 'Apply Now' },
        { name: 'image', type: 'file', allowedFileTypes: ['jpeg', 'png', 'webp'] }
    ]
});

// Export nothing, just side-effects of registration
export const registerBuilderComponents = () => {
    console.log('Builder.io components registered');
};
