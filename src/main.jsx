import React from 'react';
import './components/builder-registry'; // Register Builder.io components
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ConfigProvider } from './context/ConfigContext';
import { UserProvider } from './context/UserContext';
import './styles/reset.css';
import './styles/variables.css';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider>
      <UserProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserProvider>
    </ConfigProvider>
  </React.StrictMode>
);
