document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos del DOM
  const btnAgregar = document.getElementById('btnAgregar');
  const inputNumero = document.getElementById('inputNumero');
  const btnReiniciar = document.getElementById('btnReiniciar');
  const btnGuardar = document.getElementById('btnGuardar');
  const errorMensaje = document.getElementById('errorMensaje');
  const areaMensaje = document.getElementById('areaMensaje');

  //MANEJO DE EVENTOS DEL COLECTOR 
  
  // Agregar número por click en botón
  btnAgregar.addEventListener('click', () => {
    Colector.agregarNumero(inputNumero.value);
  });

  // Agregar número presionando Enter
  inputNumero.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevenir submit de formularios accidental si hubiera
      Colector.agregarNumero(inputNumero.value);
    }
  });

  // Ocultar mensaje de error cuando el usuario empieza a corregir
  inputNumero.addEventListener('input', () => {
    errorMensaje.style.display = 'none';
  });

  // Reiniciar colección
  btnReiniciar.addEventListener('click', () => {
    Modales.confirmar(
      "¿Estás seguro de que querés reiniciar la colección? Se perderán todos los números.",
      () => {
        Colector.reiniciarColeccion();
      }
    );
  });

  // Mostrar mensaje de feedback (Éxito o Error)
  const mostrarMensajeFeedback = (mensaje, esExito) => {
    areaMensaje.textContent = mensaje;
    areaMensaje.classList.remove('d-none', 'alert-success', 'alert-danger');
    areaMensaje.classList.add(esExito ? 'alert-success' : 'alert-danger');
    
    // Auto ocultar después de 5 segundos si es éxito
    if (esExito) {
      setTimeout(() => {
        areaMensaje.classList.add('d-none');
      }, 5000);
    }
  };

  // Guardar en servidor
  btnGuardar.addEventListener('click', async () => {
    const arrayActual = Colector.obtenerArray();
    
    // Deshabilitar botón durante el envío para evitar doble clic
    btnGuardar.disabled = true;
    const btnTextoOriginal = btnGuardar.innerHTML;
    btnGuardar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...';

    // Llamada al módulo exportador
    const resultado = await Exportador.guardarEnServidor(arrayActual);

    if (resultado.exito) {
      mostrarMensajeFeedback(`¡Guardado exitoso! Archivo creado en servidor y preparado para descarga local.`, true);
      // Opcional: Reiniciar la colección después de un guardado exitoso
      // Colector.reiniciarColeccion(); 
    } else {
      mostrarMensajeFeedback(`Error: ${resultado.error}`, false);
    }

    // Restaurar estado del botón
    btnGuardar.innerHTML = btnTextoOriginal;
    btnGuardar.disabled = false;
  });
});
