import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://bimasakhi.com'); // Strict CORS
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

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

    if (req.method === 'GET') {
        try {
            // Fetch from KV
            const config = await kv.hgetall('config:global');

            // Merge with defaults to ensure all keys exist
            const finalConfig = { ...DEFAULT_CONFIG, ...config };

            return res.status(200).json(finalConfig);
        } catch (error) {
            console.error('KV Read Error:', error);
            // Fallback to default if KV fails (Safety)
            return res.status(200).json(DEFAULT_CONFIG);
        }
    }

    if (req.method === 'POST') {
        try {
            // Security Check
            const authHeader = req.headers.authorization;
            const adminPassword = process.env.ADMIN_PASSWORD;

            // Simple Bearer or Direct Password check
            if (!authHeader || !adminPassword || authHeader.replace('Bearer ', '') !== adminPassword) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const newConfig = req.body;

            // Validate Input (Basic protection)
            if (typeof newConfig !== 'object') {
                return res.status(400).json({ error: 'Invalid Config Format' });
            }

            // Safe Write: Merge with existing to prevent accidental data loss
            const currentConfig = await kv.hgetall('config:global') || DEFAULT_CONFIG;
            const mergedConfig = { ...currentConfig, ...newConfig };

            // Write to KV
            await kv.hset('config:global', mergedConfig);

            return res.status(200).json({ success: true });

        } catch (error) {
            console.error('KV Write Error:', error);
            return res.status(500).json({ error: 'Failed to update config' });
        }
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}
