/**
 * auditoria.js
 * Encargado de capturar el log transaccional y redibujar el panel UI lateral en vivo.
 */

window.Auditoria = (function() {
    let _contador = 0;
    const panelDOM = document.getElementById('panelAuditoria');
    const badgeNumb = document.getElementById('contadorEventosBadge');

    function _iniciarBindings() {
        const btnLimpiar = document.getElementById('btnLimpiarLog');
        const btnExportar = document.getElementById('btnExportarLog');

        if(btnLimpiar) btnLimpiar.addEventListener('click', limpiarLog);
        if(btnExportar) btnExportar.addEventListener('click', _exportarPlano);
    }

    function _actualizarHeader() {
        if(badgeNumb) badgeNumb.innerText = `${_contador} evento(s) registrado(s)`;
    }

    /* =========================================================
       API PÚBLICA
       ========================================================= */

    function registrarCreacion(blueprint, elementoDOM) {
        _contador++;
        _actualizarHeader();
        
        const timestamp = new Date().toLocaleTimeString('es-AR');
        // Extraer atributos vigentes del elemento nativo puramente recién instanciado
        const hrefL = elementoDOM.getAttribute('href') || 'null';
        const targetL = elementoDOM.getAttribute('target') || 'null';
        const titleL = elementoDOM.getAttribute('title') || 'null';
        const classL = elementoDOM.getAttribute('class') || 'null';

        const estructuraInyectada = `
            <div class="entrada-auditoria log-creacion">
                <div class="log-hora">${timestamp}</div>
                <div class="log-titulo">🟢 CREADO</div>
                <div class="log-cuerpo mb-2">
                    <span class="key">Nodo:</span> <span>&nbsp;</span>
                    <span class="text-acento">&lt;a id="${blueprint.id}"&gt;</span>
                </div>
                <div class="log-cuerpo">
                    <span class="key">href</span><span>→</span><span class="text-blanco">${hrefL}</span>
                    <span class="key">target</span><span>→</span><span class="text-blanco">${targetL}</span>
                    <span class="key">title</span><span>→</span><span class="text-blanco">${titleL}</span>
                    <span class="key">class</span><span>→</span><span class="text-blanco">${classL}</span>
                </div>
            </div>
        `;
        
        // Push-down manual (Prepend en la vista superior)
        if(panelDOM) panelDOM.insertAdjacentHTML('afterbegin', estructuraInyectada);
    }

    function registrarMutacion(idNodo, atributo, valorAnterior, valorNuevo) {
        _contador++;
        _actualizarHeader();
        
        const timestamp = new Date().toLocaleTimeString('es-AR');

        const estructuraInyectada = `
            <div class="entrada-auditoria log-mutacion">
                <div class="log-hora">${timestamp}</div>
                <div class="log-titulo">🟡 MODIFICADO</div>
                <div class="log-cuerpo mb-2">
                    <span class="key">Nodo:</span> <span>&nbsp;</span>
                    <span class="text-acento">&lt;a id="${idNodo}"&gt;</span>
                </div>
                <div class="log-cuerpo mb-1">
                    <span class="key">atributo:</span><span>&nbsp;</span>
                    <span class="text-blanco">${atributo}</span>
                </div>
                <div class="log-cuerpo">
                    <span class="key">anterior:</span><span>&nbsp;</span>
                    <span class="valor-anterior">${valorAnterior}</span>
                </div>
                <div class="log-cuerpo">
                    <span class="key">nuevo:</span><span>&nbsp;</span>
                    <span class="valor-nuevo">${valorNuevo}</span>
                </div>
            </div>
        `;

        if(panelDOM) panelDOM.insertAdjacentHTML('afterbegin', estructuraInyectada);
    }

    function limpiarLog() {
        if(panelDOM) panelDOM.innerHTML = '';
        _contador = 0;
        _actualizarHeader();
    }

    function totalEventos() {
        return _contador;
    }

    function _exportarPlano() {
        if (_contador === 0) {
            alert("El registro está vacío. No hay nada que exportar.");
            return;
        }

        const ventanaNueva = window.open('', '_blank');
        ventanaNueva.document.write('<html><head><title>Exportación de Log (Proyecto 4)</title>');
        ventanaNueva.document.write('<style>body{font-family:monospace; white-space:pre-wrap; background:#111; color:#0f0; padding:20px;}</style>');
        ventanaNueva.document.write('</head><body>');
        
        ventanaNueva.document.write('==============================================\n');
        ventanaNueva.document.write('REPORTE TRANSSACIONAL: INSPECTOR Y MUTADOR DOM\n');
        ventanaNueva.document.write('==============================================\n\n');

        // Extraer texto ordenado cronológicamente (Invertimos la lógica visual de HTML)
        const bloques = Array.from(document.querySelectorAll('.entrada-auditoria')).reverse();
        
        bloques.forEach((bloque, index) => {
            const lines = bloque.innerText.split('\n').filter(r => r.trim() !== '');
            ventanaNueva.document.write(`[REGS #${index+1}] --------------------------------\n`);
            lines.forEach(l => ventanaNueva.document.write(`${l}\n`));
            ventanaNueva.document.write('\n');
        });

        ventanaNueva.document.write('</body></html>');
        ventanaNueva.document.close();
    }

    // Retorno API Expuesta
    return {
        _encender: _iniciarBindings,
        registrarCreacion,
        registrarMutacion,
        limpiarLog,
        totalEventos
    };

})();

// Bootstrap Inicial
document.addEventListener('DOMContentLoaded', () => {
    window.Auditoria._encender();
});
