import React, { useState } from 'react';
import Contador from './components/Contador';
import './App.css';

// Componente principal del Ejercicio 3
function App() {
  // Estado para el tema claro/oscuro
  const [theme, setTheme] = useState('dark');

  const handleToggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-wrapper" data-theme={theme}>
      <nav className="custom-navbar d-flex justify-content-between align-items-center">
        <div className="navbar-brand-title">
           <span>R1 - Ejercicio 3</span>
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
          <h1 className="app-title display-5 mb-2">Ejercicio 3: Contador Interactivo</h1>
          <p className="app-instructions">
            Manejo de estado básico con <code>useState</code> y control de límites del contador.
          </p>
        </header>

        <main>
          <Contador />
        </main>
      </div>
    </div>
  );
}

export default App;
