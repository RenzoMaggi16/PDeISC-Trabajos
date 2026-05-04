document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formulario-solicitud');
  const inputs = form.querySelectorAll('input');

  // KEY BLOCKING
  inputs.forEach(input => {
    input.addEventListener('keydown', (event) => {
      // Permitir teclas de control: Backspace, Tab, Arrows, Delete, etc.
      if (['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'].includes(event.key)) {
        return;
      }

      const id = input.id;

      // Bloquear números en Nombre y Apellido
      if (id === 'nombre' || id === 'apellido') {
        if (/\d/.test(event.key)) {
          event.preventDefault();
        }
      }

      // Bloquear letras en Celular, DNI e Ingresos
      if (id === 'celular' || id === 'dni' || id === 'ingresos') {
        if (!/\d/.test(event.key)) {
          event.preventDefault();
        }
      }
    });

    // LIVE VALIDATION
    input.addEventListener('blur', () => {
      marcarCampo(input);
    });

    input.addEventListener('input', () => {
      // Si el usuario empieza a escribir, limpiamos el error para no frustrarlo
      if (input.classList.contains('is-invalid')) {
        limpiarCampo(input);
      }
    });
  });

  // FORM SUBMISSION
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Detener el envío recarga la página

    let formIsValid = true;
    let firstInvalidInput = null;

    // Validar todos los campos
    inputs.forEach(input => {
      const isInputValid = marcarCampo(input);
      if (!isInputValid) {
        formIsValid = false;
        if (!firstInvalidInput) {
          firstInvalidInput = input;
        }
      }
    });

    if (formIsValid) {
      // Llamar a perfil.js para generar la tarjeta
      if (typeof generarPerfil === 'function') {
        generarPerfil(form);
      } else {
        console.error("generarPerfil is not defined. Make sure perfil.js is loaded.");
      }
    } else {
      // Hacer focus en el primer error
      firstInvalidInput.focus();
    }
  });

  // Valida un input y aplica las clases CSS correspondientes.
  function marcarCampo(input) {
    const validacion = validarCampo(input.name, input.value);
    const errorDiv = document.getElementById(`error-${input.id}`);

    if (validacion.isValid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      if (errorDiv) errorDiv.textContent = "";
      return true;
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      if (errorDiv) errorDiv.textContent = validacion.mensaje;
      return false;
    }
  }

  // Limpia el estado de validación de un input.
  function limpiarCampo(input) {
    input.classList.remove('is-invalid', 'is-valid');
    const errorDiv = document.getElementById(`error-${input.id}`);
    if (errorDiv) errorDiv.textContent = "";
  }
});
