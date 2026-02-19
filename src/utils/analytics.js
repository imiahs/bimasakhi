import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// In-Memory Buffer to prevent log spam
const LOG_BUFFER = [];
const FLUSH_INTERVAL = 10000; // 10 seconds

// Flush logs periodically
setInterval(async () => {
    if (LOG_BUFFER.length === 0) return;

    const batch = [...LOG_BUFFER];
    LOG_BUFFER.length = 0; // Clear buffer

    // In Prod: Send to Supabase
    // In Dev: Console
    if (import.meta.env.PROD) {
        const { error } = await supabase.from('homepage_logs').insert(batch);
        if (error) console.error("Log Flush Failed", error);
    } else {
        // Dev: Just noise reduction
        // console.log("Flushed logs:", batch.length);
    }
}, FLUSH_INTERVAL);

export const logMetric = (type, message, meta = {}) => {
    // 1. Local Dev Logging
    if (import.meta.env.DEV) {
        logger.info('Metrics', `[${type}] ${message}`, meta);
        // Track stats in localStorage for quick debugging
        const key = `metric_${type}`;
        const current = Number(localStorage.getItem(key) || 0);
        localStorage.setItem(key, current + 1);
    }

    // 2. Buffer for DB (Only Critical or Low Frequency)
    if (type === 'CRITICAL_FAILURE' || type === 'STATIC_FALLBACK') {
        LOG_BUFFER.push({
            event_type: type,
            message,
            meta
        });
    }
};
