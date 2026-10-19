import React, { useState } from 'react';
import TarjetaPresentacion from './components/TarjetaPresentacion';
import './App.css';

// Componente principal del Ejercicio 2
function App() {
  // Estado para el tema claro/oscuro
  const [theme, setTheme] = useState('dark');

  const handleToggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // Datos del perfil hardcoded en el padre
  const perfil = {
    nombre: 'Renzo',
    apellido: 'Maggi',
    profesion: 'Desarrollador Web / React',
    imagenUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    descripcion: 'Especializado en React, JavaScript y desarrollo de aplicaciones web interactivas y modernas.'
  };

  return (
    <div className="app-wrapper" data-theme={theme}>
      {/* Navbar con selector de tema */}
      <nav className="custom-navbar d-flex justify-content-between align-items-center">
        <div className="navbar-brand-title">
         <span>R1 - Ejercicio 2</span>
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
          <h1 className="app-title display-5 mb-2">Ejercicio 2: Tarjeta de Presentación</h1>
          <p className="app-instructions">
            Flujo de Props en React: los datos viven en <code>App.jsx</code> y se pasan al componente presentacional <code>&lt;TarjetaPresentacion /&gt;</code>.
          </p>
        </header>

        <main className="d-flex justify-content-center">
          <TarjetaPresentacion
            nombre={perfil.nombre}
            apellido={perfil.apellido}
            profesion={perfil.profesion}
            imagenUrl={perfil.imagenUrl}
            descripcion={perfil.descripcion}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
