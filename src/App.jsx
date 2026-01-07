import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/core/Layout';
import Home from './pages/Home';
import Why from './pages/Why';
import Income from './pages/Income';
import Eligibility from './pages/Eligibility';
import Apply from './pages/Apply';
import AdsLanding from './pages/AdsLanding';
import Admin from './pages/Admin';
import { ConfigContext } from './context/ConfigContext';

function App() {
  const { config } = useContext(ConfigContext);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Organic Flow */}
        <Route index element={<Home />} />
        <Route path="why" element={<Why />} />
        <Route path="income" element={<Income />} />
        <Route path="eligibility" element={<Eligibility />} />
        <Route path="apply" element={<Apply />} />

        {/* Ads Flow */}
        <Route path="apply-delhi" element={<AdsLanding />} />

        {/* Admin */}
        <Route path="admin" element={<Admin />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
