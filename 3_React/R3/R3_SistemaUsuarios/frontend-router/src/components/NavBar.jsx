// Componente de barra de navegacion para la aplicacion con React Router
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export function NavBar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom mb-4">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center fw-bold" to="/">
          <i className="bi bi-people-fill me-2 text-primary"></i>
          <span>R3 Usuarios</span>
          <span className="brand-badge">React Router</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Alternar navegacion"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {usuario ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/">
                    <i className="bi bi-speedometer2 me-1"></i> Panel
                  </Link>
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
                  <Link className="nav-link text-light" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i> Iniciar Sesion
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary-custom btn-sm" to="/registro">
                    <i className="bi bi-person-plus me-1"></i> Registrarse
                  </Link>
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
