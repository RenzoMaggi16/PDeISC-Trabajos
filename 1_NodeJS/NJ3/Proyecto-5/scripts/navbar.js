/**
 * navbar.js
 * Modulo utilitario transversal para el control del menú superior y sombreados táctiles.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Iluminación reactiva 
    const pV = window.location.pathname;
    const arrayNodes = document.querySelectorAll('.navbar-nav .nav-link');
    
    arrayNodes.forEach(ref => {
        if (pV === ref.getAttribute('href')) {
            ref.classList.add('text-blanco');
            ref.classList.remove('text-info', 'text-warning');
        }
    });

});
