import { kv } from '@vercel/kv';

// Default Configuration to ensure the app never crashes on empty KV
const DEFAULT_CONFIG = {
    isAppPaused: false,
    isRedirectPaused: false,
    delhiOnlyMessage: 'Currently onboarding women from Delhi NCR only.',
    ctaText: 'Apply on WhatsApp',
    heroTitle: 'Become a LIC Agent',
    heroSubtitle: 'Government Backed Commission Career',
    pages: {
        home: {
            title: "Home Page",
            sections: [
                {
                    id: "hero_default",
                    type: "HeroSection",
                    props: {
                        title: "Become a LIC Agent - Earn Unlimited Income",
                        subtitle: "Government Supported Career for Women in Delhi NCR",
                        ctaText: "Apply Now",
                        ctaLink: "/apply"
                    }
                },
                {
                    id: "trust_default",
                    type: "TrustBlock",
                    props: {}
                },
                {
                    id: "apply_default",
                    type: "ApplyFormBlock",
                    props: {}
                }
            ]
        }
    }
};

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Fetch from KV (JSON Object)
        const config = await kv.get('config:global');

        // Merge with defaults
        const finalConfig = { ...DEFAULT_CONFIG, ...config };

        return res.status(200).json(finalConfig);

    } catch (error) {
        console.error('Config Verification Error:', error);
        // Fallback to defaults
        return res.status(200).json(DEFAULT_CONFIG);
    }
}
