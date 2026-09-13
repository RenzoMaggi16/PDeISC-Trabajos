// Componente Guard para proteger rutas contra accesos no autenticados
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="spinner-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando sesion...</span>
        </div>
        <p className="mt-3 text-muted">Verificando sesion...</p>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}

export default RutaProtegida;
