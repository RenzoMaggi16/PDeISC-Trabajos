/**
 * EL FARO INFORME — script.js
 * Handles: (1) category filtering, (2) contact form strict validation.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. CATEGORY FILTER ─────────────────────────────────────────────────
    const filterLinks = document.querySelectorAll('[data-filter]');
    const allCards    = document.querySelectorAll('[data-category]');

    filterLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = link.dataset.filter;

            // Toggle active state on nav links
            filterLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show / hide cards based on category
            allCards.forEach(card => {
                const wrapper = card.closest('.col');
                if (!wrapper) return;
                if (target === 'all' || card.dataset.category === target) {
                    wrapper.style.display = '';
                } else {
                    wrapper.style.display = 'none';
                }
            });

            // Hero card: show only when "all" or "deportes" is active
            const hero = document.getElementById('hero-aldosivi');
            if (hero) {
                hero.style.display =
                    (target === 'all' || target === 'deportes') ? '' : 'none';
            }

            // Update section heading dynamically
            const heading = document.getElementById('filter-heading');
            if (heading) {
                heading.textContent = (target === 'all')
                    ? 'Últimas noticias'
                    : link.textContent.trim();
            }
        });
    });

    // ─── 2. AUTO-CLOSE MOBILE NAVBAR ────────────────────────────────────────
    const navLinks = document.querySelectorAll('.site-nav .nav-link');
    const navbarCollapse = document.getElementById('navbarContent');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });

});
