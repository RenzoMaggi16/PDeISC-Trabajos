document.addEventListener('DOMContentLoaded', () => {
  let vistaActual = 'tabla'; // Puede ser 'tabla' o 'tarjeta'
  const contenedorItems = document.getElementById('lista-items');
  
  const btnVistaTabla = document.getElementById('btn-vista-tabla');
  const btnVistaTarjetas = document.getElementById('btn-vista-tarjetas');

  // Listeners para los botones de cambio de vista
  btnVistaTabla.addEventListener('click', () => {
    if (vistaActual !== 'tabla') {
      vistaActual = 'tabla';
      btnVistaTabla.classList.add('active');
      btnVistaTarjetas.classList.remove('active');
      window.Renderizado.actualizarVistas();
    }
  });

  btnVistaTarjetas.addEventListener('click', () => {
    if (vistaActual !== 'tarjeta') {
      vistaActual = 'tarjeta';
      btnVistaTarjetas.classList.add('active');
      btnVistaTabla.classList.remove('active');
      window.Renderizado.actualizarVistas();
    }
  });

  /* Reconstruye el HTML del DOM basado en la vista seleccionada.*/
  const actualizarVistas = () => {
    // Usamos el array histórico para ver los últimos agregados primero
    let items = window.Almacenamiento.obtenerHistorial();
    
    // 1. INTEGRACIÓN DE filter()
    const selectedCat = document.getElementById('meth-filter-sel').value;
    if (selectedCat) {
      // Filtrar usando el método filter() de almacenamiento y luego revertir para mantener el orden de historial
      items = window.Almacenamiento.filtrarPorCategoria(selectedCat).reverse();
    }

    if (items.length === 0) {
      renderizarEmptyState();
      return;
    }

    // 2. INTEGRACIÓN DE map()
    if (vistaActual === 'nombres') {
      // Si hay filtro aplicado, mapeamos sobre items, si no, usamos el método extraerCampo de almacenamiento
      const nombresAMostrar = selectedCat ? items.map(i => i.nombre) : window.Almacenamiento.extraerCampo('nombre').reverse();
      
      const listHtml = nombresAMostrar.map(n => `<li class="list-group-item py-3"><span class="fw-bold">🔹 ${n}</span></li>`).join('');
      contenedorItems.innerHTML = `
        <div class="card shadow-sm animate-entrance border-info">
          <div class="card-header bg-info text-white fw-bold">
            Vista Simplificada: Nombres de Herramientas (Generado con map)
          </div>
          <ul class="list-group list-group-flush">
            ${listHtml}
          </ul>
        </div>
      `;
      return; // Skip rendering table or cards
    }

    if (vistaActual === 'tabla') {
      renderizarTabla(items);
    } else {
      renderizarTarjetas(items);
    }

    // Bindear los botones de eliminar una vez generados en el DOM
    bindearBotonesEliminar();
  };

  const renderizarEmptyState = () => {
    contenedorItems.innerHTML = `
      <div class="empty-state animate-entrance">
        <div class="fs-1 mb-2">📦</div>
        <h5>No hay ítems registrados todavía</h5>
        <p class="text-muted">Completá el formulario para comenzar a construir tu inventario.</p>
      </div>
    `;
  };

  const renderizarTabla = (items) => {
    const almacenReference = window.Almacenamiento.obtenerTodos();

    let trs = items.map(item => {
      const idxReal = almacenReference.findIndex(x => x.id === item.id) + 1;
      const formatPrecio = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.precio);
      
      return `
        <tr class="animate-entrance">
          <td><span class="badge-index">#${idxReal}</span></td>
          <td class="fw-bold">${item.nombre}</td>
          <td>${item.marca}</td>
          <td><span class="badge bg-secondary text-light">${item.categoria}</span></td>
          <td class="mono-font fw-bold">${formatPrecio}</td>
          <td class="mono-font">${item.stock} ${item.unidad}(s)</td>
          <td>${item.voltaje}</td>
          <td>
            <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${item.id}">Borrar</button>
          </td>
        </tr>
      `;
    }).join('');

    contenedorItems.innerHTML = `
      <div class="table-container animate-entrance">
        <table class="table table-hover table-borderless">
          <thead>
            <tr>
              <th>ID</th>
              <th>Herramienta</th>
              <th>Marca</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Voltaje</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            ${trs}
          </tbody>
        </table>
      </div>
    `;
  };

  const renderizarTarjetas = (items) => {
    const almacenReference = window.Almacenamiento.obtenerTodos();
    
    let cards = items.map(item => {
      const idxReal = almacenReference.findIndex(x => x.id === item.id) + 1;
      const formatPrecio = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.precio);

      return `
        <div class="item-card animate-entrance">
          <div class="card-top">
            <span class="card-cat-badge">${item.categoria}</span>
            <h5>${item.nombre}</h5>
            <span class="card-brand">${item.marca} | ${item.voltaje}</span>
          </div>
          <div class="card-middle">
            <div class="data-row">
              <span class="data-label">Precio:</span>
              <span class="data-value" style="color: #F59E0B;">${formatPrecio}</span>
            </div>
            <div class="data-row">
              <span class="data-label">Inventario:</span>
              <span class="data-value">${item.stock} ${item.unidad}</span>
            </div>
            <div class="data-row">
              <span class="data-label">Garantía:</span>
              <span class="data-value">${item.garantia} meses</span>
            </div>
          </div>
          <div class="card-bottom">
            <span class="badge-index">Ítem #${idxReal}</span>
            <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${item.id}">Eliminar</button>
          </div>
        </div>
      `;
    }).join('');

    contenedorItems.innerHTML = `
      <div class="cards-grid">
        ${cards}
      </div>
    `;
  };

  const bindearBotonesEliminar = () => {
    const botones = document.querySelectorAll('.btn-delete');
    botones.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        window.Almacenamiento.eliminarElemento(id);
        actualizarVistas();
        window.Estadisticas.actualizarPanel();
      });
    });
  };

  /* ==========================================================================
     LÓGICA DE LA TOOLBAR INTEGRADA (MÉTODOS DE ARRAY)
     ========================================================================== */
  
  const poblarFiltrosMap = () => {
    // Populate filter dropdown with unique categories using map() and Set
    const items = window.Almacenamiento.obtenerTodos();
    const uniqueCats = [...new Set(items.map(item => item.categoria))];
    const selectFilter = document.getElementById('meth-filter-sel');
    
    const currentValue = selectFilter.value; // Keep selection
    selectFilter.innerHTML = '<option value="">Todas las categorías</option>';
    uniqueCats.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      if (cat === currentValue) opt.selected = true;
      selectFilter.appendChild(opt);
    });
  };

  // 1. FILTER: Actualizar la vista cuando cambia el select
  const selectFilter = document.getElementById('meth-filter-sel');
  selectFilter.addEventListener('change', () => {
    actualizarVistas();
  });

  // 2. MAP: Cambiar a la vista simplificada
  const btnNombresMap = document.getElementById('btn-nombres-map');
  btnNombresMap.addEventListener('click', () => {
    vistaActual = 'nombres';
    btnVistaTabla.classList.remove('active');
    btnVistaTarjetas.classList.remove('active');
    btnNombresMap.classList.add('active', 'text-white');
    actualizarVistas();
  });

  // Restaurar visualización de los otros botones
  [btnVistaTabla, btnVistaTarjetas].forEach(btn => {
    btn.addEventListener('click', () => {
      btnNombresMap.classList.remove('active', 'text-white');
    });
  });

  // 3. REDUCE: Mostrar total en el botón
  const btnTotalReduce = document.getElementById('btn-total-reduce');
  btnTotalReduce.addEventListener('click', () => {
    if (window.Almacenamiento.obtenerConteo() === 0) {
      alert("El inventario está vacío.");
      return;
    }
    
    // Utiliza el método reduce() de almacenamiento
    const total = window.Almacenamiento.calcularTotal();
    const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });
    
    const originalText = "Ver Total (reduce)";
    btnTotalReduce.textContent = `Total: ${formatter.format(total)}`;
    btnTotalReduce.classList.replace('btn-outline-success', 'btn-success');
    btnTotalReduce.classList.add('text-white');
    
    setTimeout(() => {
      btnTotalReduce.textContent = originalText;
      btnTotalReduce.classList.replace('btn-success', 'btn-outline-success');
      btnTotalReduce.classList.remove('text-white');
    }, 4000);
  });

  // Interceptar la actualización de vistas para poblar el dropdown dinámico
  const actualizarVistasConFiltros = () => {
    actualizarVistas();
    poblarFiltrosMap();
  };

  // Export to window so formulario.js can call it
  window.Renderizado = {
    actualizarVistas: actualizarVistasConFiltros
  };
});
