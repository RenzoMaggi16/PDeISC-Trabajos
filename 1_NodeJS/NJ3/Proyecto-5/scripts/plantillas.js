/**
 * plantillas.js
 * Fábrica estática que devuelve puras cadenas de texto HTML (String literals).
 * NO inyectan nada directo al DOM.
 */

window.PLANTILLAS = {};

// Objeto 1: Tarjeta de perfil
window.PLANTILLAS.tarjeta = (nombre = 'Usuario Demo', rol = 'Desarrollador Web') => `
  <div class="obj-tarjeta">
    <div class="obj-tarjeta__avatar">
      <img src="https://i.pravatar.cc/80?u=${nombre.replace(/\s+/g, '')}" alt="Avatar de ${nombre}" />
    </div>
    <div class="obj-tarjeta__info">
      <h3>${nombre}</h3>
      <span class="obj-tarjeta__rol">${rol}</span>
    </div>
    <button class="obj-tarjeta__btn">Contactar</button>
  </div>
`;

// Objeto 2: Tabla de datos
window.PLANTILLAS.tabla = () => `
  <div class="obj-tabla">
    <h4>📊 Tabla de Ventas</h4>
    <table>
      <thead>
        <tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Total</th></tr>
      </thead>
      <tbody>
        <tr><td>Laptop</td><td>3</td><td>$800</td><td>$2.400</td></tr>
        <tr><td>Monitor</td><td>5</td><td>$350</td><td>$1.750</td></tr>
        <tr><td>Teclado</td><td>10</td><td>$60</td><td>$600</td></tr>
      </tbody>
      <tfoot>
        <tr><td colspan="3">Total general</td><td>$4.750</td></tr>
      </tfoot>
    </table>
  </div>
`;

// Objeto 4: Galería de imágenes
window.PLANTILLAS.galeria = () => `
  <div class="obj-galeria">
    <h4>🖼️ Galería de Imágenes</h4>
    <div class="obj-galeria__grid">
      <figure><img src="https://picsum.photos/seed/a1/160/120" alt="Foto 1" /><figcaption>Foto 1</figcaption></figure>
      <figure><img src="https://picsum.photos/seed/b2/160/120" alt="Foto 2" /><figcaption>Foto 2</figcaption></figure>
      <figure><img src="https://picsum.photos/seed/c3/160/120" alt="Foto 3" /><figcaption>Foto 3</figcaption></figure>
      <figure><img src="https://picsum.photos/seed/d4/160/120" alt="Foto 4" /><figcaption>Foto 4</figcaption></figure>
    </div>
  </div>
`;

// Objeto 5: Lista de tareas
window.PLANTILLAS.lista = () => `
  <div class="obj-lista">
    <h4>✅ Lista de Tareas</h4>
    <ul class="obj-lista__items">
      <li><input type="checkbox" checked disabled /> <span class="completada">Diseñar wireframes</span></li>
      <li><input type="checkbox" checked disabled /> <span class="completada">Configurar servidor Express</span></li>
      <li><input type="checkbox" /> <span>Implementar rutas API</span></li>
      <li><input type="checkbox" /> <span>Escribir pruebas unitarias</span></li>
      <li><input type="checkbox" /> <span>Desplegar en producción</span></li>
    </ul>
  </div>
`;

// Objeto 6: Alerta / notificación (Parametrizable múltiple)
window.PLANTILLAS.alerta = (tipo = 'info') => {
  const config = {
    info:        { icono: 'ℹ️', titulo: 'Información',  clase: 'alerta-info' },
    exito:       { icono: '✅', titulo: '¡Éxito!',       clase: 'alerta-exito' },
    advertencia: { icono: '⚠️', titulo: 'Advertencia',  clase: 'alerta-advertencia' },
    error:       { icono: '❌', titulo: 'Error',         clase: 'alerta-error' },
  };
  const { icono, titulo, clase } = config[tipo] || config.info;
  return `
  <div class="obj-alerta ${clase}">
    <span class="obj-alerta__icono">${icono}</span>
    <div class="obj-alerta__contenido">
      <strong>${titulo}</strong>
      <p>Este es un mensaje de tipo <em>${tipo}</em> generado dinámicamente con innerHTML.</p>
    </div>
    <button class="obj-alerta__cerrar" onclick="this.parentElement.remove(); window.Visor.actualizar(document.getElementById('zonaCanvas').innerHTML);">✕</button>
  </div>
  `;
};

// Objeto 7: Tarjeta de artículo de Blog
window.PLANTILLAS.articulo = () => `
  <article class="obj-articulo">
    <img class="obj-articulo__portada" src="https://picsum.photos/seed/blog${Date.now()}/400/180" alt="Portada del artículo" />
    <div class="obj-articulo__cuerpo">
      <span class="obj-articulo__categoria">Tecnología</span>
      <h3>El futuro del desarrollo web con Node.js</h3>
      <p>Descubrí cómo Node.js está transformando la forma en que construimos aplicaciones web modernas, desde APIs REST hasta aplicaciones en tiempo real.</p>
      <footer class="obj-articulo__pie">
        <span>👤 María García</span>
        <span>📅 ${new Date().toLocaleDateString('es-AR')}</span>
        <a href="#" onclick="return false;">Leer más →</a>
      </footer>
    </div>
  </article>
`;

// Objeto 8: Widget de estadísticas
window.PLANTILLAS.estadisticas = () => `
  <div class="obj-estadisticas">
    <h4>📈 Panel de Métricas</h4>
    <div class="obj-estadisticas__grid">
      <div class="metrica">
        <span class="metrica__icono">👥</span>
        <span class="metrica__valor">1.284</span>
        <span class="metrica__label">Usuarios activos</span>
        <span class="metrica__tendencia positiva">▲ 12%</span>
      </div>
      <div class="metrica">
        <span class="metrica__icono">🛒</span>
        <span class="metrica__valor">342</span>
        <span class="metrica__label">Ventas del mes</span>
        <span class="metrica__tendencia positiva">▲ 8%</span>
      </div>
      <div class="metrica">
        <span class="metrica__icono">⏱️</span>
        <span class="metrica__valor">2m 14s</span>
        <span class="metrica__label">Tiempo promedio</span>
        <span class="metrica__tendencia negativa">▼ 3%</span>
      </div>
      <div class="metrica">
        <span class="metrica__icono">⭐</span>
        <span class="metrica__valor">4.7</span>
        <span class="metrica__label">Satisfacción</span>
        <span class="metrica__tendencia positiva">▲ 0.2</span>
      </div>
    </div>
  </div>
`;
