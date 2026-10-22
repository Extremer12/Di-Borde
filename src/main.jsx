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
