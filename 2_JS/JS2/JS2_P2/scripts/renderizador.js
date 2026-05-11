const Renderizador = (() => {
  // Selectores DOM cacheados
  const seccionResultados = document.getElementById('seccionResultados');
  const statUtiles = document.getElementById('statUtiles');
  const statDescartados = document.getElementById('statDescartados');
  const statPorcentaje = document.getElementById('statPorcentaje');
  
  const panelAprobados = document.getElementById('panelAprobados');
  const panelDescartados = document.getElementById('panelDescartados');
  
  const fileError = document.getElementById('fileError');
  const areaMensaje = document.getElementById('areaMensaje');

  /** Renderiza un array de números en un contenedor especificado.*/
  const renderizarBadges = (array, contenedor, claseEstado, mensajeVacio) => {
    contenedor.innerHTML = '';

    if (array.length === 0) {
      contenedor.innerHTML = `<span class="text-muted fst-italic w-100 text-center py-3">${mensajeVacio}</span>`;
      return;
    }

    // Usar fragmento para mejor performance de renderizado
    const fragment = document.createDocumentFragment();

    array.forEach((num, index) => {
      const badge = document.createElement('div');
      badge.className = `number-badge ${claseEstado}`;
      
      const indexSpan = document.createElement('span');
      indexSpan.className = 'badge-index';
      indexSpan.textContent = `${index + 1}.`;

      const numSpan = document.createElement('span');
      numSpan.textContent = num;

      badge.appendChild(indexSpan);
      badge.appendChild(numSpan);
      fragment.appendChild(badge);
    });

    contenedor.appendChild(fragment);
  };

  /**Muestra las tarjetas de estadísticas.*/
  const renderizarEstadisticas = (estadisticas) => {
    statUtiles.textContent = estadisticas.totalAprobados;
    statDescartados.textContent = estadisticas.totalDescartados;
    statPorcentaje.textContent = `${estadisticas.porcentajeUtil}%`;
  };

  /**Dibuja los paneles principales (Aprobados y Descartados).*/
  const renderizarAprobados = (aprobados) => {
    renderizarBadges(
      aprobados, 
      panelAprobados, 
      'pass', 
      'No se encontró ningún número útil que cumpla la regla lógica en este archivo.'
    );
  };

  const renderizarDescartados = (descartados) => {
    renderizarBadges(
      descartados, 
      panelDescartados, 
      'fail', 
      'Todos los números cumplieron la regla lógica. ¡Excelente!'
    );
  };

  /**Muestra u oculta la sección completa de resultados con smooth scroll.*/
  const mostrarSeccionResultados = () => {
    seccionResultados.style.display = 'block';
    // Smooth scroll hacia la sección
    seccionResultados.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const ocultarSeccionResultados = () => {
    seccionResultados.style.display = 'none';
    areaMensaje.classList.add('d-none');
  };

  /**Manejo de mensajes de error de lectura.*/
  const mostrarError = (mensaje) => {
    fileError.textContent = mensaje;
    fileError.style.display = 'block';
  };

  const limpiarError = () => {
    fileError.textContent = '';
    fileError.style.display = 'none';
  };

  /**Muestra mensaje de estado de guardado.*/
  const mostrarEstadoGuardado = (mensaje, tipo) => {
    areaMensaje.textContent = mensaje;
    areaMensaje.className = `alert mt-2 mb-0 w-100 ${tipo === 'exito' ? 'alert-success' : 'alert-danger'}`;
    
    if (tipo === 'exito') {
      setTimeout(() => {
        areaMensaje.classList.add('d-none');
      }, 6000);
    }
  };

  return {
    renderizarEstadisticas,
    renderizarAprobados,
    renderizarDescartados,
    mostrarSeccionResultados,
    ocultarSeccionResultados,
    mostrarError,
    limpiarError,
    mostrarEstadoGuardado
  };
})();
