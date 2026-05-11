const Modales = (() => {
  let modalConfirmInstance = null;
  let modalPromptInstance = null;

  const init = () => {
    if (!modalConfirmInstance) {
      const el = document.getElementById('confirmModal');
      if (el) modalConfirmInstance = new bootstrap.Modal(el);
    }
    if (!modalPromptInstance) {
      const el = document.getElementById('promptModal');
      if (el) modalPromptInstance = new bootstrap.Modal(el);
    }
  };

  /* Muestra un modal de confirmación. */

  const confirmar = (mensaje, callback) => {
    init();
    document.getElementById('confirmModalBody').textContent = mensaje;
    
    const btnConfirm = document.getElementById('confirmModalBtn');
    
    // Clonar para limpiar event listeners previos
    const nuevoBtn = btnConfirm.cloneNode(true);
    btnConfirm.parentNode.replaceChild(nuevoBtn, btnConfirm);
    
    nuevoBtn.addEventListener('click', () => {
      modalConfirmInstance.hide();
      callback();
    });
    
    modalConfirmInstance.show();
  };

  /* Muestra un modal para pedir un valor}*/
  const pedirValor = (mensaje, valorActual, indiceAExcluir, callbackExito) => {
    init();
    document.getElementById('promptModalBody').textContent = mensaje;
    
    const input = document.getElementById('promptModalInput');
    const errorMsg = document.getElementById('promptModalError');
    const btnGuardar = document.getElementById('promptModalBtn');
    
    input.value = valorActual;
    errorMsg.style.display = 'none';
    
    const nuevoBtn = btnGuardar.cloneNode(true);
    btnGuardar.parentNode.replaceChild(nuevoBtn, btnGuardar);
    
    nuevoBtn.addEventListener('click', () => {
      const nuevoValor = input.value;
      const validacion = Validador.validarEntrada(nuevoValor, Colector.obtenerArray(), indiceAExcluir);
      
      if (!validacion.esValido) {
        errorMsg.textContent = validacion.mensaje;
        errorMsg.style.display = 'block';
      } else {
        modalPromptInstance.hide();
        callbackExito(nuevoValor);
      }
    });

    // Limpiar error al tipear
    input.addEventListener('input', () => {
      errorMsg.style.display = 'none';
    });

    // Permitir Enter
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        nuevoBtn.click();
      }
    });
    
    modalPromptInstance.show();
    
    // Auto focus después de abrir
    document.getElementById('promptModal').addEventListener('shown.bs.modal', function onShow() {
      input.focus();
      document.getElementById('promptModal').removeEventListener('shown.bs.modal', onShow);
    });
  };

  return { confirmar, pedirValor };
})();
