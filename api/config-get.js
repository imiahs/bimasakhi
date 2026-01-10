import Redis from 'ioredis';

// Initialize Redis outside handler
const redis = new Redis(process.env.REDIS_URL);

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
                        ctaText: "See How It Works",
                        ctaLink: "#why_default" // Scroll link
                    }
                },
                {
                    id: "why_default",
                    type: "TrustBlock",
                    props: {
                        title: "Why Join Bima Sakhi?"
                    }
                },
                {
                    id: "income_default",
                    type: "IncomeRealityBlock",
                    props: {}
                },
                {
                    id: "eligibility_default",
                    type: "EligibilityBlock",
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
        // Fetch from Redis (String)
        const rawConfig = await redis.get('config:global');

        let config = {};
        if (rawConfig) {
            config = JSON.parse(rawConfig);
        }

        // Merge with defaults
        const finalConfig = { ...DEFAULT_CONFIG, ...config };

        return res.status(200).json(finalConfig);

    } catch (error) {
        console.error('Config Verification Error:', error);
        // Fallback to defaults
        return res.status(200).json(DEFAULT_CONFIG);
    }
}
