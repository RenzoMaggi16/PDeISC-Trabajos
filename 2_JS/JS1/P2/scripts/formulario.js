document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-herramienta');
  const btnLimpiarTodo = document.getElementById('btn-limpiar-todo');
  
  // Reglas de validación centralizadas (sin atributos HTML5 de lógica)
  const REGLAS = {
    nombre: { validar: (v) => v.trim().length >= 2 && !/\d/.test(v), msg: "Mínimo 2 letras, sin números." },
    marca: { validar: (v) => v.trim().length >= 2, msg: "Requerido. Mínimo 2 caracteres." },
    categoria: { validar: (v) => v !== "", msg: "Debes seleccionar una categoría." },
    voltaje: { validar: (v) => v !== "", msg: "Debes seleccionar el voltaje." },
    precio: { validar: (v) => { const n = parseFloat(v); return !isNaN(n) && n > 0 && v.length <= 6 && /^\d+(\.\d+)?$/.test(v); }, msg: "Número positivo, máx 6 dígitos." },
    stock: { validar: (v) => { const n = parseInt(v, 10); return !isNaN(n) && n >= 0 && /^\d+$/.test(v); }, msg: "Debe ser un número entero positivo." },
    garantia: { validar: (v) => { const n = parseInt(v, 10); return !isNaN(n) && n >= 0 && n <= 120 && /^\d+$/.test(v); }, msg: "Meses entre 0 y 120." },
    descripcion: { validar: (v) => v.trim().length >= 10 && v.trim().length <= 200, msg: "Entre 10 y 200 caracteres." }
  };

  // Bloqueo de teclas en tiempo real
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('keydown', (e) => {
      // Ignorar teclas de control
      if (['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'].includes(e.key)) return;
      
      // Bloquear números en el nombre
      if (input.name === 'nombre' && /\d/.test(e.key)) {
        e.preventDefault();
      }
      
      // Bloquear letras en campos numéricos (precio permite punto)
      if (['precio', 'stock', 'garantia'].includes(input.name)) {
        if (input.name === 'precio' && e.key === '.') return; // Permitir un punto
        if (!/\d/.test(e.key)) {
          e.preventDefault();
        }
      }
    });

    // Validar en el evento blur (al salir del campo)
    input.addEventListener('blur', () => validarCampo(input));
    
    // Limpiar error al empezar a corregir
    input.addEventListener('input', () => limpiarError(input));
  });

  // Los select también se validan al cambiar
  form.querySelectorAll('select').forEach(select => {
    select.addEventListener('change', () => {
      validarCampo(select);
      limpiarError(select); // Remove error visually
    });
  });

  // Radios (Unidad de medida)
  const radiosUnidad = form.querySelectorAll('input[name="unidad"]');
  radiosUnidad.forEach(radio => {
    radio.addEventListener('change', () => {
      document.getElementById('error-unidad').style.visibility = 'hidden';
    });
  });

  // Manejador principal de la carga (Submit)
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevenir recarga de la página (SPA)
    
    let esValido = true;
    let primerError = null;

    // 1. Validar text, number, select y textarea
    Object.keys(REGLAS).forEach(name => {
      const element = form.elements[name];
      if (!validarCampo(element)) {
        esValido = false;
        if (!primerError) primerError = element;
      }
    });

    // 2. Validar Radios (Unidad)
    const unidadSeleccionada = Array.from(radiosUnidad).find(r => r.checked);
    if (!unidadSeleccionada) {
      esValido = false;
      document.getElementById('error-unidad').style.visibility = 'visible';
    }

    if (!esValido) {
      if (primerError) primerError.focus();
      return;
    }

    // 3. Extraer todos los valores válidos
    const nuevaHerramienta = {
      nombre: form.elements['nombre'].value.trim(),
      marca: form.elements['marca'].value.trim(),
      categoria: form.elements['categoria'].value,
      voltaje: form.elements['voltaje'].value,
      precio: parseFloat(form.elements['precio'].value),
      stock: parseInt(form.elements['stock'].value, 10),
      garantia: parseInt(form.elements['garantia'].value, 10),
      unidad: unidadSeleccionada.value,
      descripcion: form.elements['descripcion'].value.trim()
    };

    // 4. Guardar en los arrays (Lógica core separada)
    window.Almacenamiento.agregarElemento(nuevaHerramienta);

    // 5. Resetear UI y Form
    form.reset();
    form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
    
    // 6. Disparar renders
    window.Renderizado.actualizarVistas();
    window.Estadisticas.actualizarPanel();
  });

  // Listener global para el botón "Limpiar Todo" (Navbar)
  btnLimpiarTodo.addEventListener('click', () => {
    if(confirm('¿Estás seguro de eliminar todo el inventario? Esta acción no se puede deshacer.')) {
      window.Almacenamiento.limpiarTodo();
      window.Renderizado.actualizarVistas();
      window.Estadisticas.actualizarPanel();
    }
  });

  // Funciones Auxiliares de Validación
  function validarCampo(input) {
    const regla = REGLAS[input.name];
    if (!regla) return true;

    const divError = document.getElementById(`error-${input.name}`);
    if (regla.validar(input.value)) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      return true;
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      if (divError) divError.textContent = regla.msg;
      return false;
    }
  }

  function limpiarError(input) {
    if (input.classList.contains('is-invalid')) {
      input.classList.remove('is-invalid');
    }
  }
});
