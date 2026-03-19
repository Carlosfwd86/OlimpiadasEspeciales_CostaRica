import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
/* Importamos el BrowserRouter para que las rutas funcionen */
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);