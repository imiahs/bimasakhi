// SAFE MOCK DATA (Engine Prep Only)
// Mimics structure but does not clone full content yet.

export const DEFAULT_SECTIONS = [
    {
        id: 'hero_1',
        type: 'HeroSection',
        props: {
            title: "Dynamic Engine Ready",
            subtitle: "This is a test of the admin-driven rendering system.",
            ctaText: "Test Apply",
            ctaLink: "/apply"
        }
    },
    {
        id: 'benefits_1',
        type: 'TrustBlock',
        props: {
            title: "Why Trust Bima Sakhi?"
        }
    }
];
