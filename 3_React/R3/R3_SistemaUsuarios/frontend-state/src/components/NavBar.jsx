// Componente NavBar para frontend-state con conmutacion de vistas mediante botones
import React from 'react';
import useAuth from '../hooks/useAuth';

export function NavBar({ vistaActual, cambiarVista }) {
  const { usuario, logout } = useAuth();

  const handleLogout = () => {
    logout();
    cambiarVista('login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom mb-4">
      <div className="container">
        <button
          onClick={() => cambiarVista(usuario ? 'panel' : 'login')}
          className="navbar-brand d-flex align-items-center fw-bold btn btn-link text-decoration-none p-0 border-0 text-white"
        >
          <i className="bi bi-layers-fill me-2 text-info"></i>
          <span>R3 Usuarios</span>
          <span className="brand-badge">useState App</span>
        </button>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContentState"
          aria-controls="navbarContentState"
          aria-expanded="false"
          aria-label="Alternar navegacion"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContentState">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {usuario ? (
              <>
                <li className="nav-item">
                  <button
                    onClick={() => cambiarVista('panel')}
                    className={`nav-link btn btn-link text-decoration-none ${
                      vistaActual === 'panel' ? 'active fw-bold text-white' : 'text-light'
                    }`}
                  >
                    <i className="bi bi-speedometer2 me-1"></i> Panel
                  </button>
                </li>
                <li className="nav-item d-flex align-items-center me-2">
                  <span className="text-light-50 me-2 small">
                    Hola, <strong>{usuario.nombre}</strong>
                  </span>
                  <span
                    className={
                      usuario.rol === 'administrador'
                        ? 'badge-role-admin'
                        : 'badge-role-user'
                    }
                  >
                    {usuario.rol}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger btn-sm"
                  >
                    <i className="bi bi-box-arrow-right me-1"></i> Cerrar Sesion
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <button
                    onClick={() => cambiarVista('login')}
                    className={`nav-link btn btn-link text-decoration-none ${
                      vistaActual === 'login' ? 'active fw-bold text-white' : 'text-light'
                    }`}
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i> Iniciar Sesion
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    onClick={() => cambiarVista('registro')}
                    className="btn btn-primary-custom btn-sm"
                  >
                    <i className="bi bi-person-plus me-1"></i> Registrarse
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
