// Health Check Utility
// Intended to be run from Console or Hidden Admin Route

export const getSystemHealth = () => {
    const report = {
        timestamp: new Date().toISOString(),
        env: {
            mode: import.meta.env.VITE_DYNAMIC_HOME_MODE,
            rolloutPct: import.meta.env.VITE_DYNAMIC_ROLLOUT_PERCENTAGE,
            isDev: import.meta.env.DEV
        },
        session: {
            circuitBreaker: sessionStorage.getItem('dynamic_home_failures') || '0',
            rolloutBucket: sessionStorage.getItem('dynamic_rollout_val') || 'N/A',
            hasCache: !!sessionStorage.getItem('homepage_sections_cache')
        },
        localMetrics: {
            renders: localStorage.getItem('metric_DYNAMIC_RENDER'),
            fallbacks: localStorage.getItem('metric_STATIC_FALLBACK')
        }
    };

    console.table(report.session);
    return report;
};
