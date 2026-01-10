import Redis from 'ioredis';

// Initialize Redis outside handler
const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // 1. Authenticate via Cookie
        const cookieHeader = req.headers.cookie || '';
        const cookies = Object.fromEntries(
            cookieHeader.split('; ').map(c => {
                const [key, ...v] = c.split('=');
                return [key, v.join('=')];
            })
        );
        const sessionId = cookies['admin_session'];

        if (!sessionId) {
            return res.status(401).json({ error: 'Unauthorized: No Session' });
        }

        // Check Redis for session
        const sessionStatus = await redis.get(`session:${sessionId}`);
        if (sessionStatus !== 'active') {
            return res.status(401).json({ error: 'Unauthorized: Invalid Session' });
        }

        // 2. Process Data
        const newConfig = req.body;

        if (typeof newConfig !== 'object' || newConfig === null) {
            return res.status(400).json({ error: 'Invalid payload' });
        }

        // 3. Safe Merge (Read existing -> Merge -> Write)
        const rawConfig = await redis.get('config:global');
        const currentConfig = rawConfig ? JSON.parse(rawConfig) : {};

        const mergedConfig = { ...currentConfig, ...newConfig };

        // Store as Stringified JSON
        await redis.set('config:global', JSON.stringify(mergedConfig));

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Config Save Error:', error);
        return res.status(500).json({ error: 'Failed to update config' });
    }
}
