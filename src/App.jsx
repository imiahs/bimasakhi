import React, { useContext, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/core/Layout';
import HomePage from './features/dynamic-home/HomePage';
// import Home from './pages/Home'; // Deprecated V1 Home
import Why from './pages/Why';
import Income from './pages/Income';
import Eligibility from './pages/Eligibility';
import Apply from './pages/Apply';
import AdsLanding from './pages/AdsLanding';
import { ConfigContext } from './context/ConfigContext';
import { analytics } from './services/analytics'; // Phase 5.6: Analytics

// Lazy load Admin to reduce initial bundle size
const Admin = lazy(() => import('./pages/Admin'));
const Privacy = lazy(() => import('./pages/legal/Privacy'));
const Terms = lazy(() => import('./pages/legal/Terms'));
const Disclaimer = lazy(() => import('./pages/legal/Disclaimer'));

// Helper to track page views
const AnalyticsTracker = () => {
  const location = useLocation();
  const { config } = useContext(ConfigContext);

  useEffect(() => {
    // Initialize once config is loaded
    if (config) {
      analytics.initialize(config);
    }
  }, [config]);

  useEffect(() => {
    // Track page view on route change
    // Safety: analytics.pageView handles 'not initialized' check internally
    analytics.pageView(location.pathname);
  }, [location]);

  return null;
};

function App() {
  return (
    <>
      <AnalyticsTracker />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Organic Flow */}
          <Route index element={<HomePage />} />
          <Route path="why" element={<Why />} />
          <Route path="income" element={<Income />} />
          <Route path="eligibility" element={<Eligibility />} />
          <Route path="apply" element={<Apply />} />

          {/* Ads Flow */}
          <Route path="apply-delhi" element={<AdsLanding />} />

          {/* Legal Pages */}
          <Route path="privacy-policy" element={<Suspense fallback={<div>...</div>}><Privacy /></Suspense>} />
          <Route path="terms-conditions" element={<Suspense fallback={<div>...</div>}><Terms /></Suspense>} />
          <Route path="disclaimer" element={<Suspense fallback={<div>...</div>}><Disclaimer /></Suspense>} />

          {/* Admin - Lazy Loaded */}
          <Route
            path="admin"
            element={
              <Suspense fallback={<div className="container py-8 text-center">Loading Admin Panel...</div>}>
                <Admin />
              </Suspense>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
