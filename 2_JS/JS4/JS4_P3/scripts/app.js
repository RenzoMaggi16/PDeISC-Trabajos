// Orquestador principal: gestiona DOM, eventos, render y estado de la aplicación

// Variable de módulo — se asigna UNA sola vez tras el fetch, nunca se reasigna
let todosLosUsuarios = [];

// Extrae las iniciales del nombre completo (ej: "Leanne Graham" → "LG")
function obtenerIniciales(nombreCompleto) {
  const partes = nombreCompleto.trim().split(' ');
  const primera = partes[0] ? partes[0][0].toUpperCase() : '';
  const segunda = partes[1] ? partes[1][0].toUpperCase() : '';
  return primera + segunda;
}

// Escapa caracteres HTML para evitar XSS al inyectar texto en innerHTML
function escaparHTML(texto) {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Envuelve la parte del nombre que coincide con el término en una etiqueta <mark>
function resaltarCoincidencia(nombre, termino) {
  if (!termino.trim()) return escaparHTML(nombre);

  const regex = new RegExp(`(${termino.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return escaparHTML(nombre).replace(
    new RegExp(`(${escaparHTML(termino.trim()).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
    '<mark>$1</mark>'
  );
}

// Construye el HTML de una tarjeta de usuario con resaltado opcional
function construirTarjeta(usuario, termino) {
  const iniciales  = obtenerIniciales(usuario.name);
  const claseAvatar = `avatar-${usuario.id % 6}`;
  const nombreHTML  = resaltarCoincidencia(usuario.name, termino);

  return `
    <div class="card user-card">
      <div class="card-header">
        <div class="avatar ${claseAvatar}">${iniciales}</div>
        <div>
          <p class="user-name">${nombreHTML}</p>
          <p class="user-username">@${escaparHTML(usuario.username)}</p>
        </div>
      </div>
      <div class="card-body">
        <p><i class="bi bi-envelope-fill text-secondary"></i> ${escaparHTML(usuario.email)}</p>
        <p><i class="bi bi-telephone-fill text-secondary"></i> ${escaparHTML(usuario.phone)}</p>
        <p><i class="bi bi-building-fill text-secondary"></i> ${escaparHTML(usuario.company.name)}</p>
        <p><i class="bi bi-geo-alt-fill text-secondary"></i> ${escaparHTML(usuario.address.city)}</p>
        <p><i class="bi bi-globe2 text-secondary"></i>
          <a href="https://${escaparHTML(usuario.website)}" target="_blank" rel="noopener noreferrer">
            ${escaparHTML(usuario.website)}
          </a>
        </p>
      </div>
    </div>
  `;
}

// Genera el HTML de un skeleton placeholder para el estado de carga
function construirSkeleton() {
  return `
    <div class="col">
      <div class="skeleton-card">
        <div class="skeleton-circle"></div>
        <div class="skeleton-line wide"></div>
        <div class="skeleton-line narrow"></div>
        <div class="skeleton-line wide"></div>
        <div class="skeleton-line medium"></div>
      </div>
    </div>
  `;
}

// Muestra 6 tarjetas skeleton mientras se realiza el fetch inicial
function mostrarSkeletons() {
  const grid = document.getElementById('results-grid');
  grid.innerHTML = Array(6).fill(null).map(construirSkeleton).join('');
  document.getElementById('counter-line').textContent = '';
  document.getElementById('stats-bar').textContent = 'Cargando datos de la API...';
}

// Renderiza la lista de usuarios (con resaltado si hay término); muestra estado vacío si no hay resultados
function renderUsuarios(usuarios, termino) {
  const grid = document.getElementById('results-grid');
  termino = termino || '';

  if (usuarios.length === 0) {
    grid.innerHTML = construirEstadoVacio(termino);
    return;
  }

  grid.innerHTML = usuarios
    .map((u) => `<div class="col">${construirTarjeta(u, termino)}</div>`)
    .join('');
}

// Construye el HTML del estado vacío cuando ningún usuario coincide
function construirEstadoVacio(termino) {
  return `
    <div class="empty-state">
      <div class="empty-icon"><i class="bi bi-search"></i></div>
      <h5>Sin resultados</h5>
      <p>Ningún usuario coincide con "<strong>${escaparHTML(termino)}</strong>"</p>
      <button class="btn-limpiar" id="btn-limpiar-empty">
        <i class="bi bi-x-circle me-1"></i>Limpiar búsqueda
      </button>
    </div>
  `;
}

// Renderiza el estado de error cuando el fetch falla
function renderError(mensaje) {
  const grid = document.getElementById('results-grid');
  grid.innerHTML = `
    <div class="error-state">
      <div class="error-icon"><i class="bi bi-exclamation-triangle-fill"></i></div>
      <h5>Error al cargar los usuarios</h5>
      <p>${escaparHTML(mensaje)}</p>
      <button class="btn-reintentar" id="btn-reintentar">
        <i class="bi bi-arrow-clockwise me-1"></i>Reintentar
      </button>
    </div>
  `;
  document.getElementById('counter-line').textContent = '';
  document.getElementById('stats-bar').textContent = '';

  // El botón reintentar lanza nuevamente la carga completa
  document.getElementById('btn-reintentar').addEventListener('click', cargarUsuarios);
}

// Actualiza la línea de contador de resultados
function actualizarContador(visible, total) {
  document.getElementById('counter-line').textContent =
    `Mostrando ${visible} de ${total} usuarios`;
}

// Actualiza la barra de estadísticas según el término activo
function actualizarStatsBar(termino, visible, total) {
  const bar = document.getElementById('stats-bar');
  const terminoLimpio = termino.trim();

  if (!terminoLimpio) {
    bar.textContent = `${total} usuarios cargados  ·  escribí para filtrar`;
  } else if (visible === 0) {
    bar.textContent = `0 coincidencias para "${terminoLimpio}"`;
  } else {
    const ocultos = total - visible;
    bar.textContent = `${visible} coincidencia${visible !== 1 ? 's' : ''} para "${terminoLimpio}"  ·  ${ocultos} oculto${ocultos !== 1 ? 's' : ''}`;
  }
}

// Muestra u oculta el botón × según si el input tiene contenido
function actualizarBtnClear(valor) {
  const btn = document.getElementById('btn-clear');
  if (valor.length > 0) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
}

// Limpia el input de búsqueda y re-renderiza todos los usuarios
function limpiarBusqueda() {
  const input = document.getElementById('search-input');
  input.value = '';
  input.focus();
  actualizarBtnClear('');
  renderUsuarios(todosLosUsuarios, '');
  actualizarContador(todosLosUsuarios.length, todosLosUsuarios.length);
  actualizarStatsBar('', todosLosUsuarios.length, todosLosUsuarios.length);
}

// Maneja el evento input: filtra en memoria y re-renderiza sin llamadas de red
function manejarBusqueda(evento) {
  const termino   = evento.target.value;
  const resultado = window.filtrarPorNombre(todosLosUsuarios, termino);

  actualizarBtnClear(termino);
  renderUsuarios(resultado, termino);
  actualizarContador(resultado.length, todosLosUsuarios.length);
  actualizarStatsBar(termino, resultado.length, todosLosUsuarios.length);

  // Si aparece el botón "Limpiar búsqueda" en el estado vacío, adjunta su listener
  const btnVacio = document.getElementById('btn-limpiar-empty');
  if (btnVacio) btnVacio.addEventListener('click', limpiarBusqueda);
}

// Realiza el fetch inicial, almacena los datos y lanza el render
async function cargarUsuarios() {
  mostrarSkeletons();

  try {
    todosLosUsuarios = await window.obtenerUsuarios();
    renderUsuarios(todosLosUsuarios, '');
    actualizarContador(todosLosUsuarios.length, todosLosUsuarios.length);
    actualizarStatsBar('', todosLosUsuarios.length, todosLosUsuarios.length);
  } catch (error) {
    renderError(typeof error === 'string' ? error : 'Error inesperado al cargar los datos.');
  }
}

// Inicialización: ejecuta la carga y adjunta los listeners de búsqueda y clear
document.addEventListener('DOMContentLoaded', () => {
  cargarUsuarios();

  const searchInput = document.getElementById('search-input');
  const btnClear    = document.getElementById('btn-clear');

  searchInput.addEventListener('input', manejarBusqueda);
  btnClear.addEventListener('click', limpiarBusqueda);
});
