document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-persona');
  if (!form) return;

  const radioHijosSi = document.getElementById('hijos-si');
  const radioHijosNo = document.getElementById('hijos-no');
  const contCantidadHijos = document.getElementById('contenedor-cantidad-hijos');
  const inputCantidadHijos = document.getElementById('cantidadHijos');

  // Lógica de toggle animado para Cantidad de Hijos
  const toggleHijos = () => {
    if (radioHijosSi.checked) {
      contCantidadHijos.classList.add('mostrar');
    } else {
      contCantidadHijos.classList.remove('mostrar');
      inputCantidadHijos.value = '';
      removerErrorVisual(inputCantidadHijos);
    }
    // Ocultar error del grupo de radio si lo había
    const errorHijos = document.getElementById('error-hijos');
    if (errorHijos) {
      errorHijos.style.visibility = 'hidden';
      errorHijos.style.opacity = '0';
    }
  };

  radioHijosSi.addEventListener('change', toggleHijos);
  radioHijosNo.addEventListener('change', toggleHijos);

  // Key Blocking en tiempo real
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('keydown', (e) => {
      // Ignorar teclas de control
      if (['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'].includes(e.key)) return;

      const name = input.name;

      // Bloquear dígitos en campos de texto
      if (['nombre', 'apellido', 'nacionalidad'].includes(name)) {
        if (/\d/.test(e.key)) e.preventDefault();
      }

      // Bloquear letras/espacios en campos numéricos y documento
      if (['edad', 'documento', 'cantidadHijos'].includes(name)) {
        if (!/\d/.test(e.key)) e.preventDefault();
      }

      // Teléfono: solo números y el símbolo +
      if (name === 'telefono') {
        if (!/\d/.test(e.key) && e.key !== '+') e.preventDefault();
      }
    });

    // Validar on blur
    input.addEventListener('blur', () => procesarValidacion(input));

    // Limpiar on input
    input.addEventListener('input', () => removerErrorVisual(input));
  });

  // Limpiar selects on change
  form.querySelectorAll('select').forEach(select => {
    select.addEventListener('change', () => {
      procesarValidacion(select);
      removerErrorVisual(select);
    });
  });

  // Radios de sexo
  form.querySelectorAll('input[name="sexo"]').forEach(r => {
    r.addEventListener('change', () => {
      const el = document.getElementById('error-sexo');
      if(el) {
        el.style.visibility = 'hidden';
        el.style.opacity = '0';
      }
    });
  });

  /* Helper para validar un input usando Validador puro e inyectar el error en el DOM*/
  const procesarValidacion = (element) => {
    // Si el elemento es cantidadHijos y NO está marcado Hijos=Sí, saltar validación
    if (element.name === 'cantidadHijos' && !radioHijosSi.checked) return true;

    const valRes = window.Validador.validarCampo(element.name, element.value);
    
    // Validación cruzada Edad vs FechaNacimiento en blur
    if (element.name === 'edad' || element.name === 'fechaNacimiento') {
      const edadVal = document.getElementById('edad').value;
      const fechaVal = document.getElementById('fechaNacimiento').value;
      
      // Solo validamos la cruzada si ambos campos tienen algo y pasaron su validacion individual
      if (edadVal && fechaVal && valRes.esValido && window.Validador.validarCampo(element.name === 'edad' ? 'fechaNacimiento' : 'edad', element.name === 'edad' ? fechaVal : edadVal).esValido) {
        const crossVal = window.Validador.validarEdadYFecha(edadVal, fechaVal);
        if (!crossVal.esValido) {
          mostrarErrorVisual(element, crossVal.mensaje);
          return false;
        }
      }
    }

    if (!valRes.esValido) {
      mostrarErrorVisual(element, valRes.mensaje);
      return false;
    } else {
      marcarValidoVisual(element);
      return true;
    }
  };

  const mostrarErrorVisual = (element, mensaje) => {
    element.classList.remove('is-valid');
    element.classList.add('is-invalid');
    const errDiv = document.getElementById(`error-${element.name}`);
    if (errDiv) {
      errDiv.textContent = mensaje;
      errDiv.style.visibility = 'visible';
      errDiv.style.opacity = '1';
    }
  };

  const removerErrorVisual = (element) => {
    element.classList.remove('is-invalid', 'is-valid');
    const errDiv = document.getElementById(`error-${element.name}`);
    if (errDiv) {
      errDiv.style.visibility = 'hidden';
      errDiv.style.opacity = '0';
    }
  };

  const marcarValidoVisual = (element) => {
    element.classList.remove('is-invalid');
    element.classList.add('is-valid');
    const errDiv = document.getElementById(`error-${element.name}`);
    if (errDiv) {
      errDiv.style.visibility = 'hidden';
      errDiv.style.opacity = '0';
    }
  };

  /* Submit del Formulario*/
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let formEsValido = true;
    let primerError = null;

    // 1. Validar todos los inputs normales (texto, numero, email, fecha) y selects
    const elementosAValidar = Array.from(form.elements).filter(el => 
      ['text', 'number', 'email', 'date', 'select-one'].includes(el.type) && el.name
    );

    elementosAValidar.forEach(el => {
      const isValid = procesarValidacion(el);
      if (!isValid) {
        formEsValido = false;
        if (!primerError) primerError = el;
      }
    });

    // 2. Validar Radios Sexo
    const sexoChecked = Array.from(form.elements['sexo']).find(r => r.checked);
    if (!sexoChecked) {
      formEsValido = false;
      const errDiv = document.getElementById('error-sexo');
      errDiv.textContent = "Debe seleccionar una opción.";
      errDiv.style.visibility = 'visible';
      errDiv.style.opacity = '1';
    }

    // 3. Validar Radios Hijos
    const hijosChecked = Array.from(form.elements['hijos']).find(r => r.checked);
    if (!hijosChecked) {
      formEsValido = false;
      const errDiv = document.getElementById('error-hijos');
      errDiv.textContent = "Indique si tiene hijos.";
      errDiv.style.visibility = 'visible';
      errDiv.style.opacity = '1';
    }

    if (!formEsValido) {
      window.Notificaciones.mostrar('error', 'Por favor corregí los campos marcados en rojo.');
      if (primerError) primerError.focus();
      return;
    }

    // 4. Validar Unicidad de Documento
    const docValue = form.elements['documento'].value.trim();
    if (window.Storage.existeDocumento(docValue)) {
      mostrarErrorVisual(form.elements['documento'], "Ya existe una persona registrada con ese número de documento.");
      window.Notificaciones.mostrar('error', 'Ya existe ese documento.');
      form.elements['documento'].focus();
      return;
    }

    // 5. Construir objeto persona
    const nuevaPersona = {
      nombre: form.elements['nombre'].value.trim(),
      apellido: form.elements['apellido'].value.trim(),
      edad: parseInt(form.elements['edad'].value, 10),
      fechaNacimiento: form.elements['fechaNacimiento'].value,
      sexo: sexoChecked.value,
      documento: docValue,
      estadoCivil: form.elements['estadoCivil'].value,
      nacionalidad: form.elements['nacionalidad'].value.trim(),
      telefono: form.elements['telefono'].value.trim(),
      mail: form.elements['mail'].value.trim(),
      tieneHijos: hijosChecked.value === 'Sí',
      cantidadHijos: hijosChecked.value === 'Sí' ? parseInt(form.elements['cantidadHijos'].value, 10) : null
    };

    // 6. Persistir en LocalStorage
    window.Storage.agregarPersona(nuevaPersona);

    // 7. Notificar, Resetear y Renderizar
    window.Notificaciones.mostrar('exito', 'Persona guardada correctamente.');
    
    form.reset();
    form.querySelectorAll('.is-valid, .is-invalid').forEach(el => el.classList.remove('is-valid', 'is-invalid'));
    toggleHijos(); // Asegura ocultar el campo de cantidad
    
    // Forzar scroll arriba opcional
    window.scrollTo({ top: 0, behavior: 'smooth' });

    window.Renderizado.actualizarVista();
  });
});
