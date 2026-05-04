const generarPerfil = (formElement) => {

  // 1. FormData API
  const formData = new FormData(formElement);
  const nombreUsuario = formData.get('nombre');
  const apellidoUsuario = formData.get('apellido');
  
  // 2. Direct DOM Property Access
  const emailUsuario = document.getElementById('email').value;
  const celularUsuario = document.getElementById('celular').value;
  
  // 3. querySelector + .value
  const dniUsuario = document.querySelector('[name="dni"]').value;
  const ingresosUsuario = document.querySelector('[name="ingresos"]').value;
  const fechaNacUsuario = document.querySelector('[name="fechaNacimiento"]').value;

  // Ocultar formulario
  document.getElementById('tarjeta-formulario').classList.add('form-hidden');

  // Contenedor de resultado
  const resultadoDiv = document.getElementById('resultado');

  // Formatear ingresos a moneda (ej: $ 500.000)
  const ingresosFormateados = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(ingresosUsuario);

  // Inyectar HTML de la tarjeta de perfil
  resultadoDiv.innerHTML = `
    <div class="perfil-card mx-auto" style="max-width: 500px;">
      <div class="perfil-header">
        <h2 class="mb-1">Aprobación Previa</h2>
        <p>Cliente Premium Banco Elite</p>
      </div>
      <div class="perfil-body">
        
        <div class="dato-fila">
          <span class="dato-label">Titular</span>
          <span class="dato-valor">${nombreUsuario} ${apellidoUsuario}</span>
        </div>
        
        <div class="dato-fila">
          <span class="dato-label">Email de Contacto</span>
          <span class="dato-valor">${emailUsuario}</span>
        </div>
        
        <div class="dato-fila">
          <span class="dato-label">Celular</span>
          <span class="dato-valor">${celularUsuario}</span>
        </div>

        <div class="dato-fila">
          <span class="dato-label">Fecha Nac.</span>
          <span class="dato-valor">${fechaNacUsuario.split('-').reverse().join('/')}</span>
        </div>
        
        <div class="dato-fila">
          <span class="dato-label">DNI</span>
          <span class="dato-valor mono">${dniUsuario}</span>
        </div>
        
        <div class="dato-fila">
          <span class="dato-label">Ingresos Declarados</span>
          <span class="dato-valor mono" style="color: #34d399;">${ingresosFormateados}</span>
        </div>
        
        <div class="mt-4 pt-3 border-top border-secondary">
          <button id="btn-reset" class="btn-outline-light-premium">Cargar Nuevo Usuario</button>
        </div>
      </div>
    </div>
  `;

  // Listener para resetear el SPA
  document.getElementById('btn-reset').addEventListener('click', () => {
    // 1. Limpiar HTML del resultado
    resultadoDiv.innerHTML = '';
    
    // 2. Limpiar el formulario silenciosamente
    formElement.reset();
    
    // 3. Remover las clases de validación de todos los inputs
    const inputs = formElement.querySelectorAll('input');
    inputs.forEach(input => {
      input.classList.remove('is-valid', 'is-invalid');
    });

    // 4. Mostrar el formulario de nuevo
    document.getElementById('tarjeta-formulario').classList.remove('form-hidden');
  });
};
