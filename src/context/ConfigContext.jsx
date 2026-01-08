import React, { createContext } from 'react';
import useSWR from 'swr';
import axios from 'axios';

export const ConfigContext = createContext();

const DEFAULT_CONFIG = {
    isAppPaused: false,
    isRedirectPaused: false,
    delhiOnlyMessage: 'Currently onboarding women from Delhi NCR only.',
    ctaText: 'Apply on WhatsApp',
    heroTitle: 'Become a LIC Agent',
    heroSubtitle: 'Government Backed Commission Career',
};

// SWR Fetcher
const fetcher = url => axios.get(url).then(res => res.data);

export const ConfigProvider = ({ children }) => {
    const { data: config, error, mutate } = useSWR('/api/config', fetcher, {
        fallbackData: DEFAULT_CONFIG,
        refreshInterval: 0, // Only refresh on manual triggers or reload to save reads
        revalidateOnFocus: false
    });

    const updateConfig = async (newConfig) => {
        // Optimistic UI update
        mutate({ ...config, ...newConfig }, false);

        // We don't write to API here anymore directly via Context.
        // The Admin page handles the API write, then triggers revalidation.
        // Ideally this function is now just for local state or we remove it from context
        // and let Admin handle it. But to keep compatibility with existing components:
        // We will make this function a NO-OP or log warning, 
        // OR we allow it if we pass the auth token (which we don't have here).

        console.warn("Config updates must be done via Admin Panel.");
    };

    // Helper to refresh data after Admin save
    const refreshConfig = () => mutate();

    return (
        <ConfigContext.Provider value={{ config: config || DEFAULT_CONFIG, updateConfig, refreshConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};
