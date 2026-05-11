const Colector = (() => {
  // Estado privado: única fuente de la verdad
  let numerosIngresados = [];

  // Elementos del DOM cacheados
  const panelArray = document.getElementById('panelArray');
  const textoContador = document.getElementById('textoContador');
  const btnGuardar = document.getElementById('btnGuardar');
  const errorMensaje = document.getElementById('errorMensaje');
  const inputNumero = document.getElementById('inputNumero');

  /* Actualiza el texto del contador de elementos ingresados.*/
  const actualizarContador = () => {
    const cantidad = numerosIngresados.length;
    textoContador.textContent = `${cantidad} / 10–20 números ingresados`;
    
    // Cambiar de color si se alcanza el mínimo
    if (Validador.minimoAlcanzado(numerosIngresados)) {
      textoContador.classList.remove('text-secondary', 'text-danger');
      textoContador.classList.add('text-success');
    } else {
      textoContador.classList.remove('text-success', 'text-danger');
      textoContador.classList.add('text-secondary');
    }
    
    // Alerta al llegar al límite
    if (Validador.limiteAlcanzado(numerosIngresados)) {
      textoContador.classList.remove('text-success');
      textoContador.classList.add('text-danger', 'fw-bold');
    } else {
      textoContador.classList.remove('fw-bold');
    }
  };

  /** Habilita o deshabilita el botón de guardar basado en el mínimo.*/
  const actualizarEstadoBtnGuardar = () => {
    btnGuardar.disabled = !Validador.minimoAlcanzado(numerosIngresados);
  };

  /** Reconstruye los badges en el DOM basados en el array actual.*/
  const renderizarArray = () => {
    panelArray.innerHTML = '';

    if (numerosIngresados.length === 0) {
      panelArray.innerHTML = '<span class="text-muted d-block w-100 text-center py-4 empty-state">La colección está vacía. Empezá agregando un número.</span>';
      return;
    }

    numerosIngresados.forEach((numero, i) => {
      const badge = document.createElement('div');
      badge.className = 'number-badge';
      
      const spanIndex = document.createElement('span');
      spanIndex.className = 'badge-index';
      spanIndex.textContent = i + 1; // 1-based index
      
      const spanNumber = document.createElement('span');
      spanNumber.textContent = numero;
      
      const badgeActions = document.createElement('div');
      badgeActions.className = 'badge-actions';
      
      const btnEdit = document.createElement('button');
      btnEdit.className = 'btn-edit';
      btnEdit.innerHTML = '<i class="bi bi-pencil"></i>';
      btnEdit.setAttribute('aria-label', `Modificar el número ${numero}`);
      btnEdit.addEventListener('click', () => {
        modificarNumero(i);
      });

      const btnDismiss = document.createElement('button');
      btnDismiss.className = 'btn-dismiss';
      btnDismiss.innerHTML = '&times;';
      btnDismiss.setAttribute('aria-label', `Eliminar el número ${numero}`);
      btnDismiss.addEventListener('click', () => {
        eliminarNumero(i);
      });

      badgeActions.appendChild(btnEdit);
      badgeActions.appendChild(btnDismiss);

      badge.appendChild(spanIndex);
      badge.appendChild(spanNumber);
      badge.appendChild(badgeActions);
      
      panelArray.appendChild(badge);
    });
  };

  /** Intenta agregar un valor, validándolo previamente.*/
  const agregarNumero = (valorString) => {
    const validacion = Validador.validarEntrada(valorString, numerosIngresados);
    
    if (!validacion.esValido) {
      errorMensaje.textContent = validacion.mensaje;
      errorMensaje.style.display = 'block';
      return false;
    }

    // Agregar al estado
    numerosIngresados.push(Number(valorString));
    
    // Limpiar errores y UI
    errorMensaje.style.display = 'none';
    inputNumero.value = '';
    inputNumero.focus();

    // Actualizar Vistas
    renderizarArray();
    actualizarContador();
    actualizarEstadoBtnGuardar();
    
    return true;
  };

  /** Modifica un número existente en la misma posición, usando modal custom.*/
  const modificarNumero = (indice) => {
    const valorActual = numerosIngresados[indice];
    Modales.pedirValor(
      `Ingresá el nuevo valor para reemplazar el número ${valorActual}:`,
      valorActual,
      indice,
      (nuevoValorString) => {
        numerosIngresados[indice] = Number(nuevoValorString);
        renderizarArray();
        actualizarEstadoBtnGuardar();
      }
    );
  };

  /** Elimina un número por su índice, usando modal custom.*/
  const eliminarNumero = (indice) => {
    Modales.confirmar(
      `¿Estás seguro de que querés eliminar el número ${numerosIngresados[indice]}?`,
      () => {
        numerosIngresados.splice(indice, 1);
        renderizarArray();
        actualizarContador();
        actualizarEstadoBtnGuardar();
        errorMensaje.style.display = 'none';
        inputNumero.focus();
      }
    );
  };

  /** Borra toda la colección y resetea el estado a cero.*/
  const reiniciarColeccion = () => {
    numerosIngresados = [];
    errorMensaje.style.display = 'none';
    inputNumero.value = '';
    inputNumero.focus();
    
    renderizarArray();
    actualizarContador();
    actualizarEstadoBtnGuardar();
    
    // Ocultar alertas de resultado si las hay
    const areaMensaje = document.getElementById('areaMensaje');
    if (areaMensaje) areaMensaje.classList.add('d-none');
  };

  /*Permite obtener una copia del array actual*/
  const obtenerArray = () => {
    return [...numerosIngresados];
  };

  return {
    agregarNumero,
    eliminarNumero,
    reiniciarColeccion,
    obtenerArray
  };
})();
