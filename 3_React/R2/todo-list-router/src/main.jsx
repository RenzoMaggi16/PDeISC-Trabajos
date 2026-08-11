// Punto de entrada de la aplicación React
// Monta el componente raíz en el elemento #root del DOM

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Importar estilos globales personalizados
import './styles/App.css';

// Montar la aplicación en modo estricto para detectar problemas en desarrollo
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
