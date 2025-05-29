import './i18n';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import React from 'react';
import { ThemeProvider } from '../DarkMode.jsx';
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { HashRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>
);:contentReference[oaicite:20]{index=20}

