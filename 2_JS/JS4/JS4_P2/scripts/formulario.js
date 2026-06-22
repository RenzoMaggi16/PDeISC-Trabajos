// Orquestador del formulario: validación, selección de estrategia y render de respuesta

// Regex email estricta: usuario@dominio.extension (ej: hola@gmail.com)
// - usuario: 1+ caracteres que no sean espacio ni @
// - @
// - dominio: 1+ caracteres que no sean espacio ni @ ni punto al inicio/fin
// - punto (.)
// - extensión: 2 a 6 letras (com, ar, org, net, edu, etc.)
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}$/;

// Mínimo de caracteres para el nombre
const NOMBRE_MIN = 3;

// Solo letras (mayúsculas, minúsculas, tildes, ñ/Ñ) y espacios
const REGEX_NOMBRE = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;

// Muestra un mensaje de error debajo del campo indicado y agrega clase is-invalid
function mostrarErrorCampo(inputId, errorId, mensaje) {
  const input = document.getElementById(inputId);
  const errorDiv = document.getElementById(errorId);
  input.classList.add('is-invalid');
  input.classList.remove('is-valid');
  errorDiv.textContent = mensaje;
}

// Marca un campo como válido y limpia el mensaje de error
function marcarCampoValido(inputId, errorId) {
  const input = document.getElementById(inputId);
  const errorDiv = document.getElementById(errorId);
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  errorDiv.textContent = '';
}

// Elimina todos los estados de validación previos de los campos
function clearValidation() {
  ['input-nombre', 'input-email'].forEach((id) => {
    const input = document.getElementById(id);
    input.classList.remove('is-invalid', 'is-valid');
  });
  document.getElementById('error-nombre').textContent = '';
  document.getElementById('error-email').textContent = '';
}

// Valida ambos campos y retorna true si el formulario es válido
function validarFormulario(nombre, email) {
  let valido = true;

  // ── Validación del nombre ──────────────────────────────
  if (!nombre) {
    mostrarErrorCampo('input-nombre', 'error-nombre', 'El nombre es obligatorio.');
    valido = false;
  } else if (!REGEX_NOMBRE.test(nombre)) {
    mostrarErrorCampo('input-nombre', 'error-nombre', 'El nombre solo puede contener letras y espacios.');
    valido = false;
  } else if (nombre.length < NOMBRE_MIN) {
    mostrarErrorCampo(
      'input-nombre',
      'error-nombre',
      `El nombre debe tener al menos ${NOMBRE_MIN} caracteres (tiene ${nombre.length}).`
    );
    valido = false;
  } else {
    marcarCampoValido('input-nombre', 'error-nombre');
  }

  // ── Validación del email ───────────────────────────────
  if (!email) {
    mostrarErrorCampo('input-email', 'error-email', 'El email es obligatorio.');
    valido = false;
  } else if (!email.includes('@')) {
    mostrarErrorCampo('input-email', 'error-email', 'Falta el símbolo «@» en el email.');
    valido = false;
  } else if (email.split('@').length !== 2 || email.split('@')[1] === '') {
    mostrarErrorCampo('input-email', 'error-email', 'Falta el dominio después del «@» (ej: gmail.com).');
    valido = false;
  } else if (!email.split('@')[1].includes('.')) {
    mostrarErrorCampo('input-email', 'error-email', 'El dominio debe tener un punto (ej: gmail.com).');
    valido = false;
  } else if (!REGEX_EMAIL.test(email)) {
    mostrarErrorCampo('input-email', 'error-email', 'Email inválido. Format: usuario@dominio.com');
    valido = false;
  } else {
    marcarCampoValido('input-email', 'error-email');
  }

  return valido;
}

// Muestra el estado de carga en el panel de respuesta
function mostrarCargando() {
  document.getElementById('response-empty').style.display = 'none';
  document.getElementById('response-loading').style.display = 'flex';
  document.getElementById('response-content').style.display = 'none';
  document.getElementById('response-panel').classList.remove('has-content');
}

// Renderiza el estado de éxito con los datos devueltos por la API
function renderRespuesta(data, metodo) {
  const etiquetaMetodo = metodo === 'fetch' ? 'Fetch Nativo' : 'Axios';
  const claseMetodo = metodo === 'fetch' ? 'fetch' : 'axios';
  const payloadFormateado = JSON.stringify(data.payload, null, 2);

  const html = `
    <p class="success-header mb-3">
      <i class="bi bi-check-circle-fill me-2"></i>Usuario registrado
    </p>
    <hr class="resp-divider" />

    <div class="d-flex align-items-center gap-3 mb-3">
      <span class="fw-semibold">ID asignado:</span>
      <span class="id-badge">${data.id}</span>
    </div>

    <hr class="resp-divider" />

    <div class="mb-1"><span class="fw-semibold">Nombre:</span> ${data.nombre}</div>
    <div class="mb-1"><span class="fw-semibold">Email:</span> ${data.email}</div>
    <div class="mb-1">
      <span class="fw-semibold">Método:</span>
      <span class="metodo-badge ${claseMetodo} ms-1">${etiquetaMetodo}</span>
    </div>
    <div class="mb-3">
      <span class="fw-semibold">Código:</span>
      <span class="mono">${data.status} ${data.statusText}</span>
    </div>

    <hr class="resp-divider" />

    <p class="fw-semibold mb-1">Payload recibido:</p>
    <pre class="payload-block mono">${payloadFormateado}</pre>
  `;

  const contenido = document.getElementById('response-content');
  contenido.innerHTML = html;
  contenido.style.display = 'block';
  document.getElementById('response-loading').style.display = 'none';
  document.getElementById('response-panel').classList.add('has-content');
}

// Renderiza el estado de error con el mensaje recibido
function renderError(mensaje) {
  const html = `
    <p class="error-header mb-3">
      <i class="bi bi-x-circle-fill me-2"></i>Error al enviar
    </p>
    <div class="error-detail mono">${mensaje}</div>
  `;

  const contenido = document.getElementById('response-content');
  contenido.innerHTML = html;
  contenido.style.display = 'block';
  document.getElementById('response-loading').style.display = 'none';
  document.getElementById('response-panel').classList.add('has-content');
}

// Determina qué radio está seleccionado y retorna 'fetch' o 'axios'
function obtenerMetodoSeleccionado() {
  const radios = document.querySelectorAll('input[name="metodo"]');
  for (const radio of radios) {
    if (radio.checked) return radio.value;
  }
  return 'fetch';
}

// Maneja el click de envío: valida, llama a la estrategia correcta y renderiza
async function manejarEnvio() {
  const nombre = document.getElementById('input-nombre').value.trim();
  const email  = document.getElementById('input-email').value.trim();
  const boton  = document.getElementById('btn-submit');

  clearValidation();

  if (!validarFormulario(nombre, email)) return;

  const metodo = obtenerMetodoSeleccionado();
  boton.disabled = true;
  mostrarCargando();

  try {
    let data;
    if (metodo === 'fetch') {
      data = await window.postConFetch(nombre, email);
    } else {
      data = await window.postConAxios(nombre, email);
    }
    renderRespuesta(data, metodo);
  } catch (error) {
    renderError(typeof error === 'string' ? error : 'Error inesperado al procesar la respuesta.');
  } finally {
    boton.disabled = false;
  }
}

// Inicialización: adjunta el listener al botón cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
  const btnSubmit = document.getElementById('btn-submit');
  const inputNombre = document.getElementById('input-nombre');
  const inputEmail  = document.getElementById('input-email');

  // Enviar al hacer clic
  btnSubmit.addEventListener('click', manejarEnvio);

  // Permitir enviar con Enter desde cualquier campo
  [inputNombre, inputEmail].forEach((input) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') manejarEnvio();
    });
  });

  // ── Validación en tiempo real (feedback mientras el usuario escribe) ──

  inputNombre.addEventListener('input', () => {
    const valor = inputNombre.value.trim();
    if (!valor) {
      // Campo vacío: limpiar clases pero no mostrar error aún
      inputNombre.classList.remove('is-valid', 'is-invalid');
      document.getElementById('error-nombre').textContent = '';
    } else if (!REGEX_NOMBRE.test(valor)) {
      mostrarErrorCampo('input-nombre', 'error-nombre', 'Solo se permiten letras y espacios.');
    } else if (valor.length < NOMBRE_MIN) {
      mostrarErrorCampo(
        'input-nombre',
        'error-nombre',
        `Mín. ${NOMBRE_MIN} caracteres — te faltan ${NOMBRE_MIN - valor.length}.`
      );
    } else {
      marcarCampoValido('input-nombre', 'error-nombre');
    }
  });

  inputEmail.addEventListener('input', () => {
    const valor = inputEmail.value.trim();
    if (!valor) {
      inputEmail.classList.remove('is-valid', 'is-invalid');
      document.getElementById('error-email').textContent = '';
    } else if (!valor.includes('@')) {
      mostrarErrorCampo('input-email', 'error-email', 'Falta el símbolo «@».');
    } else if (!valor.split('@')[1] || !valor.split('@')[1].includes('.')) {
      mostrarErrorCampo('input-email', 'error-email', 'Falta el dominio (ej: gmail.com).');
    } else if (!REGEX_EMAIL.test(valor)) {
      mostrarErrorCampo('input-email', 'error-email', 'Formato inválido. Ej: hola@gmail.com');
    } else {
      marcarCampoValido('input-email', 'error-email');
    }
  });
});
