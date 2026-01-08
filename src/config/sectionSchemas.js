// Defines the schema for editable props for each section type
// This drives the Admin UI Forms

export const SECTION_SCHEMAS = {
    'HeroSection': {
        name: 'Hero Section',
        fields: [
            { name: 'title', label: 'Headline', type: 'text', default: 'Become a LIC Agent' },
            { name: 'subtitle', label: 'Sub-headline', type: 'text', default: 'Government Backed Commission Career' },
            { name: 'ctaText', label: 'Button Text', type: 'text', default: 'Apply Now' },
            { name: 'ctaLink', label: 'Button Link', type: 'text', default: '/apply' }
        ]
    },
    'TrustBlock': {
        name: 'Trust / Benefits Block',
        fields: [
            { name: 'title', label: 'Section Title', type: 'text', default: 'Why Join Us?' }
            // Items are currently hardcoded or array-based. 
            // For v1, we only edit the title to keep it simple as requested.
        ]
    },
    'ApplyFormBlock': {
        name: 'Application Form',
        fields: [
            // No props needed for the form logic itself yet, maybe title
            { name: 'title', label: 'Form Title (Optional)', type: 'text', default: '' }
        ]
    },
    'IncomeRealityBlock': {
        name: 'Income Potential',
        fields: [
            { name: 'title', label: 'Title', type: 'text', default: 'Real Income Potential' }
        ]
    }
};

export const AVAILABLE_SECTIONS = [
    { type: 'HeroSection', label: 'Hero Section' },
    { type: 'TrustBlock', label: 'Trust & Benefits' },
    { type: 'ApplyFormBlock', label: 'Application Form' },
    { type: 'IncomeRealityBlock', label: 'Income Table' }
];
