/**
 * navbar.js
 * Orquestador interactivo del menú superior.
 */

document.addEventListener('DOMContentLoaded', () => {
    const btnHamburguesa = document.getElementById('btnHamburguesa');
    const menuPrincipal = document.getElementById('menuPrincipal');
    const navLinks = document.querySelectorAll('.nav-link');

    // Alternar menú en móvil
    if (btnHamburguesa && menuPrincipal) {
        btnHamburguesa.addEventListener('click', () => {
            menuPrincipal.classList.toggle('show');
        });

        // Alternar colapso automático cuando tocan un link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuPrincipal.classList.remove('show');
            });
        });
    }
});
