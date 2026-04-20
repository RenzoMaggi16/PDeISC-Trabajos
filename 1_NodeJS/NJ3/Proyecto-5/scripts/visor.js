/**
 * visor.js
 * Conversor Live-View para renderizar contenido DOM en una consola estructurada.
 * Realiza parser del texto usando Vanilla Regex sin invocar librerías extra.
 */

window.Visor = (function() {

    const DOM_VISOR = document.getElementById('visorCodigo');

    function actualizar(htmlCrudo) {
        if (!DOM_VISOR) return;

        // Limpiar retazos que puedan enjaular al parseo si hay placeholders base
        let htmlPuro = htmlCrudo.replace(/<div id="placeholderCanvas".*?<\/div>/s, '').trim();

        if (htmlPuro === '') {
            DOM_VISOR.innerHTML = `<div class="placeholder-codigo text-muted fst-italic">\n// El canvas está vacío. Inyectá un objeto para ver su innerHTML aquí.\n</div>`;
            return;
        }

        // Formateado tabulativo simple
        const textoPreformateado = formatear(htmlPuro);
        // RegEx de Sintaxis Highlighter Custom
        const htmlHighligeado = resaltarSintaxis(textoPreformateado);

        DOM_VISOR.innerHTML = htmlHighligeado;
    }

    /**
     * Aplica indentación visual simple asumiendo una cadena plana minificada.
     */
    function formatear(htmlStr) {
        let formato = '';
        let tab = 0;
        
        // Disipar espacios inútiles entrelazados entre tags
        const arrayStr = htmlStr.replace(/>\s+</g, '><').split(/(?=<)/g);

        arrayStr.forEach(element => {
            // Bajamos el Tabulante para tokens cerradores
            if (element.match(/^<\/\w/)) {
                tab -= 1;
            }
            
            // Reconstituimos strings armando indents
            formato += '  '.repeat(Math.max(tab, 0)) + element + '\n';
            
            // Subimos tabulador ante apertura (No auto-clausurador)
            if (element.match(/^<\w[^>]*[^\/]>.*$/) && !element.includes('</')) {
                tab += 1;
            }
        });

        return formato;
    }

    /**
     * Implementación RegEx Nativa para pintar clases
     */
    function resaltarSintaxis(texto) {
        // Escapar encuadre HTML para proteger de interpretaciones XSS y renderizado literal del navegador.
        let escapado = texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        // 1. Strings encapsulados en comillas ("...")
        escapado = escapado.replace(/&quot;(.*?)&quot;/g, '<span class="hl-valor-string">"$1"</span>');
        
        // 2. Colorear las etiquetas HTML base (incluyendo cierres) 
        escapado = escapado.replace(/&lt;([!\/a-zA-Z0-9-]+)/g, '&lt;<span class="hl-tag">$1</span>');
        
        // 3. Colorear Atributos (class=, id=)
        // Busca cualquier palabra sin espacios previa al `=`
        escapado = escapado.replace(/([a-zA-Z0-9-]+)=/g, '<span class="hl-atributo">$1</span>=');

        return escapado;
    }

    /**
     * Motor de copiado Clipboard API
     */
    function copiarAlPortapapeles() {
        const DOM_CANVAS = document.getElementById('zonaCanvas');
        if (!DOM_CANVAS) return;
        
        let targetCode = DOM_CANVAS.innerHTML.replace(/<div id="placeholderCanvas".*?<\/div>/s, '').trim();
        targetCode = formatear(targetCode);

        // Si está vacío real, no copiamos espacios ciegos.
        if (targetCode.length < 5) targetCode = "";

        navigator.clipboard.writeText(targetCode).then(() => {
            const btnCopiar = document.getElementById('btnCopiarCodigo');
            if(btnCopiar) {
                const prev = btnCopiar.innerText;
                btnCopiar.innerText = '¡Copiado! ✓';
                btnCopiar.classList.replace('btn-outline-info', 'btn-info');
                
                setTimeout(() => {
                    btnCopiar.innerText = '[Copiar]';
                    btnCopiar.classList.replace('btn-info', 'btn-outline-info');
                }, 1500);
            }
        });
    }

    /* Bind Externo Copiado Visual */
    document.addEventListener('DOMContentLoaded', () => {
        const mBtn = document.getElementById('btnCopiarCodigo');
        if(mBtn) mBtn.addEventListener('click', copiarAlPortapapeles);
    });

    return {
        actualizar
    };

})();
