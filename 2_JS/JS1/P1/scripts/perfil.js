const generarPerfil = (formElement) => {

  // 1. FormData API
  const formData = new FormData(formElement);
  const nombreUsuario = formData.get('nombre');
  const apellidoUsuario = formData.get('apellido');
  const estadoCivilUsuario = formData.get('estadoCivil');
  const direccionUsuario = formData.get('direccion');
  const trabajoUsuario = formData.get('trabajo');
  
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
          <span class="dato-label">Estado Civil</span>
          <span class="dato-valor">${estadoCivilUsuario}</span>
        </div>

        <div class="dato-fila">
          <span class="dato-label">Dirección</span>
          <span class="dato-valor">${direccionUsuario}</span>
        </div>

        <div class="dato-fila">
          <span class="dato-label">Trabajo/Ocup.</span>
          <span class="dato-valor">${trabajoUsuario}</span>
        </div>

        <div class="dato-fila">
          <span class="dato-label">Ingresos Declarados</span>
          <span class="dato-valor mono" style="color: #34d399;">${ingresosFormateados}</span>
        </div>
        
        <div class="mt-4 pt-3 border-top border-secondary">
          <button id="btn-confirmar" class="btn btn-primary btn-lg premium-btn w-100">Confirmar</button>
        </div>
      </div>
    </div>
  `;

  // Listener para confirmar y redirigir
  document.getElementById('btn-confirmar').addEventListener('click', () => {
    // 1. Mostrar mensaje de éxito
    resultadoDiv.innerHTML = `
      <div class="perfil-card mx-auto text-center py-5" style="max-width: 500px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px;">
        <div class="mb-4">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2 class="mb-3">¡Enviado correctamente!</h2>
        <p class="text-white-50">Serás redirigido al inicio en unos segundos...</p>
      </div>
    `;
    
    // 2. Redirigir a la landing page después de 3 segundos
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  });
};
