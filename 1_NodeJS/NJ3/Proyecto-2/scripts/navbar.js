/**
 * navbar.js
 * Script generalizado de interacciones para el marco de navegación universal.
 */
document.addEventListener('DOMContentLoaded', () => {

    // 1. Identificación y enmarcado de Menú Activo
    const rutaEnCurso = window.location.pathname;
    const itemsNavegacion = document.querySelectorAll('.navbar-nav .nav-link');

    itemsNavegacion.forEach(item => {
        const urlAsignada = item.getAttribute('href');
        
        // Exactitud contra directorio raíz
        if (rutaEnCurso === urlAsignada || (rutaEnCurso === '/' && urlAsignada === '/')) {
            item.classList.add('active');
        } 
        // Comprobar coincidencia con rutas relativas express sub-nodos
        else if (urlAsignada !== '/' && rutaEnCurso.includes(urlAsignada)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // 2. Colapso automático de menú móvil de Bootstrap al clickear un acceso
    itemsNavegacion.forEach(item => {
        item.addEventListener('click', () => {
            const barreraColapsable = document.getElementById('menuNavegacionSecundario');
            if (barreraColapsable && barreraColapsable.classList.contains('show')) {
                // Instancia segura de colapso desde la ventana global de Bootstrap
                const moduloCollapse = window.bootstrap?.Collapse?.getInstance(barreraColapsable);
                if (moduloCollapse) moduloCollapse.hide();
            }
        });
    });

});
