import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ConfigProvider } from './context/ConfigContext';
import { UserProvider } from './context/UserContext';
import { LanguageProvider } from './context/LanguageContext'; // Phase 5.6

import './styles/reset.css';
import './styles/variables.css';
import './styles/global.css';

import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider>
      <UserProvider>
        <LanguageProvider>
          <HelmetProvider>
            <BrowserRouter>

              <App />
            </BrowserRouter>
          </HelmetProvider>
        </LanguageProvider>
      </UserProvider>
    </ConfigProvider>
  </React.StrictMode>
);
