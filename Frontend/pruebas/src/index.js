import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// HU4: Inyectar API key de Google Maps desde variable de entorno
// Esto evita exponer la clave en el código frontend
if (process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
  window.__REACT_APP_GOOGLE_MAPS_API_KEY__ = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
} else {
  console.warn('⚠️ HU4: REACT_APP_GOOGLE_MAPS_API_KEY no está configurada en .env.local');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();