// Vista para rutas inexistentes (Error 404) en React Router
import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="container py-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="custom-card p-5">
            <div className="display-1 fw-bold text-primary mb-3">404</div>
            <h3 className="fw-bold mb-3">Pagina no encontrada</h3>
            <p className="text-muted mb-4">
              La seccion a la que intenta acceder no existe o ha sido movida.
            </p>
            <Link to="/" className="btn btn-primary-custom">
              <i className="bi bi-house-door me-2"></i>Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
