import { createClient } from '@supabase/supabase-js';
import { validateSection } from '../../../config/sectionSchemas';
import { logger } from '../../../utils/logger';

// Use existing Env Vars - do not hardcode
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Singleton Client
const supabase = createClient(supabaseUrl, supabaseKey);

// Session Cache Keys
const CACHE_KEY = 'homepage_sections_cache';
const CACHE_TTL = 30 * 1000; // 30 seconds

export async function fetchHomepageSections(signal) {
    try {
        // 0. SESSION CACHE CHECK (Persists across refresh within tab session)
        const cachedRaw = sessionStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
            try {
                const { data, timestamp } = JSON.parse(cachedRaw);
                if (data && (Date.now() - timestamp < CACHE_TTL)) {
                    logger.info('HomepageService', 'Serving from Session Cache');
                    return data;
                }
            } catch (e) {
                sessionStorage.removeItem(CACHE_KEY); // Corrupt cache cleanup
            }
        }

        // 1. TIMEOUT GUARD (10s)
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Homepage Fetch Timeout")), 10000)
        );

        // 2. FETCH QUERY
        const fetchPromise = supabase
            .from('homepage_sections')
            .select('id, type, props, order_index, version')
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

        // 5. Update Session Cache
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            data: validSections,
            timestamp: Date.now()
        }));

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
