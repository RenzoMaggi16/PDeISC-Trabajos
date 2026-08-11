// Navbar — Barra de navegación persistente y responsive
//
// Estrategia para colapsar el menú en móvil:
//   Se usa un estado local `menuAbierto` que controla la presencia de la clase
//   Bootstrap "show" en el div colapsable. Al hacer clic en cualquier <NavLink>
//   se invoca handleCerrarMenu, que pone menuAbierto en false y cierra el menú.
//   Esta estrategia controlada evita depender del JS de Bootstrap para el colapso,
//   dando control total desde React.
//
// FIX: Se agregó "navbar navbar-expand-md" al elemento <nav>.
//   Bootstrap inyecta una media query que fuerza display:flex en el collapse
//   para pantallas md+. Sin esto, ".collapse { display: none !important }"
//   ganaba siempre, incluso en desktop.

import { useState } from 'react';
import { NavLink } from 'react-router-dom';

// Componente Navbar: barra superior presente en todas las rutas
function Navbar() {
  // Estado que controla si el menú hamburguesa está abierto en móvil
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Alterna la visibilidad del menú hamburguesa
  function handleToggleMenu() {
    setMenuAbierto((estadoActual) => !estadoActual);
  }

  // Cierra el menú al hacer clic en un enlace (crucial en móvil)
  function handleCerrarMenu() {
    setMenuAbierto(false);
  }

  return (
    // navbar-expand-md hace que Bootstrap expanda el menú en pantallas medianas y mayores
    <nav className="navbar navbar-expand-md navbar-tareaflow">
      <div className="container">
        {/* Marca / logotipo de la app */}
        <NavLink to="/" className="navbar-brand-custom" onClick={handleCerrarMenu}>
          <span className="brand-icon">✓</span>
          Tarea<span className="brand-accent">Flow</span>
        </NavLink>

        {/* Botón hamburguesa — Bootstrap lo oculta en md+ gracias a navbar-expand-md */}
        <button
          id="btn-toggle-menu"
          className="navbar-toggler navbar-toggler-custom"
          type="button"
          aria-label="Alternar menú de navegación"
          aria-expanded={menuAbierto}
          onClick={handleToggleMenu}
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Contenedor del menú:
            - En desktop (md+): Bootstrap lo expande automáticamente via navbar-expand-md
            - En móvil: la clase "show" controlada por React lo hace visible */}
        <div
          id="menu-principal"
          className={`collapse navbar-collapse${menuAbierto ? ' show' : ''}`}
        >
          <ul className="navbar-nav ms-auto align-items-md-center gap-md-2 pt-3 pt-md-0">
            {/* Enlace a Inicio */}
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link-custom${isActive ? ' activo' : ''}`
                }
                onClick={handleCerrarMenu}
              >
                🏠 Inicio
              </NavLink>
            </li>

            {/* Enlace a Nueva Tarea — resaltado como botón pill */}
            <li className="nav-item">
              <NavLink
                to="/crear"
                className={({ isActive }) =>
                  `btn-nav-nueva${isActive ? ' activo' : ''}`
                }
                onClick={handleCerrarMenu}
              >
                ＋ Nueva Tarea
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
