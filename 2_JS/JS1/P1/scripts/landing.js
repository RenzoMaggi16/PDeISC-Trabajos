document.addEventListener('DOMContentLoaded', () => {
  
  /* 1. Navbar Solid on Scroll */
  const navbar = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* Mobile Nav Auto-close */
  const navLinks = document.querySelectorAll('.nav-link');
  const navCollapse = document.getElementById('navCollapse');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse.classList.contains('show')) {
        // Usa Bootstrap API si es necesario, o directamente remueve la clase
        navCollapse.classList.remove('show');
      }
    });
  });

  /* 2. Scroll Animations with IntersectionObserver */
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Si el elemento contiene contadores numéricos, activarlos
        if (entry.target.classList.contains('col-6') || entry.target.classList.contains('col-md-3')) {
          const counterEl = entry.target.querySelector('.counter');
          if (counterEl && !counterEl.classList.contains('counted')) {
            startCounterAnimation(counterEl);
            counterEl.classList.add('counted');
          }
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.row').forEach(row => {
    const hiddenElements = Array.from(row.querySelectorAll('.scroll-hidden'));
    hiddenElements.forEach((el, index) => {
      // Add stagger delay
      el.style.transitionDelay = `${index * 100}ms`;
      scrollObserver.observe(el);
    });
  });

  document.querySelectorAll('section > .container > h2.scroll-hidden, .scroll-hidden:not(.row .scroll-hidden)').forEach(el => {
    scrollObserver.observe(el);
  });

  // Number Counter Animation
  function startCounterAnimation(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 1500; // ms
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function (easeOutQuart)
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentVal = Math.floor(easeProgress * target);

      // Formatear con separador de miles
      element.textContent = currentVal.toLocaleString('es-AR');

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString('es-AR');
      }
    }

    requestAnimationFrame(updateCounter);
  }

});
