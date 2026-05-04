document.addEventListener('DOMContentLoaded', () => {
  const contenedorLista = document.getElementById('lista-personas');
  const btnVistaLista = document.getElementById('btn-vista-lista');
  const btnVistaTarjetas = document.getElementById('btn-vista-tarjetas');
  
  // Stats Elements
  const statTotal = document.getElementById('stat-total');
  const statEdadPromedio = document.getElementById('stat-edad-promedio');
  const statGenero = document.getElementById('stat-genero');
  const statHijos = document.getElementById('stat-hijos');

  let modoVista = 'lista'; // 'lista' o 'tarjeta'

  // Listeners para cambiar vista
  btnVistaLista.addEventListener('click', () => {
    if (modoVista !== 'lista') {
      modoVista = 'lista';
      btnVistaLista.classList.add('active');
      btnVistaTarjetas.classList.remove('active');
      actualizarVista();
    }
  });

  btnVistaTarjetas.addEventListener('click', () => {
    if (modoVista !== 'tarjeta') {
      modoVista = 'tarjeta';
      btnVistaTarjetas.classList.add('active');
      btnVistaLista.classList.remove('active');
      actualizarVista();
    }
  });

  /**
   * Actualiza las estadísticas superiores basándose en los datos de LocalStorage
   * @param {Array} personas 
   */
  const actualizarEstadisticas = (personas) => {
    const total = personas.length;
    statTotal.textContent = total;

    if (total === 0) {
      statEdadPromedio.textContent = '0';
      statGenero.textContent = '0% / 0%';
      statHijos.textContent = '0%';
      return;
    }

    const sumaEdad = personas.reduce((acc, p) => acc + parseInt(p.edad, 10), 0);
    statEdadPromedio.textContent = Math.round(sumaEdad / total);

    const mascCount = personas.filter(p => p.sexo === 'Masculino').length;
    const femCount = personas.filter(p => p.sexo === 'Femenino').length;
    const mascPerc = Math.round((mascCount / total) * 100);
    const femPerc = Math.round((femCount / total) * 100);
    statGenero.textContent = `${mascPerc}% / ${femPerc}%`;

    const conHijos = personas.filter(p => p.tieneHijos).length;
    const hijosPerc = Math.round((conHijos / total) * 100);
    statHijos.textContent = `${hijosPerc}%`;
  };

  /**
   * Genera el HTML de estado vacío
   */
  const renderizarEmptyState = () => {
    contenedorLista.innerHTML = `
      <div class="empty-state animate-enter">
        <div class="fs-1 mb-3">🗂️</div>
        <h4 class="gov-title">No hay personas registradas</h4>
        <p>Complete el formulario para comenzar el registro.</p>
      </div>
    `;
  };

  /**
   * Obtiene la inicial del nombre y apellido para el avatar
   */
  const obtenerIniciales = (nombre, apellido) => {
    return `${nombre.charAt(0).toUpperCase()}${apellido.charAt(0).toUpperCase()}`;
  };

  /**
   * Renderiza los datos en formato de Tabla
   */
  const renderizarTabla = (personas) => {
    const trs = personas.map(p => `
      <tr class="animate-enter">
        <td class="fw-bold">${p.nombre} ${p.apellido}</td>
        <td>${p.documento}</td>
        <td>${p.edad} años</td>
        <td>${p.sexo}</td>
        <td>${p.estadoCivil}</td>
        <td>${p.mail}</td>
        <td>${p.tieneHijos ? `Sí (${p.cantidadHijos})` : 'No'}</td>
        <td class="text-center" id="accion-${p.documento}">
          <button class="btn-icon btn-iniciar-borrado" data-doc="${p.documento}" title="Eliminar Registro">🗑️</button>
        </td>
      </tr>
    `).join('');

    contenedorLista.innerHTML = `
      <div class="table-wrapper animate-enter">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Documento</th>
              <th>Edad</th>
              <th>Sexo</th>
              <th>Estado Civil</th>
              <th>Mail</th>
              <th>Hijos</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>${trs}</tbody>
        </table>
      </div>
    `;
  };

  /**
   * Renderiza los datos en formato Grid de Tarjetas
   */
  const renderizarTarjetas = (personas) => {
    const cards = personas.map(p => `
      <div class="persona-card animate-enter">
        <div class="card-header-flex">
          <div class="avatar">${obtenerIniciales(p.nombre, p.apellido)}</div>
          <div>
            <h5 class="card-title">${p.nombre} ${p.apellido}</h5>
            <p class="card-doc">DNI: ${p.documento}</p>
          </div>
        </div>
        <div class="data-grid">
          <div class="data-item"><span class="d-label">Edad</span><span class="d-value">${p.edad}</span></div>
          <div class="data-item"><span class="d-label">Sexo</span><span class="d-value">${p.sexo}</span></div>
          <div class="data-item"><span class="d-label">Est. Civil</span><span class="d-value">${p.estadoCivil}</span></div>
          <div class="data-item"><span class="d-label">Nacionalidad</span><span class="d-value">${p.nacionalidad}</span></div>
          <div class="data-item" style="grid-column: span 2;"><span class="d-label">Teléfono</span><span class="d-value">${p.telefono}</span></div>
          <div class="data-item" style="grid-column: span 2;"><span class="d-label">Mail</span><span class="d-value">${p.mail}</span></div>
          <div class="data-item" style="grid-column: span 2;"><span class="d-label">Hijos</span><span class="d-value">${p.tieneHijos ? `Sí (${p.cantidadHijos})` : 'No'}</span></div>
        </div>
        <div class="text-end pt-2 border-top" id="accion-${p.documento}">
          <button class="btn-icon btn-iniciar-borrado" data-doc="${p.documento}" title="Eliminar Registro">🗑️ Eliminar</button>
        </div>
      </div>
    `).join('');

    contenedorLista.innerHTML = `<div class="grid-tarjetas">${cards}</div>`;
  };

  /**
   * Bindea la lógica de eliminación con confirmación inline
   */
  const bindearEventosEliminar = () => {
    const botonesBorrar = document.querySelectorAll('.btn-iniciar-borrado');
    
    botonesBorrar.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const doc = e.currentTarget.getAttribute('data-doc');
        const contenedorAccion = document.getElementById(`accion-${doc}`);
        
        // Guardar el html original para restaurarlo si cancela
        const htmlOriginal = contenedorAccion.innerHTML;
        
        // Reemplazar el botón por la confirmación inline
        contenedorAccion.innerHTML = `
          <div class="confirm-delete animate-enter">
            <span>¿Confirmás?</span>
            <button class="btn-confirm-yes" data-doc="${doc}">Sí</button>
            <button class="btn-confirm-no">No</button>
          </div>
        `;

        // Evento Cancelar
        contenedorAccion.querySelector('.btn-confirm-no').addEventListener('click', () => {
          contenedorAccion.innerHTML = htmlOriginal;
          bindearEventosEliminar(); // Re-bind del boton original que acabamos de restaurar
        });

        // Evento Confirmar Sí
        contenedorAccion.querySelector('.btn-confirm-yes').addEventListener('click', (ev) => {
          const docAEliminar = ev.currentTarget.getAttribute('data-doc');
          window.Storage.eliminarPersona(docAEliminar);
          window.Notificaciones.mostrar('exito', 'Registro eliminado exitosamente.');
          actualizarVista();
        });
      });
    });
  };

  /**
   * Función principal que orquesta el renderizado total
   */
  const actualizarVista = () => {
    const personas = window.Storage.obtenerTodos();
    actualizarEstadisticas(personas);

    if (personas.length === 0) {
      renderizarEmptyState();
      return;
    }

    if (modoVista === 'lista') {
      renderizarTabla(personas);
    } else {
      renderizarTarjetas(personas);
    }

    bindearEventosEliminar();
  };

  // Bindear Limpiar Todo desde el navbar
  document.getElementById('btn-limpiar').addEventListener('click', () => {
    if (window.Storage.obtenerConteo() === 0) return;
    
    if (confirm('¿Estás completamente seguro de borrar todo el Almacén de Personas?')) {
      window.Storage.limpiarTodo();
      window.Notificaciones.mostrar('advertencia', 'Se limpió el almacén de datos por completo.');
      actualizarVista();
    }
  });

  window.Renderizado = {
    actualizarVista
  };

  // Inicializar renderizado en load
  actualizarVista();
});
