import Redis from 'ioredis';
import crypto from 'crypto';

// Initialize Redis outside handler for connection reuse
const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { password } = req.body;
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

        if (!ADMIN_PASSWORD) {
            console.error('ADMIN_PASSWORD is not set in environment variables');
            return res.status(500).json({ error: 'Server Misconfiguration' });
        }

        if (password !== ADMIN_PASSWORD) {
            console.warn(`Failed login attempt from ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`);
            return res.status(401).json({ error: 'Invalid Password' }); // 401 Unauthorized
        }

        // Generate a random session ID
        const sessionId = crypto.randomUUID();

        // Store session in Redis with 24h expiry (86400 seconds)
        // Redis SET key value EX seconds
        await redis.set(`session:${sessionId}`, 'active', 'EX', 86400);

        // Set HttpOnly Cookie
        const cookieValue = `admin_session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`;

        res.setHeader('Set-Cookie', cookieValue);

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
