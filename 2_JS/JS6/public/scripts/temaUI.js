// Gestiona el modo claro/oscuro. Aplica el tema guardado de inmediato
// (para evitar parpadeos) y conecta el botón de alternancia una vez
// que el DOM está listo.

const CLAVE_TEMA = 'ahorcado-tema';

// Aplica el tema al elemento raíz del documento.
function aplicarTema(tema) {
  document.documentElement.setAttribute('data-tema', tema);
}

// Determina el tema inicial: preferencia guardada o el del sistema.
function temaInicial() {
  const guardado = localStorage.getItem(CLAVE_TEMA);
  if (guardado === 'claro' || guardado === 'oscuro') return guardado;
  const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefiereOscuro ? 'oscuro' : 'claro';
}

// Aplica el tema inmediatamente (antes de que se pinte el body).
aplicarTema(temaInicial());

// Conecta el botón y sincroniza su ícono una vez cargado el DOM.
document.addEventListener('DOMContentLoaded', () => {
  const boton = document.querySelector('#btnTema');
  if (!boton) return;

  function actualizarIcono() {
    const actual = document.documentElement.getAttribute('data-tema');
    boton.textContent = actual === 'oscuro' ? '☀️' : '🌙';
  }

  boton.addEventListener('click', () => {
    const actual = document.documentElement.getAttribute('data-tema');
    const nuevo = actual === 'oscuro' ? 'claro' : 'oscuro';
    aplicarTema(nuevo);
    localStorage.setItem(CLAVE_TEMA, nuevo);
    actualizarIcono();
  });

  actualizarIcono();
});
