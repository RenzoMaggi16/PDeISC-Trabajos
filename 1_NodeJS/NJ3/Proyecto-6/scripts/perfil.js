/**
 * perfil.js
 * Construye e inyecta dinámicamente la tarjeta de perfil usando los datos del formulario.
 */

window.Perfil = (() => {
  const contenedorPerfil = document.getElementById('contenedorPerfil');

  /**
   * Genera un hash string para asignar colores consistentes al avatar según username.
   */
  function generarColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  }

  /**
   * Genera iniciales desde Nombre y Apellido.
   */
  function obtenerIniciales(nombre, apellido) {
    const fn = nombre.trim()[0] || '';
    const ln = apellido.trim()[0] || '';
    return (fn + ln).toUpperCase();
  }

  /**
   * Determina cómo mostrará el valor - con un fallback "-" si viene vacío.
   */
  function valFormateado(valor) {
    return valor || '<span class="dato-vacio">—</span>';
  }

  /**
   * Genera el HTML para la tarjeta usando literales de plantilla.
   */
  function mostrar(datos) {
    // Definir Avatar
    let htmlAvatar = '';
    if (datos.foto && datos.foto.startsWith('http')) {
        htmlAvatar = `<img src="${datos.foto}" alt="Avatar de ${datos.nombre}" class="avatar-img" />`;
    } else {
        const bg = generarColor(datos.usuario);
        const iniciales = obtenerIniciales(datos.nombre, datos.apellido);
        htmlAvatar = `<div class="avatar-iniciales" style="background: linear-gradient(135deg, ${bg}, #333);">${iniciales}</div>`;
    }

    // Definir Estrellas de Experiencia (1 a 5)
    const nNivel = parseInt(datos.nivelExperiencia, 10);
    const estrellasStr = '⭐'.repeat(nNivel) + '☆'.repeat(5 - nNivel);

    // Definir Chips de intereses
    const chipsHtml = datos.intereses.length > 0 
      ? datos.intereses.map(i => `<span class="chip-interes">${i}</span>`).join('') 
      : '<span class="dato-vacio">Sin intereses declarados</span>';

    // Generación de Estructura Principal
    const htmlPerf = `
      <div class="perfil-card perfil-animado">
        
        <!-- Header Principal -->
        <header class="perfil-header">
          <div class="avatar-wrapper">${htmlAvatar}</div>
          <div class="perfil-info-principal">
            <h2>${datos.nombre} ${datos.apellido}</h2>
            <span class="perfil-usuario">@${datos.usuario}</span>
            <div class="perfil-rol-pais">${datos.rolPreferido} · ${datos.pais}</div>
            <span class="perfil-estrellas" title="${datos.nivelTexto}">${estrellasStr} ${datos.nivelTexto}</span>
          </div>
        </header>
        
        <!-- Sección 1 -->
        <section class="perfil-seccion">
          <h3 class="perfil-seccion-titulo">Información Personal</h3>
          <div class="fila-dato"><span class="dato-label">📅 Fecha nac.:</span><span class="dato-valor">${datos.fechaNacimiento}</span></div>
          <div class="fila-dato"><span class="dato-label">🎂 Edad req.:</span><span class="dato-valor">${datos.edad} años</span></div>
          <div class="fila-dato"><span class="dato-label">⚧ Género:</span><span class="dato-valor">${datos.genero}</span></div>
          <div class="fila-dato"><span class="dato-label">📱 Teléfono:</span><span class="dato-valor">${valFormateado(datos.telefono)}</span></div>
        </section>

        <!-- Sección 2 -->
        <section class="perfil-seccion">
          <h3 class="perfil-seccion-titulo">Contacto Adicional</h3>
          <div class="fila-dato"><span class="dato-label">✉️ Correo:</span><span class="dato-valor">${datos.email}</span></div>
          <div class="fila-dato"><span class="dato-label">🌍 País:</span><span class="dato-valor">${datos.pais}</span></div>
          <div class="fila-dato"><span class="dato-label">📍 Provincia:</span><span class="dato-valor">${valFormateado(datos.provincia)}</span></div>
        </section>

        <!-- Sección 3 -->
        <section class="perfil-seccion">
          <h3 class="perfil-seccion-titulo">Preferencias</h3>
          <div class="fila-dato" style="align-items: center;"><span class="dato-label">🏷️ Intereses:</span><div class="contenedor-chips">${chipsHtml}</div></div>
          <div class="fila-dato"><span class="dato-label">🔔 Avisos:</span><span class="dato-valor">${datos.notificaciones ? 'Activadas' : 'Desactivadas'}</span></div>
        </section>

        <!-- Sección 4 -->
        <section class="perfil-seccion">
          <h3 class="perfil-seccion-titulo">Biografía</h3>
          <div class="perfil-bio">
            ${datos.bio ? `"${datos.bio}"` : '<span class="dato-vacio">El usuario aún no ha escrito su biografía.</span>'}
          </div>
        </section>

        <!-- Footer Card -->
        <footer class="perfil-footer">
          <span>📅 Registrado el: ${datos.fechaRegistro}</span>
          <button class="btn-editar" onclick="window.FormularioOrquestador.repoblarFormulario()">✏️ Editar</button>
        </footer>

      </div>
    `;

    // Inyectar DOM e invadir pacíficamente el contenedor
    contenedorPerfil.innerHTML = htmlPerf;
    
    // Smooth scroll para enfocar el éxito
    setTimeout(() => {
      contenedorPerfil.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  /**
   * Destruye la tarjeta devolviendo al estado inicial de instrucción vacía.
   */
  function ocultar() {
    contenedorPerfil.innerHTML = `
      <div id="estadoVacio">
          <span class="icono-vacio">👤</span>
          <p>Completá el formulario para ver el perfil aquí.</p>
      </div>
    `;
  }

  return { mostrar, ocultar };
})();
