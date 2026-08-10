import React, { useState } from 'react';
import './HolaMundo.css';

// Componente HolaMundo que permite alternar estilos CSS mediante estado
const HolaMundo = () => {
  // Estado para el índice del estilo activo
  const [styleIndex, setStyleIndex] = useState(0);

  // Variantes de estilos CSS
  const styles = [
    { className: 'style-glass', name: 'Vidrio Neumórfico (Glassmorphism)' },
    { className: 'style-neon',  name: 'Gradiente Neón (Vibrant Neon)' },
    { className: 'style-terminal', name: 'Terminal Retro (Monospace Hacker)' }
  ];

  // Cambia al siguiente estilo de la lista
  const handleToggleStyle = () => {
    setStyleIndex((prevIndex) => (prevIndex + 1) % styles.length);
  };

  const currentStyle = styles[styleIndex];

  return (
    <div className={`hola-mundo-container ${currentStyle.className}`}>

      {/* Encabezado de saludo */}
      <h1 className="hola-heading mb-3">¡Hola, mundo!</h1>

      <p className="hola-subtext mb-4">
        Estilo activo: <span className="style-name-badge">{currentStyle.name}</span>
      </p>

      {/* Botón para cambiar el estilo visual */}
      <button
        className="btn btn-hola-action btn-lg px-4 mt-2"
        onClick={handleToggleStyle}
      >
        Cambiar Estilo Visual
      </button>
    </div>
  );
};

export default HolaMundo;
