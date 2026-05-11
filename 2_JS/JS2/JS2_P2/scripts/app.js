document.addEventListener('DOMContentLoaded', () => {
  // Estado global de la app
  let archivoActual = null;
  let aprobadosActual = [];
  let descartadosActual = [];
  let estadisticasActuales = null;

  // Elementos DOM
  const dropzone = document.getElementById('dropzone');
  const inputFile = document.getElementById('inputFile');
  const btnSeleccionar = document.getElementById('btnSeleccionar');
  
  const fileInfo = document.getElementById('fileInfo');
  const fileName = document.getElementById('fileName');
  const fileSize = document.getElementById('fileSize');
  const btnProcesar = document.getElementById('btnProcesar');
  
  const btnGuardar = document.getElementById('btnGuardar');

  // LÓGICA DE SELECCIÓN DE ARCHIVOS

  const validarYSetearArchivo = (file) => {
    Renderizador.limpiarError();
    Renderizador.ocultarSeccionResultados();
    
    if (!file) return;

    if (file.type !== 'text/plain' && !file.name.toLowerCase().endsWith('.txt')) {
      Renderizador.mostrarError('Por favor, selecciona un archivo de texto válido (.txt).');
      archivoActual = null;
      fileInfo.classList.replace('d-flex', 'd-none');
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
      Renderizador.mostrarError('El archivo excede el tamaño máximo permitido de 2MB.');
      archivoActual = null;
      fileInfo.classList.replace('d-flex', 'd-none');
      return;
    }

    archivoActual = file;
    fileName.textContent = file.name;
    
    // Formatear tamaño
    const sizeKB = (file.size / 1024).toFixed(1);
    fileSize.textContent = `(${sizeKB} KB)`;
    
    fileInfo.classList.replace('d-none', 'd-flex');
  };

  // Click en botón seleccionar
  btnSeleccionar.addEventListener('click', () => {
    inputFile.click();
  });

  // Cambio en el input de archivo
  inputFile.addEventListener('change', (e) => {
    validarYSetearArchivo(e.target.files[0]);
    // Resetear valor para permitir seleccionar el mismo archivo de nuevo si se necesita
    inputFile.value = '';
  });

  // LÓGICA DE DRAG & DROP

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
  });

  dropzone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validarYSetearArchivo(e.dataTransfer.files[0]);
    }
  });

  // LÓGICA DE PROCESAMIENTO

  btnProcesar.addEventListener('click', async () => {
    if (!archivoActual) return;
    
    Renderizador.limpiarError();
    const btnTextoOriginal = btnProcesar.innerHTML;
    btnProcesar.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Procesando...';
    btnProcesar.disabled = true;

    try {
      // 1. Leer archivo y extraer números (Lector)
      const data = await Lector.leerArchivoTxt(archivoActual);
      const numerosCrudos = data.numeros;

      // 2. Filtrar los números según la regla lógica (Filtrador)
      const particion = Filtrador.filtrarNumeros(numerosCrudos);
      
      // 3. Ordenar solo los aprobados ascendentemente
      aprobadosActual = Filtrador.ordenarAscendente(particion.aprobados);
      descartadosActual = particion.descartados; // Los descartados no necesitan orden riguroso según los specs

      // 4. Calcular Estadísticas
      estadisticasActuales = Filtrador.calcularEstadisticas(aprobadosActual, descartadosActual);

      // 5. Renderizar en el DOM (Renderizador)
      Renderizador.renderizarEstadisticas(estadisticasActuales);
      Renderizador.renderizarAprobados(aprobadosActual);
      Renderizador.renderizarDescartados(descartadosActual);
      
      // 6. Mostrar panel de resultados
      Renderizador.mostrarSeccionResultados();

    } catch (error) {
      Renderizador.mostrarError(error.message);
    } finally {
      btnProcesar.innerHTML = btnTextoOriginal;
      btnProcesar.disabled = false;
    }
  });

  // LÓGICA DE GUARDADO

  btnGuardar.addEventListener('click', async () => {
    if (!archivoActual || !estadisticasActuales) return;

    const btnTextoOriginal = btnGuardar.innerHTML;
    btnGuardar.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Guardando...';
    btnGuardar.disabled = true;

    const nombreOrigen = archivoActual.name;
    const resultado = await Exportador.guardarResultado(nombreOrigen, aprobadosActual, descartadosActual, estadisticasActuales);

    if (resultado.exito) {
      Renderizador.mostrarEstadoGuardado(`¡Guardado exitoso! Archivo guardado localmente y en el servidor (${resultado.ruta}).`, 'exito');
    } else {
      Renderizador.mostrarEstadoGuardado(`Error al guardar: ${resultado.error}`, 'error');
    }

    btnGuardar.innerHTML = btnTextoOriginal;
    btnGuardar.disabled = false;
  });

});
