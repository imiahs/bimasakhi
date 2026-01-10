import Redis from 'ioredis';

// Initialize Redis outside handler
const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
    // Should be GET usually, but no harm in supporting POST if needed. Sticking to GET.
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Parse Cookies manually
        const cookieHeader = req.headers.cookie || '';
        const cookies = Object.fromEntries(
            cookieHeader.split('; ').map(c => {
                const [key, ...v] = c.split('=');
                return [key, v.join('=')];
            })
        );

        const sessionId = cookies['admin_session'];

        if (!sessionId) {
            return res.status(200).json({ authenticated: false });
        }

        // Check Redis for session validity
        const sessionStatus = await redis.get(`session:${sessionId}`);

        if (sessionStatus !== 'active') {
            return res.status(200).json({ authenticated: false });
        }

        return res.status(200).json({ authenticated: true });

    } catch (error) {
        console.error('Auth Check Error:', error);
        // Fail open? No, fail closed.
        return res.status(200).json({ authenticated: false, error: 'Check Failed' });
    }
}
