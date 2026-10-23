import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import './styles/variables.css';
import './styles/base.css';
import './styles/components.css';
import './styles/views.css';

const rootElement = document.getElementById('app');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Registro oficial del Service Worker PWA
if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[Di Borde PWA] Service Worker activo:', registration.scope);
      })
      .catch((error) => {
        console.warn('[Di Borde PWA] Error al registrar Service Worker:', error);
      });
  });
}

