// Orquestador principal: estado global, render de todas las vistas, eventos y modal

// Estado de la aplicación — objeto único mutable por este módulo
const estado = {
  alumnos:        [],
  vistaActual:    'cards',
  filtroCarrera:  '',
  ultimaRespuesta: null,
};

// Instancia del modal de Bootstrap — se crea de forma lazy al primer uso
let modalBS = null;

// Abre el modal: usa Bootstrap.Modal si está disponible, si no aplica clases CSS directamente
function abrirModal() {
  const el = document.getElementById('modalDetalle');
  if (typeof bootstrap !== 'undefined') {
    if (!modalBS) modalBS = new bootstrap.Modal(el);
    modalBS.show();
    return;
  }
  // Fallback CSS: muestra el modal manualmente sin Bootstrap JS
  el.classList.add('show');
  el.style.display = 'block';
  document.body.classList.add('modal-open');
  if (!document.querySelector('.modal-backdrop')) {
    const bd = document.createElement('div');
    bd.className = 'modal-backdrop fade show';
    document.body.appendChild(bd);
  }
}

// Cierra el modal con fallback CSS
function cerrarModal() {
  const el = document.getElementById('modalDetalle');
  if (typeof bootstrap !== 'undefined' && modalBS) {
    modalBS.hide();
    return;
  }
  el.classList.remove('show');
  el.style.display = 'none';
  document.body.classList.remove('modal-open');
  const bd = document.querySelector('.modal-backdrop');
  if (bd) bd.remove();
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Escapa caracteres HTML para inserción segura en innerHTML
function esc(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Extrae iniciales del nombre completo (hasta 2 palabras)
function iniciales(nombre) {
  const p = nombre.trim().split(' ');
  return (p[0]?.[0] || '') + (p[1]?.[0] || '');
}

// Devuelve la clase CSS de color según el promedio
function clasePromedio(promedio) {
  if (promedio >= 8.5) return 'promedio-success';
  if (promedio >= 7.0) return 'promedio-warning';
  return 'promedio-danger';
}

// Devuelve la clase Bootstrap para la barra de progreso según el promedio
function claseBarra(promedio) {
  if (promedio >= 8.5) return 'bg-success';
  if (promedio >= 7.0) return 'bg-warning';
  return 'bg-danger';
}

// ── Render de tarjetas ────────────────────────────────────────────────────────

// Construye el HTML de una tarjeta de alumno individual
function construirTarjeta(alumno) {
  const ini    = iniciales(alumno.nombre).toUpperCase();
  const cls    = `avatar-${alumno.id % 6}`;
  const pct    = (alumno.promedio * 10).toFixed(0);
  const barra  = claseBarra(alumno.promedio);
  const estado = alumno.activo
    ? '<span class="badge bg-success">Activo</span>'
    : '<span class="badge bg-secondary">Inactivo</span>';

  return `
    <div class="card alumno-card">
      <div class="card-header">
        <div class="avatar ${cls}">${esc(ini)}</div>
        <div>
          <p class="alumno-nombre">${esc(alumno.nombre)}</p>
          <p class="alumno-carrera">${esc(alumno.carrera)}</p>
        </div>
      </div>
      <div class="card-body">
        <p class="mb-1 small"><i class="bi bi-cake2 me-1 text-secondary"></i>${esc(String(alumno.edad))} años</p>
        <p class="mb-2 small">
          <i class="bi bi-bar-chart me-1 text-secondary"></i>
          Promedio: <span class="${clasePromedio(alumno.promedio)}">${alumno.promedio.toFixed(1)}</span>
        </p>
        <div class="progress mb-2" style="height:6px;">
          <div class="progress-bar ${barra}" role="progressbar" style="width:${pct}%"></div>
        </div>
        ${estado}
      </div>
      <div class="card-footer">
        <button class="btn-ver-detalle" data-id="${alumno.id}">
          <i class="bi bi-eye me-1"></i>Ver detalle
        </button>
      </div>
    </div>
  `;
}

// Renderiza el grid de tarjetas; muestra estado vacío si no hay alumnos
function renderCards(alumnos) {
  const grid = document.getElementById('cards-grid');

  if (alumnos.length === 0) {
    grid.innerHTML = `
      <div class="col-12 empty-state">
        <i class="bi bi-person-x"></i>
        <p>No hay alumnos para la carrera seleccionada.</p>
      </div>`;
    return;
  }

  grid.innerHTML = alumnos
    .map((a) => `<div class="col">${construirTarjeta(a)}</div>`)
    .join('');

  // Adjunta listeners a todos los botones "Ver detalle"
  grid.querySelectorAll('.btn-ver-detalle').forEach((btn) => {
    btn.addEventListener('click', () => abrirDetalle(Number(btn.dataset.id)));
  });
}

// ── Render de tabla ───────────────────────────────────────────────────────────

// Renderiza las filas de la tabla; muestra estado vacío si no hay alumnos
function renderTabla(alumnos) {
  const tbody = document.getElementById('tabla-body');

  if (alumnos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted py-4">
          No hay alumnos para la carrera seleccionada.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = alumnos.map((a) => {
    const estadoBadge = a.activo
      ? '<span class="badge bg-success">Activo</span>'
      : '<span class="badge bg-secondary">Inactivo</span>';

    return `
      <tr>
        <td class="text-muted small">${a.id}</td>
        <td class="fw-semibold">${esc(a.nombre)}</td>
        <td>${a.edad} años</td>
        <td class="small">${esc(a.carrera)}</td>
        <td class="${clasePromedio(a.promedio)}">${a.promedio.toFixed(1)}</td>
        <td>${estadoBadge}</td>
        <td>
          <button class="btn-ver-tabla" data-id="${a.id}">
            <i class="bi bi-eye me-1"></i>Ver
          </button>
        </td>
      </tr>`;
  }).join('');

  // Adjunta listeners a todos los botones "Ver" de la tabla
  tbody.querySelectorAll('.btn-ver-tabla').forEach((btn) => {
    btn.addEventListener('click', () => abrirDetalle(Number(btn.dataset.id)));
  });
}

// ── Render del modal ──────────────────────────────────────────────────────────

// Puebla el modal con los datos del alumno y lo abre
function renderModal(alumno) {
  const ini = iniciales(alumno.nombre).toUpperCase();
  const cls = `avatar-${alumno.id % 6}`;

  const avatarEl = document.getElementById('modal-avatar');
  avatarEl.textContent  = ini;
  avatarEl.className    = `avatar ${cls}`;

  document.getElementById('modalDetalleLabel').textContent = alumno.nombre;

  const estadoBadge = document.getElementById('modal-estado-badge');
  estadoBadge.textContent  = alumno.activo ? 'Activo' : 'Inactivo';
  estadoBadge.className    = `badge ${alumno.activo ? 'bg-success' : 'bg-secondary'}`;

  document.getElementById('modal-id').textContent      = alumno.id;
  document.getElementById('modal-edad').textContent    = `${alumno.edad} años`;
  document.getElementById('modal-carrera').textContent = alumno.carrera;
  document.getElementById('modal-promedio').textContent = `${alumno.promedio.toFixed(1)} / 10`;

  const bar = document.getElementById('modal-progress-bar');
  bar.style.width = `${alumno.promedio * 10}%`;
  bar.className   = `progress-bar ${claseBarra(alumno.promedio)}`;

  document.getElementById('modal-json').textContent = JSON.stringify(alumno, null, 2);

  abrirModal();
}



// ── Contador ──────────────────────────────────────────────────────────────────

// Actualiza el contador de alumnos mostrados
function actualizarContador(n) {
  document.getElementById('counter-alumnos').textContent =
    `${n} alumno${n !== 1 ? 's' : ''}`;
}

// ── Toggle de vista ───────────────────────────────────────────────────────────

// Alterna entre la vista de tarjetas y la vista de tabla
function toggleVista(modo) {
  estado.vistaActual = modo;

  document.getElementById('vista-cards').classList.toggle('d-none', modo !== 'cards');
  document.getElementById('vista-tabla').classList.toggle('d-none', modo !== 'tabla');

  document.querySelectorAll('.btn-vista').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.vista === modo);
  });
}

// ── Carga de datos ────────────────────────────────────────────────────────────

// Carga el estado de carga visual en ambas vistas
function mostrarCargando() {
  document.getElementById('cards-grid').innerHTML =
    '<div class="col-12 text-center text-muted py-5"><div class="spinner-border text-indigo"></div><p class="mt-3">Cargando alumnos...</p></div>';
  document.getElementById('tabla-body').innerHTML =
    '<tr><td colspan="7" class="text-center text-muted py-4">Cargando...</td></tr>';
}

// Obtiene alumnos de la API, actualiza el estado y renderiza ambas vistas
async function cargarAlumnos(carrera) {
  mostrarCargando();

  try {
    const resultado = await window.fetchAlumnos(carrera || '');
    estado.alumnos       = resultado.data;
    estado.filtroCarrera = carrera || '';

    renderCards(estado.alumnos);
    renderTabla(estado.alumnos);
    actualizarContador(estado.alumnos.length);
  } catch (error) {
    const msg = typeof error === 'string' ? error : 'Error al conectar con la API.';
    document.getElementById('cards-grid').innerHTML =
      `<div class="col-12 empty-state text-danger"><i class="bi bi-exclamation-triangle"></i><p>${esc(msg)}</p></div>`;
  }
}

// ── Detalle de alumno ─────────────────────────────────────────────────────────

// Llama a la API por ID, actualiza el visor y abre el modal con los datos del alumno
async function abrirDetalle(id) {
  try {
    const resultado = await window.fetchAlumnoPorId(id);

    if (resultado.status === 404) {
      console.error('Alumno no encontrado en el servidor.');
      return;
    }

    renderModal(resultado.data);
  } catch (error) {
    console.error('Error al obtener el detalle:', error);
  }
}

// ── Inicialización ────────────────────────────────────────────────────────────

// Configura listeners y dispara la carga inicial al arrancar el DOM
document.addEventListener('DOMContentLoaded', () => {
  // Carga inicial sin filtro
  cargarAlumnos('');

  // Filtro por carrera
  document.getElementById('select-carrera').addEventListener('change', (e) => {
    cargarAlumnos(e.target.value);
  });

  // Toggle de vista
  document.querySelectorAll('.btn-vista').forEach((btn) => {
    btn.addEventListener('click', () => toggleVista(btn.dataset.vista));
  });

  // Cierre del modal vía fallback CSS (para entornos sin Bootstrap JS)
  document.querySelectorAll('[data-bs-dismiss="modal"]').forEach((btn) => {
    btn.addEventListener('click', cerrarModal);
  });
  document.getElementById('modalDetalle').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) cerrarModal();
  });
});
