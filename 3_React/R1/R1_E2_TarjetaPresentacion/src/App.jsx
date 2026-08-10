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

  // Datos de perfiles hardcoded en el padre
  const perfiles = [
    {
      nombre: 'Renzo',
      apellido: 'González',
      profesion: 'Desarrollador Frontend Senior',
      imagenUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      descripcion: 'Especializado en React, TypeScript y diseño de interfaces modernas.'
    },
    {
      nombre: 'Valentina',
      apellido: 'Morales',
      profesion: 'UX/UI Designer',
      imagenUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=400&q=80',
      descripcion: 'Apasionada por la experiencia del usuario y los sistemas de diseño.'
    },
    {
      nombre: 'Carlos',
      apellido: 'Ibáñez',
      profesion: 'Backend Engineer',
      imagenUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      descripcion: 'Experto en arquitecturas de microservicios y bases de datos distribuidas.'
    }
  ];

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

        <main>
          {/* Renderizado de tarjetas pasando datos por props */}
          <div className="profiles-grid">
            {perfiles.map((perfil, index) => (
              <TarjetaPresentacion
                key={index}
                nombre={perfil.nombre}
                apellido={perfil.apellido}
                profesion={perfil.profesion}
                imagenUrl={perfil.imagenUrl}
                descripcion={perfil.descripcion}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
