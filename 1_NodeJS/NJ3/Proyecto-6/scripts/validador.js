/**
 * validador.js
 * Módulo encargado de gestionar el estado de validación global del formulario.
 */

window.Validador = (() => {
  // Reglas de validación para cada campo del formulario
  const REGLAS = {
    'inp-nombre':        { requerido: true,  minLen: 3,  patron: /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/,  mensaje: 'Mínimo 3 caracteres. Solo letras, sin números ni caracteres especiales.' },
    'inp-apellido':      { requerido: true,  minLen: 3,  patron: /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/,  mensaje: 'Mínimo 3 caracteres. Solo letras, sin números ni caracteres especiales.' },
    'inp-fecha':         { requerido: true,  tipo: 'fecha',                                        mensaje: 'Ingresá una fecha válida (entre 5 y 120 años atrás).' },
    'radio-genero':      { requerido: true,  tipo: 'radio',                                        mensaje: 'Seleccioná una opción de género.' },
    'inp-telefono':      { requerido: false, patron: /^\d{7,15}$/,                                 mensaje: 'Solo números, sin letras. Entre 7 y 15 dígitos.' },
    'inp-email':         { requerido: true,  tipo: 'email',                                        mensaje: 'Ingresá un correo completo válido (ej: usuario@gmail.com).' },
    'inp-email-confirm': { requerido: true,  tipo: 'confirmar-email',                              mensaje: 'Los correos no coinciden o el formato es incompleto.' },
    'sel-pais': { requerido: true, tipo: 'select', mensaje: 'Seleccioná un país.' },
    'inp-usuario': { requerido: true, minLen: 4, maxLen: 20, patron: /^[a-zA-Z0-9_]+$/, mensaje: '4–20 caracteres: letras, números y guión bajo.' },
    'inp-password': { requerido: true, minLen: 8, tipo: 'password', mensaje: 'Mínimo 8 caracteres con al menos un número.' },
    'inp-edad': { requerido: true, min: 5, max: 120, tipo: 'number', mensaje: 'Ingresá una edad entre 5 y 120 años.' },
    'sel-rol': { requerido: true, tipo: 'select', mensaje: 'Seleccioná un rol.' },
    'chk-intereses': { requerido: true, tipo: 'checkbox-grupo', mensaje: 'Seleccioná al menos un interés.' },
    'inp-foto': { requerido: false, tipo: 'url', mensaje: 'La URL debe comenzar con http o https.' },
  };

  /**
   * Valida un campo individual por su id.
   * @param {string} idCampo - El ID del elemento o grupo a validar
   * @returns {Object} { valido: bool, mensaje: string }
   */
  function validarCampo(idCampo) {
    const campoData = REGLAS[idCampo];
    if (!campoData) return { valido: true, mensaje: '' };

    let valor = '';
    let elementos = [];

    // Captura inicial dependiendo del tipo
    if (campoData.tipo === 'radio') {
      const radioChecked = document.querySelector(`input[name="genero"]:checked`);
      valor = radioChecked ? radioChecked.value : '';
      elementos = [document.getElementById('radio-masc').closest('.campo').querySelector('.grupo-radios') || document.querySelector('.grupo-radios')]; // fallback visual
    } else if (campoData.tipo === 'checkbox-grupo') {
      const checks = document.querySelectorAll(`input[name="intereses"]:checked`);
      valor = checks.length > 0 ? 'checked' : '';
      elementos = [document.getElementById('chk-intereses-wrapper')];
    } else {
      const el = document.getElementById(idCampo);
      if (el) {
        valor = el.value.trim();
        elementos = [el];
      }
    }

    // Regla: Campo vacío
    if (!valor) {
      if (campoData.requerido) {
        return { valido: false, mensaje: campoData.mensaje };
      } else {
        return { valido: true, mensaje: '' }; // Válido porque es opcional y está vacío
      }
    }

    // Regla: Validaciones Específicas
    if (campoData.minLen && valor.length < campoData.minLen) return { valido: false, mensaje: campoData.mensaje };
    if (campoData.maxLen && valor.length > campoData.maxLen) return { valido: false, mensaje: campoData.mensaje };
    if (campoData.patron && !campoData.patron.test(valor)) return { valido: false, mensaje: campoData.mensaje };

    // Regex de correo estricto: requiere dominio con TLD de al menos 2 letras (ej: .com, .ar)
    const rxEmailEstricto = /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (campoData.tipo === 'email') {
      if (!rxEmailEstricto.test(valor)) return { valido: false, mensaje: campoData.mensaje };
    }

    if (campoData.tipo === 'confirmar-email') {
      // Primero validar que el propio campo tenga formato correcto
      if (!rxEmailEstricto.test(valor)) return { valido: false, mensaje: 'Ingresá un correo completo válido (ej: usuario@gmail.com).' };
      // Luego verificar que coincida con el campo original
      const emailOrig = document.getElementById('inp-email').value.trim();
      if (valor !== emailOrig) return { valido: false, mensaje: 'Los correos no coinciden.' };
    }

    if (campoData.tipo === 'fecha') {
      const fecha = new Date(valor);
      const diffAños = (new Date() - fecha) / (1000 * 60 * 60 * 24 * 365.25);
      if (isNaN(fecha.getTime()) || diffAños < 5 || diffAños > 120) return { valido: false, mensaje: campoData.mensaje };
    }

    if (campoData.tipo === 'password') {
      const tieneNum = /\d/.test(valor);
      if (valor.length < 8 || !tieneNum) return { valido: false, mensaje: campoData.mensaje };
    }

    if (campoData.tipo === 'number') {
      const num = parseInt(valor, 10);
      if (isNaN(num) || num < campoData.min || num > campoData.max) return { valido: false, mensaje: campoData.mensaje };
    }

    if (campoData.tipo === 'url') {
      if (!valor.startsWith('http://') && !valor.startsWith('https://')) return { valido: false, mensaje: campoData.mensaje };
    }

    return { valido: true, mensaje: '' };
  }

  /**
   * Obtiene el contenedor visual para colgar el mensaje de error de un input.
   */
  function obtenerContenedor(idCampo) {
    if (idCampo === 'radio-genero') {
      return document.querySelector('.grupo-radios').parentElement;
    }
    if (idCampo === 'chk-intereses') {
      return document.getElementById('chk-intereses-wrapper').parentElement;
    }
    // El input de contraseña está dentro de contenedor-password > campo
    if (idCampo === 'inp-password') {
      return document.getElementById(idCampo).closest('.campo');
    }
    return document.getElementById(idCampo).parentElement;
  }

  /**
   * Muestra el mensaje de error inline debajo del campo correspondiente.
   */
  function mostrarError(idCampo, mensaje) {
    const contenedor = obtenerContenedor(idCampo);
    if (!contenedor) return;

    limpiarError(idCampo); // Prevenir duplicados
    contenedor.classList.remove('campo-valido');
    contenedor.classList.add('campo-error');

    const errorSpan = document.createElement('span');
    errorSpan.className = 'mensaje-error';
    errorSpan.setAttribute('role', 'alert');
    errorSpan.textContent = mensaje;
    contenedor.appendChild(errorSpan);
  }

  /**
   * Borra el mensaje de error de un campo.
   */
  function limpiarError(idCampo) {
    const contenedor = obtenerContenedor(idCampo);
    if (!contenedor) return;
    contenedor.classList.remove('campo-error');
    const msgErr = contenedor.querySelector('.mensaje-error');
    if (msgErr) msgErr.remove();
    const msgExito = contenedor.querySelector('.mensaje-exito');
    if (msgExito) msgExito.remove();
  }

  /**
   * Agrega clase CSS de éxito al campo.
   */
  function marcarValido(idCampo) {
    const contenedor = obtenerContenedor(idCampo);
    if (!contenedor) return;
    limpiarError(idCampo);
    contenedor.classList.add('campo-valido');

    const exitoSpan = document.createElement('span');
    exitoSpan.className = 'mensaje-exito';
    exitoSpan.textContent = '✓';
    contenedor.appendChild(exitoSpan);
  }

  /**
   * Valida todos los campos del formulario.
   * @returns {Array} Un array de los identificadores de campos que arrojaron error.
   */
  function validarFormulario() {
    const idsAValidar = Object.keys(REGLAS);
    const errores = [];

    idsAValidar.forEach(id => {
      const res = validarCampo(id);
      if (!res.valido) {
        mostrarError(id, res.mensaje);
        errores.push(id);
      } else {
        marcarValido(id);
      }
    });

    return errores;
  }

  /**
   * Remueve todas las clases de validación y mensajes de error de todos los campos.
   */
  function resetearValidacion() {
    Object.keys(REGLAS).forEach(id => {
      const contenedor = obtenerContenedor(id);
      if (contenedor) {
        contenedor.classList.remove('campo-error', 'campo-valido');
        const msgs = contenedor.querySelectorAll('.mensaje-error, .mensaje-exito');
        msgs.forEach(m => m.remove());
      }
    });
  }

  return {
    REGLAS,
    validarCampo,
    validarFormulario,
    mostrarError,
    limpiarError,
    marcarValido,
    resetearValidacion
  };
})();
