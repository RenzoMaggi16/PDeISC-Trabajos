/**
 * @file tema.js
 * @description Maneja el contexto global del tema (Modo Día / Modo Noche) y los eventos del botón.
 * @module Context/Tema
 */

document.addEventListener('DOMContentLoaded', () => {
  const btnTema = document.getElementById('btnTema');
  if (!btnTema) return;

  const aplicarTema = (tema) => {
    const esNoche = tema === 'noche';
    document.body.classList.toggle('tema-noche', esNoche);
    
    if (esNoche) {
      btnTema.innerHTML = '<i class="bi bi-moon-stars"></i> <span>Modo Noche</span>';
    } else {
      btnTema.innerHTML = '<i class="bi bi-sun"></i> <span>Modo Día</span>';
    }
  };

  const inicializarTema = () => {
    const temaGuardado = localStorage.getItem('tema') || 'dia';
    aplicarTema(temaGuardado);
  };

  btnTema.addEventListener('click', () => {
    const esActualNoche = document.body.classList.contains('tema-noche');
    const nuevoTema = esActualNoche ? 'dia' : 'noche';
    localStorage.setItem('tema', nuevoTema);
    aplicarTema(nuevoTema);
  });

  // Inicializar todo al cargar el DOM
  inicializarTema();
});
