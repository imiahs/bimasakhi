import React, { createContext, useState, useEffect } from 'react';
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage';

export const ConfigContext = createContext();

const DEFAULT_CONFIG = {
    isAppPaused: false,
    isRedirectPaused: false,
    delhiOnlyMessage: 'Currently onboarding women from Delhi NCR only.',
    ctaText: 'Apply on WhatsApp'
};

export const ConfigProvider = ({ children }) => {
    const [config, setConfig] = useState(() => {
        return getStorage(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
    });

    useEffect(() => {
        setStorage(STORAGE_KEYS.CONFIG, config);
    }, [config]);

    const updateConfig = (newConfig) => {
        setConfig((prev) => ({ ...prev, ...newConfig }));
    };

    return (
        <ConfigContext.Provider value={{ config, updateConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};
