// Componente principal de React Router que define la estructura y el arbol de rutas
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import RutaProtegida from './components/RutaProtegida';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

export function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      <main className="flex-grow-1">
        <Routes>
          {/* Rutas publicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <RutaProtegida>
                <Dashboard />
              </RutaProtegida>
            }
          />

          {/* Ruta para errores 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="py-3 bg-white border-top text-center text-muted small mt-auto">
        <div className="container">
          R3 Sistema de Usuarios &copy; {new Date().getFullYear()} — Arquitectura React Router
        </div>
      </footer>
    </div>
  );
}

export default App;
