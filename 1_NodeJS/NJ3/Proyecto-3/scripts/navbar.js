/**
 * navbar.js
 * Módulo para interactividad compartida (mobile navbar y pintado de link activo).
 * Exposición rigurosa de reglas DOM en español.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Resaltado Dinámico del Enlace Activo
    const rutaActual = window.location.pathname;
    const enlacesNav = document.querySelectorAll('.navbar-nav .nav-link');
    
    enlacesNav.forEach(enlace => {
        const href = enlace.getAttribute('href');
        if (rutaActual === href || (rutaActual === '/' && href === '/')) {
            enlace.classList.add('active');
            enlace.setAttribute('aria-current', 'page');
        } else {
            enlace.classList.remove('active');
            enlace.removeAttribute('aria-current');
        }
    });

    // 2. Auto-Cierre del menú de navegación en dispositivos móviles
    const menuColapsable = document.getElementById('menuPrincipal');
    if (menuColapsable) {
        // Obtenemos la instancia de Bootstrap instalada si es requerida o manejamos auralmente puros clicks
        enlacesNav.forEach(enlace => {
            enlace.addEventListener('click', () => {
                if (menuColapsable.classList.contains('show')) {
                    // Cierra programáticamente usando Vanilla JS o Bootstrap Core
                    const bsCollapse = bootstrap.Collapse.getInstance(menuColapsable);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }
            });
        });
    }
});
