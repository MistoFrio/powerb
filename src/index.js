// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Componente principal
import './index.css'; // Estilos globais

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
