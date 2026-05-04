document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('toast-container');
  if (!container) return;

  /*Muestra una notificación en la pantalla*/
  const mostrarNotificacion = (tipo, mensaje) => {
    let icon = 'ℹ️';
    if (tipo === 'exito') icon = '✅';
    if (tipo === 'error') icon = '❌';
    if (tipo === 'advertencia') icon = '⚠️';

    // Crear el elemento
    const toast = document.createElement('div');
    toast.className = `custom-toast ${tipo}`;
    
    toast.innerHTML = `
      <div class="toast-indicator"></div>
      <div class="toast-content">
        <span class="toast-icon">${icon}</span>
        <span>${mensaje}</span>
      </div>
      <button class="toast-close">&times;</button>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    const timeoutId = setTimeout(() => {
      cerrarToast(toast);
    }, 4000);
    toast.querySelector('.toast-close').addEventListener('click', () => {
      clearTimeout(timeoutId);
      cerrarToast(toast);
    });
  };

  /* Anima la salida y remueve el elemento del DOM*/
  const cerrarToast = (toast) => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    // Wait for transition to finish before removing
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 400); // Matches the CSS transition duration
  };

  // Export to global scope
  window.Notificaciones = {
    mostrar: mostrarNotificacion
  };
});
