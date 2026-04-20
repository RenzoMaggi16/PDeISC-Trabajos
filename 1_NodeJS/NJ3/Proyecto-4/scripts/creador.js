/**
 * creador.js
 * Módulo de inyección DOM mediante APIs nativas (createElement + setAttribute).
 */

// Diccionario reactivo de nodos en memoria viva
window.nodosCreados = {};

document.addEventListener('DOMContentLoaded', () => {
    _renderizarBotonesCreacion();
});

function _renderizarBotonesCreacion() {
    const contenedor = document.getElementById('cajaCreacion');
    if(!contenedor) return;

    window.BLUEPRINTS_NODOS.forEach((bp, index) => {
        // Mapeo rudimentario de colores según blueprint para pintar botón (CSS class match)
        let sufijoClase = '';
        if(bp.id.includes('google')) sufijoClase = 'btn-google';
        if(bp.id.includes('wiki')) sufijoClase = 'btn-wiki';
        if(bp.id.includes('github')) sufijoClase = 'btn-github';
        if(bp.id.includes('youtube')) sufijoClase = 'btn-youtube';
        if(bp.id.includes('noticias')) sufijoClase = 'btn-noticia';

        const b = document.createElement('button');
        b.className = `btn btn-creador w-100 ${sufijoClase}`;
        b.id = `btnCrear_${bp.id}`;
        
        b.innerHTML = `
            <span class="icono-creador">${bp.icono}</span>
            <div>
                <span class="d-block fw-bold tag-etiqueta">Crear ${bp.texto}</span>
                <span class="d-block text-sutil fw-normal" style="font-size: 0.75rem">${bp.descripcion}</span>
            </div>
        `;
        
        // Listener Instanciador
        b.addEventListener('click', () => {
            _fabricarNodoVíaDOM(bp, b, sufijoClase);
        });

        contenedor.appendChild(b);
    });
}

/**
 * Motor puro de ensamblaje (Requisito didáctico estricto)
 */
function _fabricarNodoVíaDOM(blueprint, botonTrigger, claseIdentitaria) {
    
    // 1. Bloqueador de Duplicidad y Feedback visual de rechazo
    if (window.nodosCreados[blueprint.id] !== undefined) {
        console.warn(`[Creador] El enlace o nodo "${blueprint.id}" ya figura en memoria.`);
        
        const tarjetaExistente = document.getElementById(`wrapper_${blueprint.id}`);
        if(tarjetaExistente) {
            tarjetaExistente.classList.add('ya-existe');
            // remover clase al terminar animación
            setTimeout(() => tarjetaExistente.classList.remove('ya-existe'), 600);
        }
        
        // Opcional: Generar un peque log silencioso. (El prompt dice: show a message in the log)
        // Agregamos un log efímero al muro si la API de mutaciones lo tolera, o customizamos en alerta.
        alert(`⚠️ El nodo '${blueprint.texto}' ya fue creado y posicionado en el tablero.`);
        return;
    }

    // 2. Creación Nativa desde la Nada (createElement)
    const nuevoElementoA = document.createElement('a');

    // 3. Asignación Estricta de Atributos mediante setAttribute()
    // REGLA: Nunca hacer nuevoElementoA.href = ... ; la API debe exponer el método setAttribute.
    nuevoElementoA.setAttribute('id', blueprint.id);
    nuevoElementoA.setAttribute('href', blueprint.href);
    nuevoElementoA.setAttribute('target', blueprint.target);
    nuevoElementoA.setAttribute('title', blueprint.title);
    nuevoElementoA.setAttribute('class', blueprint.clase);
    
    // Inserción del texto vivo
    nuevoElementoA.textContent = blueprint.texto;

    // 4. Registrar en Almacén Virtual Global
    window.nodosCreados[blueprint.id] = nuevoElementoA;

    // 5. Encapsular en la Tarjeta UI del Tablero
    _colocarConstruccionEnVisor(blueprint, nuevoElementoA);

    // 6. Impactar el Estado Visual del Botón Constructor
    botonTrigger.classList.add('instanciado');
    const labelSpan = botonTrigger.querySelector('.tag-etiqueta');
    if(labelSpan) labelSpan.innerHTML = `✓ ${blueprint.texto} creado`;

    // 7. Acciones Post-ensamblaje
    window.Auditoria.registrarCreacion(blueprint, nuevoElementoA);
    
    // Informar a Modificador.js que despierte las consolas
    if (window.Modificador && typeof window.Modificador.actualizarBotonesModificacion === 'function') {
        window.Modificador.actualizarBotonesModificacion(blueprint.id);
    }
}

/**
 * Pinta y estructura la visualización rica del botón inyectado en la derecha.
 */
function _colocarConstruccionEnVisor(blueprint, elementoReal) {
    const contenedor = document.getElementById('tableroNodos');
    const ph = document.getElementById('placeholderTablero');
    
    // Purificar el placeholder de bienvenida
    if(ph) ph.remove();

    const wrapper = document.createElement('div');
    wrapper.id = `wrapper_${blueprint.id}`;
    wrapper.className = 'tarjeta-nodo w-100';

    wrapper.innerHTML = `
        <span class="etiqueta-card">ID: ${blueprint.id}</span>
        <div id="mount_${blueprint.id}" class="d-flex w-100 mb-2">
            <!-- Ancla insertada en fase posterior -->
        </div>
        <div class="metadata-strip" id="meta_${blueprint.id}">
            <!-- Badges renderizados dinámicamente -->
        </div>
    `;

    contenedor.appendChild(wrapper);

    // Inyectar el verdadero nodo <a> originado vía createElement()
    const mounthPoint = document.getElementById(`mount_${blueprint.id}`);
    mounthPoint.appendChild(elementoReal);

    // Inyectar etiquetas visuales (Badges Array)
    window.actualizarMetadataCard(blueprint.id);
}

/**
 * Lee el estado absoluto vigente de los atributos de un ancla anillado y dibuja su tira de metadata (Badges Módulos).
 * Exponemos esto hacia window para que el modificador lo use al recalcular las variables.
 */
window.actualizarMetadataCard = function(idNodo, atributoMutado = null) {
    const contenedorMetadatas = document.getElementById(`meta_${idNodo}`);
    if(!contenedorMetadatas) return;

    const nav = window.nodosCreados[idNodo];
    if(!nav) return;

    // Cosechar propiedades actuales (Usamos DOM Properties xq son accesos directos getAttribute / TextContent)
    const hrefA = nav.getAttribute('href') || 'null';
    const targetA = nav.getAttribute('target') || 'null';
    const titleA = nav.getAttribute('title') || 'null';
    const claseA = nav.getAttribute('class') || 'null';
    const textV = nav.textContent || 'null';

    contenedorMetadatas.innerHTML = `
        <span class="badge-atributo" id="bdg_${idNodo}_href"><strong>href:</strong> ${hrefA}</span>
        <span class="badge-atributo" id="bdg_${idNodo}_target"><strong>target:</strong> ${targetA}</span>
        <span class="badge-atributo" id="bdg_${idNodo}_title"><strong>title:</strong> ${titleA}</span>
        <span class="badge-atributo" id="bdg_${idNodo}_class"><strong>class:</strong> ${claseA}</span>
        <span class="badge-atributo" id="bdg_${idNodo}_textContent"><strong>texto:</strong> ${textV}</span>
    `;

    // Si pasamos la bandera de qué atributo fue la mutación, le ejecutamos el Flash!
    if(atributoMutado) {
        const bdgTriggered = document.getElementById(`bdg_${idNodo}_${atributoMutado}`);
        if(bdgTriggered) {
            // Eliminar reinicio de anim
            bdgTriggered.classList.remove('badge-actualizado');
            // Reflow rapido trampa 
            void bdgTriggered.offsetWidth; 
            bdgTriggered.classList.add('badge-actualizado');
        }
    }
};
