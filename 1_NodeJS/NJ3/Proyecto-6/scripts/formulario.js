/**
 * formulario.js
 * Orquestador de la recolección, UX local interactiva (slider, inputs) 
 * e hidratación hacia backend/perfil.
 */

window.FormularioOrquestador = (() => {
  let cacheDatosAnteriores = null;

  document.addEventListener('DOMContentLoaded', () => {
    iniciarEventosEscucha();
    iniciarObserverProgresion();
    configurarInputsVivos();
  });

  function iniciarEventosEscucha() {
    const form = document.getElementById('formularioRegistro');
    const inputs = form.querySelectorAll('input, select, textarea');

    // Escucha de Validaciones en tiempo real (input)
    inputs.forEach(el => {
      el.addEventListener('input', () => {
        if(el.type !== 'radio' && el.type !== 'checkbox') {
          window.Validador.validarCampo(el.id);
        }
        revisarBotonSubmit();
      });
      // Para checkbox/radios validamos on change (porque el blur es complejo de agarrar a nivel grupo)
      if(el.type === 'radio' || el.type === 'checkbox') {
        el.addEventListener('change', () => {
          window.Validador.validarCampo(el.name === 'genero' ? 'radio-genero' : (el.name.includes('intereses') ? 'chk-intereses' : el.id));
          revisarBotonSubmit();
        });
      }
    });

    // Envío (Submit) preventivo.
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      procesarEnvio();
    });

    // Limpiar (Reset)
    document.getElementById('btn-limpiar').addEventListener('click', limpiarTodo);
  }

  function revisarBotonSubmit() {
    const res = window.Validador.REGLAS;
    const boton = document.getElementById('btn-enviar');
    // Para simplificar: En un entorno de producción estricto verificaríamos TODOS onblur de corrido.
    // Aquí el boton se habilitará si al hacer un validateFormulario sin pintado, da 0.
    // Sin embargo, queremos Pintarlo obligadamente en click. Dejamos el boton habilitado.
    boton.disabled = false;
  }

  function configurarInputsVivos() {
    // Bloqueo de teclas para edad, teléfono (solo num) y provincia (sin nums)
    const inpTel = document.getElementById('inp-telefono');
    inpTel.addEventListener('keypress', (e) => {
        if (e.key.length === 1 && !/\d/.test(e.key)) e.preventDefault();
    });

    const inpEdad = document.getElementById('inp-edad');
    inpEdad.addEventListener('keypress', (e) => {
        // En type="number" suelen permitirse 'e', '+', '-', '.'
        if (e.key.length === 1 && !/\d/.test(e.key)) e.preventDefault();
    });

    const inpProvincia = document.getElementById('inp-provincia');
    inpProvincia.addEventListener('keypress', (e) => {
        if (e.key.length === 1 && /\d/.test(e.key)) e.preventDefault();
    });

    // 1. Contador Bio
    const inpBio = document.getElementById('inp-bio');
    const contadorBio = document.getElementById('contadorBio');
    inpBio.addEventListener('input', () => {
      const long = inpBio.value.length;
      contadorBio.textContent = `${long} / 300`;
      if (long >= 280) contadorBio.classList.add('limite');
      else contadorBio.classList.remove('limite');
    });

    // 2. Previsualización Foto con Debounce
    let timeoutUrl;
    const inpFoto = document.getElementById('inp-foto');
    const prevFotoCtx = document.getElementById('previsualizacionFoto');
    const prevImg = document.getElementById('img-preview');
    const errPrev = document.getElementById('error-preview');

    inpFoto.addEventListener('input', () => {
      clearTimeout(timeoutUrl);
      timeoutUrl = setTimeout(() => {
        const url = inpFoto.value.trim();
        if(url && (url.startsWith('http://') || url.startsWith('https://'))) {
          prevFotoCtx.classList.remove('oculto');
          prevImg.src = url;
          prevImg.classList.remove('oculto');
          errPrev.classList.add('oculto');
        } else {
          prevFotoCtx.classList.add('oculto');
        }
      }, 600);
    });

    prevImg.addEventListener('error', () => {
      prevImg.classList.add('oculto');
      errPrev.classList.remove('oculto');
    });

    // 3. Slider Nivel
    const inpNivel = document.getElementById('inp-nivel');
    const nivelVivo = document.getElementById('valor-nivel-vivo');
    const arrNiveles = ['', 'Principiante', 'Aprendiz', 'Intermedio', 'Avanzado', 'Experto'];
    inpNivel.addEventListener('input', () => {
      const val = parseInt(inpNivel.value, 10);
      nivelVivo.textContent = `${arrNiveles[val]} (${val})`;
    });

    // 4. Medidor de Fuerza de Password + Toggle Visibilidad
    const inpPass = document.getElementById('inp-password');
    const btnToggle = document.getElementById('btn-toggle-password');
    const tFuerza = document.getElementById('texto-fuerza');
    const b1 = document.getElementById('barra-fuerza-1');
    const b2 = document.getElementById('barra-fuerza-2');
    const b3 = document.getElementById('barra-fuerza-3');

    btnToggle.addEventListener('click', () => {
      if(inpPass.type === 'password') {
        inpPass.type = 'text';
        btnToggle.style.filter = 'none';
      } else {
        inpPass.type = 'password';
        btnToggle.style.filter = 'grayscale(1)';
      }
    });

    inpPass.addEventListener('input', () => {
      const val = inpPass.value;
      const num = /\d/.test(val);
      const sym = /[\W_]/.test(val);
      
      b1.style.background = 'var(--color-borde)';
      b2.style.background = 'var(--color-borde)';
      b3.style.background = 'var(--color-borde)';

      if(val.length === 0) {
        tFuerza.textContent = '';
      } else if(val.length < 8) {
        b1.style.background = 'var(--color-error)';
        tFuerza.textContent = 'Débil';
        tFuerza.style.color = 'var(--color-error)';
      } else if (val.length >= 8 && (!sym || !num)) {
        b1.style.background = 'var(--color-advertencia)';
        b2.style.background = 'var(--color-advertencia)';
        tFuerza.textContent = 'Media';
        tFuerza.style.color = 'var(--color-advertencia)';
      } else if (val.length >= 12 && sym && num) {
        b1.style.background = 'var(--color-exito)';
        b2.style.background = 'var(--color-exito)';
        b3.style.background = 'var(--color-exito)';
        tFuerza.textContent = 'Fuerte';
        tFuerza.style.color = 'var(--color-exito)';
      }
    });
  }

  function iniciarObserverProgresion() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
             const idNum = entry.target.id.split('-')[1]; // sec-1 -> 1
             activarPaso(idNum);
        }
      });
    }, { rootMargin: '-30% 0px -50% 0px' });

    document.querySelectorAll('fieldset').forEach(fs => observer.observe(fs));
  }

  function activarPaso(numeroActivo) {
    document.querySelectorAll('.paso').forEach((p, idx) => {
      p.classList.remove('activo', 'completado');
      const realNum = idx + 1;
      if (realNum < numeroActivo) p.classList.add('completado');
      else if (realNum == numeroActivo) p.classList.add('activo');
    });
  }

  function obtenerDatosFormulario() {
    const arrNiveles = ['', 'Principiante', 'Aprendiz', 'Intermedio', 'Avanzado', 'Experto'];
    return {
      nombre: document.getElementById('inp-nombre').value.trim(),
      apellido: document.getElementById('inp-apellido').value.trim(),
      fechaNacimiento: document.getElementById('inp-fecha').value,
      genero: document.querySelector('input[name="genero"]:checked')?.value || '',
      telefono: document.getElementById('inp-telefono').value.trim(),
      email: document.getElementById('inp-email').value.trim(),
      pais: document.getElementById('sel-pais').value,
      provincia: document.getElementById('inp-provincia').value.trim(),
      usuario: document.getElementById('inp-usuario').value.trim(),
      edad: document.getElementById('inp-edad').value,
      nivelExperiencia: document.getElementById('inp-nivel').value,
      rolPreferido: document.getElementById('sel-rol').value,
      intereses: Array.from(document.querySelectorAll('input[name="intereses"]:checked')).map(cb => cb.value),
      notificaciones: document.getElementById('chk-notificaciones').checked,
      bio: document.getElementById('inp-bio').value.trim(),
      foto: document.getElementById('inp-foto').value.trim(),
      fechaRegistro: new Date().toLocaleString('es-AR'),
      nivelTexto: arrNiveles[document.getElementById('inp-nivel').value]
    };
  }

  function procesarEnvio() {
    const erroresIds = window.Validador.validarFormulario();
    
    if (erroresIds.length > 0) {
        // Enfocar el primer error y scrollear a él
        const primerErrorId = erroresIds[0];
        let domElement = document.getElementById(primerErrorId);
        
        if (!domElement) { 
           // Caso fallback radio/checkbox
           if(primerErrorId === 'radio-genero') domElement = document.querySelector('.grupo-radios');
           if(primerErrorId === 'chk-intereses') domElement = document.getElementById('chk-intereses-wrapper');
        }

        if(domElement) {
           domElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
           // Evitamos foco en divs para no romper
           if(domElement.id !== '' && typeof domElement.focus === 'function') domElement.focus();
        }
        return;
    }

    // UX: Estado de Carga
    const btn = document.getElementById('btn-enviar');
    btn.classList.add('btn-cargando');
    
    const objDatos = obtenerDatosFormulario();
    cacheDatosAnteriores = objDatos;

    setTimeout(() => {
        btn.classList.remove('btn-cargando');
        window.Perfil.mostrar(objDatos);
    }, 800);
  }

  function limpiarTodo() {
    document.getElementById('formularioRegistro').reset();
    window.Validador.resetearValidacion();
    window.Perfil.ocultar();
    
    // Reset vivo ui manuales
    document.getElementById('valor-nivel-vivo').textContent = `Intermedio (3)`;
    document.getElementById('contadorBio').textContent = `0 / 300`;
    document.getElementById('previsualizacionFoto').classList.add('oculto');
    // Fuerza meter reset
    document.getElementById('barra-fuerza-1').style.background = 'var(--color-borde)';
    document.getElementById('barra-fuerza-2').style.background = 'var(--color-borde)';
    document.getElementById('barra-fuerza-3').style.background = 'var(--color-borde)';
    document.getElementById('texto-fuerza').textContent = '';

    mostrarToast('Formulario limpiado.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function repoblarFormulario() {
    if (!cacheDatosAnteriores) return;
    window.Perfil.ocultar();

    // El formulario persiste sus datos, perocomo UX limpia... repoblamos a voluntad por si limpiaron y apretaron volver.
    // Solo forzamos scroll.
    document.getElementById('sec-1').scrollIntoView({ behavior: 'smooth', block: 'start' });
    mostrarToast('Modo edición activado.');
  }

  function mostrarToast(mensaje) {
    const t = document.getElementById('toast');
    t.textContent = mensaje;
    t.classList.add('mostrar');
    setTimeout(() => { t.classList.remove('mostrar') }, 3000);
  }

  return { repoblarFormulario };
})();
