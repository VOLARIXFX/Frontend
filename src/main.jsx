import './i18n' // Importa esto al inicio, ajusta la ruta si es necesario
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import { ThemeProvider } from '../DarkMode.jsx'
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </ThemeProvider>
  </StrictMode>,
)
