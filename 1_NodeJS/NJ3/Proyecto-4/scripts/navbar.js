/**
 * navbar.js
 * Orquestador común para estado Activo y auto-repliegue del menú Responsive.
 */

document.addEventListener('DOMContentLoaded', () => {
    const rutaVisual = window.location.pathname;
    const arrayEnlaces = document.querySelectorAll('.navbar-nav .nav-link');
    
    // Iluminación estática del enlace seleccionado
    arrayEnlaces.forEach(enlace => {
        const target = enlace.getAttribute('href');
        if (rutaVisual === target) {
            // Eliminar color previo si preexistia en el framework por defecto y asignar activo puro
            enlace.classList.add('text-blanco');
            enlace.classList.remove('text-info', 'text-warning');
        }
    });

    // Repliegue móvil automático post-clic
    const colapsableDiv = document.getElementById('menuPrincipal');
    if (colapsableDiv) {
        arrayEnlaces.forEach(enlace => {
            enlace.addEventListener('click', () => {
                if (colapsableDiv.classList.contains('show')) {
                    const motorBS = bootstrap.Collapse.getInstance(colapsableDiv);
                    if (motorBS) motorBS.hide();
                }
            });
        });
    }
});
