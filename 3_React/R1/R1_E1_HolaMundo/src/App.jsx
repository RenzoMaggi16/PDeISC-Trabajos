import React, { useState } from 'react';
import HolaMundo from './components/HolaMundo';
import './App.css';

// Componente principal del Ejercicio 1 con soporte de temas
function App() {
  // Estado para el tema visual
  const [theme, setTheme] = useState('dark');

  // Alterna entre tema claro y oscuro
  const handleToggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-wrapper" data-theme={theme}>
      {/* Navbar con botón de cambio de tema */}
      <nav className="custom-navbar d-flex justify-content-between align-items-center">
        <div className="navbar-brand-title">
        <span>R1 - Ejercicio 1</span>
        </div>
        <button
          className="btn btn-theme-toggle"
          onClick={handleToggleTheme}
          aria-label="Cambiar tema de color"
        >
          {theme === 'dark' ? '☀️ Modo Día' : '🌙 Modo Noche'}
        </button>
      </nav>

      <div className="app-container flex-grow-1">
        <header className="text-center mb-5">
          <h1 className="app-title display-5 mb-2">Ejercicio 1: Hola Mundo</h1>
          <p className="app-instructions">
            Experimenta con estilos dinámicos en React y personaliza tu propio saludo con <code>useState</code>.
          </p>
        </header>

        <main>
          <HolaMundo />
        </main>
      </div>
    </div>
  );
}

export default App;
