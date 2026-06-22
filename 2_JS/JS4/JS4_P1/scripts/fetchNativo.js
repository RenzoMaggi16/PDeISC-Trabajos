// Módulo Fetch Nativo — maneja el panel izquierdo usando la API fetch del browser

const API_URL = 'https://jsonplaceholder.typicode.com/users';

// Extrae las iniciales del nombre completo (ej: "Leanne Graham" → "LG")
function obtenerIniciales(nombreCompleto) {
  const partes = nombreCompleto.trim().split(' ');
  const primera = partes[0] ? partes[0][0].toUpperCase() : '';
  const segunda = partes[1] ? partes[1][0].toUpperCase() : '';
  return primera + segunda;
}

// Construye el HTML de una tarjeta de usuario individual
function construirTarjeta(usuario, indice) {
  const iniciales = obtenerIniciales(usuario.name);
  const claseAvatar = `avatar-${indice % 6}`;

  return `
    <div class="card user-card mb-0">
      <div class="card-header">
        <div class="avatar ${claseAvatar}">${iniciales}</div>
        <div>
          <p class="user-name">${usuario.name}</p>
          <p class="user-username">@${usuario.username}</p>
        </div>
      </div>
      <div class="card-body">
        <p><i class="bi bi-envelope-fill text-secondary"></i> ${usuario.email}</p>
        <p><i class="bi bi-telephone-fill text-secondary"></i> ${usuario.phone}</p>
        <p><i class="bi bi-building-fill text-secondary"></i> ${usuario.company.name}</p>
        <p><i class="bi bi-geo-alt-fill text-secondary"></i> ${usuario.address.city}</p>
        <p><i class="bi bi-globe2 text-secondary"></i>
          <a href="https://${usuario.website}" target="_blank" rel="noopener noreferrer">
            ${usuario.website}
          </a>
        </p>
      </div>
    </div>
  `;
}

// Renderiza la lista de usuarios en el contenedor indicado
function renderUsuariosFetch(usuarios, containerId) {
  const contenedor = document.getElementById(containerId);
  contenedor.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'row row-cols-1 row-cols-md-2 g-3';

  usuarios.forEach((usuario, indice) => {
    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = construirTarjeta(usuario, indice);
    grid.appendChild(col);
  });

  contenedor.appendChild(grid);
}

// Actualiza la barra de estado con el texto y clase de color indicados
function actualizarEstadoFetch(elementoId, texto, claseColor) {
  const barra = document.getElementById(elementoId);
  barra.className = `status-bar ${claseColor}`;
  barra.innerHTML = texto;
}

// Maneja el click del botón Fetch Nativo: carga, renderiza y gestiona estados
async function manejarClickFetch() {
  const boton = document.getElementById('btn-fetch');
  const spinner = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>';

  boton.disabled = true;
  actualizarEstadoFetch('status-fetch', `${spinner}Cargando datos...`, 'text-info');

  try {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status}`);
    }

    const usuarios = await respuesta.json();
    renderUsuariosFetch(usuarios, 'results-fetch');
    actualizarEstadoFetch(
      'status-fetch',
      `✓ ${usuarios.length} usuarios cargados correctamente`,
      'text-success'
    );
  } catch (error) {
    document.getElementById('results-fetch').innerHTML =
      '<div class="error-state"><i class="bi bi-exclamation-triangle-fill me-2"></i>No se pudieron obtener los datos.</div>';
    actualizarEstadoFetch('status-fetch', '✗ Error al conectar con la API', 'text-danger');
    console.error('Fetch Nativo — error:', error);
  } finally {
    boton.disabled = false;
  }
}

// Inicialización: adjunta el listener al botón cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
  const boton = document.getElementById('btn-fetch');
  boton.addEventListener('click', manejarClickFetch);
});
