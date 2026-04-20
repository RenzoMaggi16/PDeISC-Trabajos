/**
 * inspector.js
 * CORE: Motor algorítmico global responsable de procesar la inspección del DOM.
 */

// Estado global transitorio del Inspector
let inspectorActivo = false;

// Referencias a los contenedores fijos UI
const panelInspector = document.getElementById('panelInspector');
const btnModo = document.getElementById('btnModoInspector');
const divAviso = document.getElementById('avisoInspectorActivo');
const contenidoPanel = document.getElementById('contenido-panel-inspector');

// =========================================================================
// API PRINCIPAL DEL INSPECTOR
// =========================================================================

/**
 * Invierte el estado transitorio del inspector y aplica side-effects.
 */
function alternarInspector() {
    if (inspectorActivo) {
        desactivarInspector();
    } else {
        activarInspector();
    }
}

/**
 * Activa el modo inspector en la página actual.
 * Modifica clases UI y engancha el listener bloqueante.
 */
function activarInspector() {
    inspectorActivo = true;
    
    // UI Updates
    document.body.classList.add('modo-inspector-activo');
    btnModo.classList.remove('btn-outline-info');
    btnModo.classList.add('btn-info', 'text-dark');
    btnModo.innerHTML = '✋ Desactivar Inspector';
    divAviso.style.display = 'block';
    
    // INTERCEPCIÓN VITAL:
    // Capturamos el clic global ANTES de su distribución hacia los elementos nativos.
    // Esto asegura que la lógica de inspección preempcione lógicas ajenas (P2 demos).
    document.addEventListener('click', manejarClickInspector, true);
    
    console.log("🔍 Inspector activado. Escuchando clics intermedios.");
}

/**
 * Desactiva el modo inspector y descarta el barrido del DOM.
 */
function desactivarInspector() {
    inspectorActivo = false;
    
    // UI Updates
    document.body.classList.remove('modo-inspector-activo');
    btnModo.classList.add('btn-outline-info');
    btnModo.classList.remove('btn-info', 'text-dark');
    btnModo.innerHTML = '🔍 Activar Inspector';
    divAviso.style.display = 'none';
    
    // Remover limpiezas y highlights residuales
    limpiarResaltados();
    resetearPanel();
    
    // SOLTAR INTERCEPCIÓN
    document.removeEventListener('click', manejarClickInspector, true);
    
    console.log("✋ Inspector desactivado. Restaurando curso natural.");
}

/**
 * Listener atado en la fase de captura del arbol.
 * @param {Event} evento el envoltorio del clic.
 */
function manejarClickInspector(evento) {
    // Evaluar barreras de bioseguridad / Autorrestricciones auto-implementadas:
    const objetivo = evento.target;
    
    // Excluir elementos fijos estructurales
    if (objetivo.closest('#panelInspector') || 
        objetivo.closest('#btnModoInspector') || 
        objetivo.closest('nav') ||
        objetivo.tagName === 'HTML' || 
        objetivo.tagName === 'BODY') {
        
        // No detener propagación a éstos para usar botones del sistema
        return; 
    }
    
    // Frenar la propagación subyacente para aislar las mecánicas pasadas
    evento.preventDefault();
    evento.stopPropagation();
    
    // Proceder a depurar y escanear el objetivo aislado
    inspeccionarElemento(objetivo);
}

/**
 * Analiza un elemento central (Padre) aislando a sus progenies directas.
 * Renderiza los nodos informando de sus conteos.
 * @param {HTMLElement} elemento Elemento clicado.
 */
function inspeccionarElemento(elemento) {
    try {
        limpiarResaltados(); // Destruir rastros del clic previo
        
        // Estilización local (Target vs Hijitos)
        resaltarNodos(elemento);
        
        // Renderización Panel Lateral
        actualizarPanel(elemento);
        
    } catch (error) {
        console.error("Fallo durante inspección analítica del DOM:", error);
        contenidoPanel.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Hubo un error del motor al inspeccionar este elemento de la memoria.<br>
                Motivo: ${error.message}
            </div>
        `;
    }
}

/**
 * Superpone las clases perimetrales necesarias sobre el Nodo y los Hijos (Inyectando un número).
 * @param {HTMLElement} elemento Centroide.
 */
function resaltarNodos(elemento) {
    // Tinte Primario al objetivo clicleado
    elemento.classList.add('nodo-seleccionado');
    
    // Iteración Array-like evaluando Hijos DOM strictos (Elements)
    const hijosElementos = elemento.children;
    for (let i = 0; i < hijosElementos.length; i++) {
        let hijo = hijosElementos[i];
        
        // Agregar delineado intermitente
        hijo.classList.add('nodo-hijo');
        
        // Inyectar el Span (badge) numérico al principio de cada nodo iterado
        let badge = document.createElement('span');
        badge.className = 'badge-hijo badge-temporal';
        badge.innerText = i + 1; // 1-indexación humana
        
        hijo.prepend(badge); // insertar temporalmente!
    }
}

/**
 * Barrido destructivo purificando las inyecciones de clases.
 */
function limpiarResaltados() {
    // Remover la clase principal
    document.querySelectorAll('.nodo-seleccionado').forEach(n => n.classList.remove('nodo-seleccionado'));
    
    // Remover clase secundaria
    document.querySelectorAll('.nodo-hijo').forEach(n => n.classList.remove('nodo-hijo'));
    
    // Remoción forzosa de inyecciones nodales de "Span"
    document.querySelectorAll('.badge-temporal').forEach(b => b.remove());
}

/**
 * Genera el identificador textual conciso (Eej. <div#id.clase>)
 * @param {HTMLElement} elemento 
 * @returns {String} string purificado
 */
function obtenerIdentificador(elemento) {
    let ide = `&lt;${elemento.tagName.toLowerCase()}`;
    if (elemento.id) ide += `<span class="text-info">#${elemento.id}</span>`;
    if (elemento.className && typeof elemento.className === 'string') {
        const clasesLimpias = elemento.className.replace(/nodo-seleccionado|nodo-hijo/g, '').trim();
        if (clasesLimpias !== '') ide += `<span class="text-warning">.${clasesLimpias.split(' ').join('.')}</span>`;
    }
    ide += `&gt;`;
    return ide;
}

/**
 * Reescribe la plantilla central estática dentro del panel lateral.
 * @param {HTMLElement} elemento Nodo objetivo.
 */
function actualizarPanel(elemento) {
    const identText = obtenerIdentificador(elemento);
    const totalChildNodes = elemento.childNodes.length;
    const arrayElements = elemento.children;
    const totalChildren = arrayElements.length;
    const textoComments = totalChildNodes - totalChildren; // Diferencial asumiendo mayormente texto/comentarios
    
    // Construir tabla descriptiva global
    let htmlSalida = `
        <div class="mb-3 pb-2 border-bottom border-secondary">
            <span class="text-secundario d-block mb-1">Elemento seleccionado:</span>
            <div class="texto-mono">${identText}</div>
        </div>
        
        <table class="table table-dark table-sm table-borderless mb-4 text-secundario text-end">
            <tbody>
                <tr>
                    <td class="text-start">Hijos totales (childNodes):</td>
                    <td class="fw-bold text-white">${totalChildNodes}</td>
                </tr>
                <tr>
                    <td class="text-start">Hijos elemento (children):</td>
                    <td class="fw-bold text-acento">${totalChildren}</td>
                </tr>
                <tr>
                    <td class="text-start">Nodos de texto/comentarios:</td>
                    <td class="fw-bold text-warning">${textoComments}</td>
                </tr>
            </tbody>
        </table>
    `;

    // Procesar la taxonomía o lista escalonada de hijos reales
    htmlSalida += `<span class="text-secundario d-block mb-2 border-bottom border-secondary pb-1">Lista de hijos elemento:</span>`;
    
    if (totalChildren === 0) {
        if (totalChildNodes > 0 && textoComments > 0) {
            htmlSalida += `<div class="text-warning small fst-italic">Tiene ${textoComments} nodo(s) de texto superficiales o comentarios, pero ningún contenedor elemento HTML hijo de ramificación estructural.</div>`;
        } else {
            htmlSalida += `<div class="text-secundario small fst-italic">Este elemento madre es completamente solitario, no tiene hijos directos.</div>`;
        }
    } else {
        htmlSalida += `<div class="list-group list-group-flush small bg-transparent">`;
        
        // Límite de lista estipulado
        const limiteMaximo = 10;
        const totalAMostrar = Math.min(totalChildren, limiteMaximo);
        
        for (let i = 0; i < totalAMostrar; i++) {
            let descId = obtenerIdentificador(arrayElements[i]);
            htmlSalida += `<div class="list-group-item bg-transparent text-white px-0 py-1 d-flex align-items-center border-secondary">
                            <span class="badge bg-danger me-2">${i+1}</span> 
                            <span class="texto-mono flex-grow-1">${descId}</span>
                          </div>`;
        }
        
        if (totalChildren > limiteMaximo) {
            const diferencia = totalChildren - limiteMaximo;
             htmlSalida += `<div class="list-group-item bg-transparent text-secundario text-center fw-bold fst-italic px-0 border-0 pt-2">
                            ... y ${diferencia} más
                          </div>`;
        }
        
        htmlSalida += `</div>`;
    }
    
    // Injectar
    contenidoPanel.innerHTML = htmlSalida;
}

/**
 * Limpia puramente el contenido del panel, dejandolo inactivo original.
 */
function resetearPanel() {
    contenidoPanel.innerHTML = `
        <div class="text-secundario fst-italic text-center py-4">
            Hacé clic en cualquier contenedor subyacente de la página para compilar e inspeccionar sus dependencias algorítmicas mediante nodos hijos.
        </div>
    `;
    limpiarResaltados();
}

// Expulsar a window si la página no importa moduladamente 
window.alternarInspector = alternarInspector;
window.resetearPanel = resetearPanel;
window.limpiarResaltados = limpiarResaltados;
