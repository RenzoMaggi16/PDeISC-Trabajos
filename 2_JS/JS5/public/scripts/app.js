// Orquestador del frontend — gestión de alumnos (DOM + fetch)

// ── Variables de estado ──
let alumnos     = [];    // Copia local de todos los alumnos cargados desde la API
let modoEdicion = false; // true cuando el modal está en modo editar

// ── Inicialización ──
document.addEventListener('DOMContentLoaded', inicializar);

function inicializar() {
  document.getElementById('btnAgregar').addEventListener('click', abrirModalAgregar);
  document.getElementById('btnGuardar').addEventListener('click', manejarSubmitFormulario);
  document.getElementById('btnTema').addEventListener('click', toggleModoOscuro);

  // Búsqueda en tiempo real (filtrado local)
  document.getElementById('inputBuscar').addEventListener('input', (e) => {
    filtrarAlumnos(e.target.value.trim());
  });

  // Delegación de eventos para los botones Editar y Eliminar de la tabla
  document.getElementById('cuerpoTabla').addEventListener('click', (e) => {
    const btnEditar   = e.target.closest('.btn-editar');
    const btnEliminar = e.target.closest('.btn-eliminar');
    if (btnEditar)   abrirModalEditar(btnEditar.dataset.id);
    if (btnEliminar) eliminarAlumno(btnEliminar.dataset.id);
  });

  // Validación en tiempo real mientras el usuario escribe
  document.getElementById('inputNombre').addEventListener('input', () => {
    const val = document.getElementById('inputNombre').value;
    aplicarEstadoCampo('inputNombre', 'errorNombre', validarNombre(val));
  });
  document.getElementById('inputApellido').addEventListener('input', () => {
    const val = document.getElementById('inputApellido').value;
    aplicarEstadoCampo('inputApellido', 'errorApellido', validarApellido(val));
  });
  document.getElementById('inputEdad').addEventListener('input', () => {
    const val = document.getElementById('inputEdad').value;
    aplicarEstadoCampo('inputEdad', 'errorEdad', validarEdad(val));
  });

  inicializarTema();
  cargarAlumnos();
}

// ══════════════════════════════════════════
// MODO OSCURO / CLARO
// ══════════════════════════════════════════

// Lee la preferencia guardada en localStorage y aplica el tema al iniciar
function inicializarTema() {
  const temaGuardado = localStorage.getItem('tema');
  if (temaGuardado === 'oscuro') {
    document.body.classList.add('modo-oscuro');
    actualizarBotonTema(true);
  }
}

// Alterna entre modo claro y oscuro y guarda la preferencia
function toggleModoOscuro() {
  const estaOscuro = document.body.classList.toggle('modo-oscuro');
  localStorage.setItem('tema', estaOscuro ? 'oscuro' : 'claro');
  actualizarBotonTema(estaOscuro);
}

// Actualiza el ícono y texto del botón según el tema activo
function actualizarBotonTema(modoOscuroActivo) {
  document.getElementById('iconoTema').textContent  = modoOscuroActivo ? '☀️' : '🌙';
  document.getElementById('textoTema').textContent  = modoOscuroActivo ? 'Modo claro' : 'Modo oscuro';
}

// ══════════════════════════════════════════
// VALIDADORES PUROS (devuelven { valido, mensaje })
// ══════════════════════════════════════════

// Valida el campo Nombre con reglas específicas
function validarNombre(valor) {
  const v = valor.trim();
  if (v === '')                          return { valido: false, mensaje: 'El nombre no puede estar vacío.' };
  if (v.length < 3)                      return { valido: false, mensaje: 'El nombre debe tener al menos 3 caracteres.' };
  if (v.length > 50)                     return { valido: false, mensaje: 'El nombre no puede superar los 50 caracteres.' };
  if (/\d/.test(v))                      return { valido: false, mensaje: 'El nombre no puede contener números.' };
  if (/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]/.test(v)) return { valido: false, mensaje: 'El nombre solo puede contener letras.' };
  return { valido: true, mensaje: '✓ Nombre válido.' };
}

// Valida el campo Apellido con las mismas reglas que Nombre
function validarApellido(valor) {
  const v = valor.trim();
  if (v === '')                          return { valido: false, mensaje: 'El apellido no puede estar vacío.' };
  if (v.length < 3)                      return { valido: false, mensaje: 'El apellido debe tener al menos 3 caracteres.' };
  if (v.length > 50)                     return { valido: false, mensaje: 'El apellido no puede superar los 50 caracteres.' };
  if (/\d/.test(v))                      return { valido: false, mensaje: 'El apellido no puede contener números.' };
  if (/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]/.test(v)) return { valido: false, mensaje: 'El apellido solo puede contener letras.' };
  return { valido: true, mensaje: '✓ Apellido válido.' };
}

// Valida el campo Edad: entero, sin decimales, entre 1 y 120
function validarEdad(valor) {
  if (valor === '' || valor === null)    return { valido: false, mensaje: 'La edad no puede estar vacía.' };
  if (isNaN(valor))                      return { valido: false, mensaje: 'La edad debe ser un número.' };
  if (valor.includes('.') || valor.includes(',')) return { valido: false, mensaje: 'La edad no puede tener decimales.' };
  const num = parseInt(valor, 10);
  if (num < 1)                           return { valido: false, mensaje: 'La edad debe ser mayor a 0.' };
  if (num > 120)                         return { valido: false, mensaje: 'La edad no puede superar los 120 años.' };
  return { valido: true, mensaje: '✓ Edad válida.' };
}

// ══════════════════════════════════════════
// APLICAR ESTADO VISUAL A UN CAMPO
// ══════════════════════════════════════════

// Muestra u oculta el error y aplica clases de color al input según el resultado
function aplicarEstadoCampo(inputId, errorId, resultado) {
  const inputEl = document.getElementById(inputId);
  const errorEl = document.getElementById(errorId);

  errorEl.textContent = resultado.mensaje;
  errorEl.classList.remove('d-none', 'es-error', 'es-exito');
  inputEl.classList.remove('is-invalid', 'is-valid-custom');

  if (resultado.valido) {
    errorEl.classList.add('es-exito');
    inputEl.classList.add('is-valid-custom');
  } else {
    errorEl.classList.add('es-error');
    inputEl.classList.add('is-invalid');
  }
}

// Oculta el mensaje de error y limpia clases de validación de un campo
function limpiarEstadoCampo(inputId, errorId) {
  document.getElementById(errorId).classList.add('d-none');
  document.getElementById(errorId).classList.remove('es-error', 'es-exito');
  document.getElementById(inputId).classList.remove('is-invalid', 'is-valid-custom');
}

// ══════════════════════════════════════════
// CARGA Y RENDERIZADO
// ══════════════════════════════════════════

// Obtiene todos los alumnos desde la API y actualiza el estado local
async function cargarAlumnos() {
  try {
    const respuesta = await fetch('/api/alumnos');
    const json      = await respuesta.json();
    if (!json.ok) throw new Error(json.mensaje);
    alumnos = json.datos;
    renderizarTabla(alumnos);
    actualizarContador(alumnos.length);
  } catch (error) {
    mostrarToast('Error al cargar los alumnos. Intentá de nuevo.', 'error');
  }
}

// Renderiza las filas de la tabla a partir de un array de alumnos
function renderizarTabla(lista) {
  const cuerpo      = document.getElementById('cuerpoTabla');
  const estadoVacio = document.getElementById('estadoVacio');
  const tablaCard   = document.querySelector('.tabla-card');

  if (lista.length === 0) {
    cuerpo.innerHTML = '';
    tablaCard.classList.add('d-none');
    estadoVacio.classList.remove('d-none');
    return;
  }

  tablaCard.classList.remove('d-none');
  estadoVacio.classList.add('d-none');

  cuerpo.innerHTML = lista.map((alumno, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${alumno.nombre}</td>
      <td>${alumno.apellido}</td>
      <td>${alumno.edad}</td>
      <td>
        <button class="btn btn-warning btn-sm btn-editar me-1" data-id="${alumno.id}">Editar</button>
        <button class="btn btn-danger btn-sm btn-eliminar" data-id="${alumno.id}">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

// Actualiza el texto del contador en la barra de estadísticas
function actualizarContador(total) {
  const texto = total === 1 ? '1 alumno registrado' : `${total} alumnos registrados`;
  document.getElementById('contadorAlumnos').textContent = texto;
}

// ══════════════════════════════════════════
// BÚSQUEDA LOCAL
// ══════════════════════════════════════════

// Filtra el array local por nombre o apellido y re-renderiza sin llamar a la API
function filtrarAlumnos(termino) {
  if (termino === '') {
    renderizarTabla(alumnos);
    actualizarContador(alumnos.length);
    return;
  }
  const terminoMin = termino.toLowerCase();
  const resultados = alumnos.filter(
    (a) =>
      a.nombre.toLowerCase().includes(terminoMin) ||
      a.apellido.toLowerCase().includes(terminoMin)
  );
  renderizarTabla(resultados);
  actualizarContador(resultados.length);
}

// ══════════════════════════════════════════
// MODAL
// ══════════════════════════════════════════

// Abre el modal en modo "Agregar" con el formulario limpio
function abrirModalAgregar() {
  modoEdicion = false;
  limpiarModal();
  document.getElementById('tituloModal').textContent = 'Agregar Alumno';
  new bootstrap.Modal(document.getElementById('modalFormulario')).show();
}

// Obtiene los datos del alumno por id y abre el modal en modo "Editar"
async function abrirModalEditar(id) {
  try {
    const respuesta = await fetch(`/api/alumnos/${id}`);
    const json      = await respuesta.json();
    if (!json.ok) throw new Error(json.mensaje);
    const alumno = json.dato;
    modoEdicion  = true;
    limpiarModal();
    document.getElementById('tituloModal').textContent = 'Editar Alumno';
    document.getElementById('alumnoId').value          = alumno.id;
    document.getElementById('inputNombre').value       = alumno.nombre;
    document.getElementById('inputApellido').value     = alumno.apellido;
    document.getElementById('inputEdad').value         = alumno.edad;
    new bootstrap.Modal(document.getElementById('modalFormulario')).show();
  } catch (error) {
    mostrarToast('No se pudo cargar el alumno para editar.', 'error');
  }
}

// Limpia todos los campos del formulario y resetea los estados de validación
function limpiarModal() {
  document.getElementById('formularioAlumno').reset();
  document.getElementById('alumnoId').value = '';
  limpiarEstadoCampo('inputNombre',   'errorNombre');
  limpiarEstadoCampo('inputApellido', 'errorApellido');
  limpiarEstadoCampo('inputEdad',     'errorEdad');
}

// ══════════════════════════════════════════
// SUBMIT DEL FORMULARIO
// ══════════════════════════════════════════

// Maneja el envío: POST para agregar, PUT para editar
async function manejarSubmitFormulario() {
  if (!validarFormulario()) return;

  const id      = document.getElementById('alumnoId').value;
  const payload = {
    nombre:   document.getElementById('inputNombre').value.trim(),
    apellido: document.getElementById('inputApellido').value.trim(),
    edad:     parseInt(document.getElementById('inputEdad').value, 10),
  };

  const url    = modoEdicion ? `/api/alumnos/${id}` : '/api/alumnos';
  const metodo = modoEdicion ? 'PUT' : 'POST';

  try {
    const respuesta = await fetch(url, {
      method:  metodo,
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    const json = await respuesta.json();
    if (!json.ok) throw new Error(json.mensaje);

    bootstrap.Modal.getInstance(document.getElementById('modalFormulario')).hide();
    mostrarToast(json.mensaje, 'exito');
    await cargarAlumnos();
  } catch (error) {
    mostrarToast(error.message || 'Error al guardar el alumno.', 'error');
  }
}

// Valida todos los campos al guardar; devuelve true solo si los tres son válidos
function validarFormulario() {
  const resNombre   = validarNombre(document.getElementById('inputNombre').value);
  const resApellido = validarApellido(document.getElementById('inputApellido').value);
  const resEdad     = validarEdad(document.getElementById('inputEdad').value);

  aplicarEstadoCampo('inputNombre',   'errorNombre',   resNombre);
  aplicarEstadoCampo('inputApellido', 'errorApellido', resApellido);
  aplicarEstadoCampo('inputEdad',     'errorEdad',     resEdad);

  return resNombre.valido && resApellido.valido && resEdad.valido;
}

// ══════════════════════════════════════════
// ELIMINAR
// ══════════════════════════════════════════

// Solicita confirmación y envía DELETE a la API
async function eliminarAlumno(id) {
  const confirmado = window.confirm('¿Estás seguro de que deseas eliminar este alumno?');
  if (!confirmado) return;

  try {
    const respuesta = await fetch(`/api/alumnos/${id}`, { method: 'DELETE' });
    const json      = await respuesta.json();
    if (!json.ok) throw new Error(json.mensaje);
    mostrarToast(json.mensaje, 'exito');
    await cargarAlumnos();
  } catch (error) {
    mostrarToast(error.message || 'Error al eliminar el alumno.', 'error');
  }
}

// ══════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════

// Muestra una notificación toast; tipo: 'exito' | 'error'
function mostrarToast(mensaje, tipo) {
  const toastEl   = document.getElementById('toastNotificacion');
  const mensajeEl = document.getElementById('toastMensaje');

  toastEl.classList.remove('bg-success', 'bg-danger');
  toastEl.classList.add(tipo === 'exito' ? 'bg-success' : 'bg-danger');

  mensajeEl.textContent = mensaje;

  bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3000 }).show();
}
