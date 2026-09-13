// Componente principal de frontend-state con navegacion condicional controlada por useState
import React, { useState, useEffect } from 'react';
import useAuth from './hooks/useAuth';
import NavBar from './components/NavBar';
import VistaLogin from './views/VistaLogin';
import VistaRegistro from './views/VistaRegistro';
import VistaPanel from './views/VistaPanel';

export function App() {
  const { usuario, cargando } = useAuth();
  const [vistaActual, setVistaActual] = useState('login');

  // Sincronizar la vista inicial cuando se completa la rehidratacion de sesion
  useEffect(() => {
    if (!cargando) {
      if (usuario) {
        setVistaActual('panel');
      } else if (vistaActual === 'panel') {
        setVistaActual('login');
      }
    }
  }, [usuario, cargando]);

  // Pantalla de carga mientras se valida el token
  if (cargando) {
    return (
      <div className="spinner-container">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Cargando sesion...</span>
        </div>
        <p className="mt-3 text-muted">Verificando sesion del usuario...</p>
      </div>
    );
  }

  // Guard de autorizacion para la vista 'panel'
  const vistaEfectiva = !usuario && vistaActual === 'panel' ? 'login' : vistaActual;

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar vistaActual={vistaEfectiva} cambiarVista={setVistaActual} />
      <main className="flex-grow-1">
        {vistaEfectiva === 'login' && <VistaLogin cambiarVista={setVistaActual} />}
        {vistaEfectiva === 'registro' && <VistaRegistro cambiarVista={setVistaActual} />}
        {vistaEfectiva === 'panel' && <VistaPanel cambiarVista={setVistaActual} />}
      </main>
      <footer className="py-3 bg-white border-top text-center text-muted small mt-auto">
        <div className="container">
          R3 Sistema de Usuarios &copy; {new Date().getFullYear()} — Arquitectura useState Navigation
        </div>
      </footer>
    </div>
  );
}

export default App;
