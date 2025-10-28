import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import 'leaflet/dist/leaflet.css';



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// Inject CSS
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://apis.mappls.com/advancedmaps/api/1.5.3/theme/amps/amp_blue/style-amp.css';
document.head.appendChild(link);

// Inject JS
const script = document.createElement('script');
script.src = 'https://apis.mappls.com/advancedmaps/api/1.5.3/map_sdk.js';
script.async = true;
script.onload = () => {
  console.log('Mappls script loaded!');
};
document.body.appendChild(script);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('✅ App Started!');
