import { createClient } from '@supabase/supabase-js';
import { validateSection } from '../config/sectionSchemas';
import { logger } from '../utils/logger';

// Use existing Env Vars - do not hardcode
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Singleton Client
const supabase = createClient(supabaseUrl, supabaseKey);

// Simple In-Memory Cache
let cache = {
    data: null,
    timestamp: 0
};
const CACHE_TTL = 30 * 1000; // 30 seconds

export async function fetchHomepageSections(signal) {
    try {
        // 0. CACHE CHECK
        const now = Date.now();
        if (cache.data && (now - cache.timestamp < CACHE_TTL)) {
            logger.info('HomepageService', 'Serving from cache');
            return cache.data;
        }

        // 1. TIMEOUT GUARD (10s)
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Homepage Fetch Timeout")), 10000)
        );

        // 2. FETCH QUERY
        const fetchPromise = supabase
            .from('homepage_sections')
            .select('id, type, props, order_index, version') // Added version
            .eq('is_active', true)
            .order('order_index', { ascending: true })
            .abortSignal(signal);

        // 3. RACE
        const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

        if (error) {
            logger.warn('HomepageService', 'Supabase Fetch Error', error);
            return []; // Fallback to Static
        }

        if (!data || !Array.isArray(data)) {
            return [];
        }

        // 4. VALIDATION FILTER (Defensive)
        const validSections = data.filter(section => {
            const isValid = validateSection(section);
            if (!isValid) {
                logger.warn('HomepageService', 'Skipping Invalid DB Section', { id: section.id, type: section.type });
            }
            return isValid;
        });

        // Update Cache
        cache = {
            data: validSections,
            timestamp: Date.now()
        };

        logger.info('HomepageService', 'Fetch Success', { count: validSections.length });
        return validSections;

    } catch (err) {
        // Safety Catch
        if (err.name === 'AbortError') {
            logger.info('HomepageService', 'Request Cancelled');
        } else {
            logger.error('HomepageService', 'Critical Failure', err);
        }
        return [];
    }
}
