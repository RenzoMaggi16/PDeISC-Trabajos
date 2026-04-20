/**
 * modificador.js
 * Expone la API programática y enlazadores a los botones de mutación para corromper
 * atributos de un elemento (nodo pre-renderizado).
 */

// =========================================================================
// MOTOR GENÉRICO DE MUTACIÓN (CORE)
// =========================================================================

/**
 * Modifica un atributo de un nodo existente y registra el cambio en la auditoría.
 * Usa setAttribute para atributos HTML y textContent para el texto visible.
 * @param {string} idNodo - Identificador único de memoria.
 * @param {string} atributo - string representativo 'href', 'class', etc.
 * @param {string} valorNuevo - El destino.
 * @param {HTMLButtonElement} btn - El botón visual del framework interactivo para apagarlo.
 */
function mutarAtributo(idNodo, atributo, valorNuevo, btn = null) {
    const elemento = window.nodosCreados[idNodo];
    
    if (!elemento) {
        console.warn(`[Modificador Error] Evitado mutación. El Nodo ${idNodo} no existe en memoria viva todavía.`);
        return;
    }

    // Calcular captura de valor antiguo previo al desastre
    let valorAnterior = 'null';
    if (atributo === 'textContent') {
        valorAnterior = elemento.textContent;
    } else {
        valorAnterior = elemento.getAttribute(atributo) || '';
    }

    // Intercepción si no hay un cambio material comprobable para evitar logs sucios fantasma
    if (valorAnterior === valorNuevo) {
        return;
    }

    // 1. Modificación Cruda en Memoria del DOM
    if (atributo === 'textContent') {
        elemento.textContent = valorNuevo;
    } else {
        // Enforce educational rule explícitamente!
        elemento.setAttribute(atributo, valorNuevo);
    }

    // 2. Refrescar tira base (Badges Meta) mandando un flag de highlight temporal amarillento
    window.actualizarMetadataCard(idNodo, atributo);

    // 3. Ejecutar Volcado Logístico al Panel
    window.Auditoria.registrarMutacion(idNodo, atributo, valorAnterior, valorNuevo);

    // 4. Bloqueo físico del botón emitente para prevenir ciclado duplicado
    if (btn) {
        btn.disabled = true;
        btn.classList.add('aplicado');
        // Cambiar icono textualmente y preservar etiqueta atributiva si existiese
        const tag = btn.querySelector('.tag-atributo');
        if(tag) {
            btn.innerHTML = `✓ Aplicado <span class="tag-atributo">${tag.innerText}</span>`;
        } else {
            btn.innerHTML = `✓ Aplicado`;
        }
    }
}

// =========================================================================
// ACCIONES ESPECÍFICAS PROGRAMADAS (Diccionario Funcional)
// =========================================================================

const ACCIONES_MUTADORAS = {
    // ---- GOOGLE ----
    btnMut_google_href: () => {
        const btn = document.getElementById('btnMut_google_href');
        mutarAtributo('enlace-google', 'href', 'https://www.google.com.ar', btn);
    },
    btnMut_google_target: () => {
        const btn = document.getElementById('btnMut_google_target');
        mutarAtributo('enlace-google', 'target', '_self', btn);
    },
    // ---- WIKI ----
    btnMut_wiki_href: () => {
        const btn = document.getElementById('btnMut_wiki_href');
        mutarAtributo('enlace-wiki', 'href', 'https://es.wikipedia.org', btn);
    },
    btnMut_wiki_text: () => {
        const btn = document.getElementById('btnMut_wiki_text');
        mutarAtributo('enlace-wiki', 'textContent', 'Wikipedia en Español', btn);
    },
    // ---- GITHUB ----
    btnMut_github_tooltip: () => {
        const btn = document.getElementById('btnMut_github_tooltip');
        mutarAtributo('enlace-github', 'title', 'Explorar código abierto', btn);
    },
    // ---- YOUTUBE ----
    btnMut_youtube_class: () => {
        const btn = document.getElementById('btnMut_youtube_class');
        mutarAtributo('enlace-youtube', 'class', 'nodo-video nodo-destacado', btn);
    },
    // ---- NOTICIAS ----
    btnMut_noticias_href: () => {
        const btn = document.getElementById('btnMut_noticias_href');
        mutarAtributo('enlace-noticias', 'href', 'https://www.infobae.com', btn);
    },
    btnMut_noticias_target: () => {
        const btn = document.getElementById('btnMut_noticias_target');
        mutarAtributo('enlace-noticias', 'target', '_blank', btn);
    }
};

// Vinculación en cadena
document.addEventListener('DOMContentLoaded', () => {
    Object.keys(ACCIONES_MUTADORAS).forEach(btnId => {
        const objB = document.getElementById(btnId);
        if(objB) objB.addEventListener('click', ACCIONES_MUTADORAS[btnId]);
    });
});

// =========================================================================
// APERTURA DE ZONAS MUTANTES (Comunicado x creador.js)
// =========================================================================

window.Modificador = {
    /**
     * Activa desde el estado bloqueado base a los botones pertenecientes a un cluster,
     * siempre y cuando éste acaba de ser instanciado en el tablero virtual.
     */
    actualizarBotonesModificacion: function(idNodoAsociado) {
        // Mapeo simple
        let botonesReleasy = [];

        if(idNodoAsociado === 'enlace-google') botonesReleasy = ['btnMut_google_href', 'btnMut_google_target'];
        if(idNodoAsociado === 'enlace-wiki') botonesReleasy = ['btnMut_wiki_href', 'btnMut_wiki_text'];
        if(idNodoAsociado === 'enlace-github') botonesReleasy = ['btnMut_github_tooltip'];
        if(idNodoAsociado === 'enlace-youtube') botonesReleasy = ['btnMut_youtube_class'];
        if(idNodoAsociado === 'enlace-noticias') botonesReleasy = ['btnMut_noticias_href', 'btnMut_noticias_target'];

        botonesReleasy.forEach(idBtn => {
            const b = document.getElementById(idBtn);
            if(b && !b.classList.contains('aplicado')) {
                // Quitamos el disabler, se iluminan a full CSS
                b.disabled = false;
            }
        });
    }
};
