// Internal Structured Logger
// Wraps console methods to add context and standardized formatting.
// Can be extended to send logs to a service in V2.

const LOG_LEVELS = {
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error'
};

const formatLog = (level, context, message, data = null) => {
    const timestamp = new Date().toISOString();
    return {
        timestamp,
        level,
        context,
        message,
        data
    };
};

export const logger = {
    info: (context, message, data) => {
        if (import.meta.env.DEV) {
            console.log(`[INFO] [${context}] ${message}`, data || '');
        }
    },
    warn: (context, message, data) => {
        console.warn(`[WARN] [${context}] ${message}`, data || '');
    },
    error: (context, error, data) => {
        console.error(`[ERROR] [${context}] ${error.message || error}`, {
            stack: error.stack,
            ...data
        });
    }
};
