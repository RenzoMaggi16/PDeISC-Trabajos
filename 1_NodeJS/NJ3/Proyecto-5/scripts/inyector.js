/**
 * inyector.js
 * Módulo Orquestador Core del Proyecto 5.
 * Manipula la cadena estructural del DOM de forma cruda utilizando exclusivamente la API innerHTML.
 */

window.Inyector = (function() {
    
    // Modo de inyección actual: 'acumulacion' (+=) o 'reemplazo' (=)
    let modoActual = 'acumulacion';
    
    // Contador de objetos inyectados en la sesión actual
    let contadorInyecciones = 0;
    
    // Historial de inyecciones: array de meta-logs
    const historialInyecciones = [];
    
    // Nodos de Referencia
    const ZONA_CANVAS = document.getElementById('zonaCanvas');
    const PANEL_HISTORIAL = document.getElementById('panelHistorial');
    const CONTADOR = document.getElementById('contadorInyecciones');
    const PH_CANVAS = document.getElementById('placeholderCanvas');

    /* ==============================================================
       MOTOR DE INYECCIÓN DE HIPERTEXTO VÍA INNERHTML
       ============================================================== */
    
    function inyectar(nombrePlantilla, ...args) {
        
        // 1. Recolección estructural pre-diseñada estáticamente.
        const html = window.PLANTILLAS[nombrePlantilla](...args);
        
        // 2. Destrucción de Placeholders inicial si existen
        if (PH_CANVAS && !PH_CANVAS.classList.contains('oculto')) {
            PH_CANVAS.classList.add('oculto');
        }

        // 3. Evaluar Modo Direccional (Acumular vs Sustituir)
        if (modoActual === 'acumulacion') {
            // Inyección via innerHTML — método central de este proyecto
            ZONA_CANVAS.innerHTML += html;
        } else {
            // Inyección via innerHTML — método central de este proyecto
            ZONA_CANVAS.innerHTML = html;
        }

        // 4. Registrar Evento e Impactar Variables Globales
        contadorInyecciones++;
        
        historialInyecciones.push({
            plantilla:   nombrePlantilla,
            modo:        modoActual,
            timestamp:   new Date().toLocaleTimeString('es-AR')
        });

        // 5. Cadenas Reactivas Secundarias
        window.Visor.actualizar(ZONA_CANVAS.innerHTML);
        _actualizarContadorUI();
        _renderizarChipsHistorial();
    }

    /* ==============================================================
       TRANSICIÓN DE ESTADOS / MODOS
       ============================================================== */

    function alternarModo() {
        const d_BTN = document.getElementById('btnModo');
        const desc_TXT = document.getElementById('descModo');

        // Swap variables
        modoActual = (modoActual === 'acumulacion') ? 'reemplazo' : 'acumulacion';

        if (modoActual === 'reemplazo') {
            // CSS Botón Switch
            d_BTN.classList.replace('modo-acumulacion', 'modo-reemplazo');
            d_BTN.innerText = "Modo: Reemplazo (=)";
            // CSS Texto Alertivo
            desc_TXT.innerText = "⚠️ Cada inyección borrará el contenido anterior.";
            // Alerta Física visual en el Canvas
            ZONA_CANVAS.classList.add('is-reemplazo');
            
            // Re-mapeo Sub-labels en botonera (Se usa innerHTML por consistencia directiva)
            document.querySelectorAll('.modo-indicador').forEach(etiqueta => {
                etiqueta.innerHTML = 'innerHTML <code>=</code>';
            });
            // Re-mapeo visual contenedor envolvente para cambio cromático
            document.querySelectorAll('.btn-inyector').forEach(ctn => {
                ctn.classList.replace('state-acumulador', 'state-reemplazador');
                ctn.classList.add('state-reemplazador');
            });
        } 
        else {
            // Regreso al verde de Acumulación
            d_BTN.classList.replace('modo-reemplazo', 'modo-acumulacion');
            d_BTN.innerText = "Modo: Acumulación (+=)";
            desc_TXT.innerText = "Los nuevos objetos se agregan al contenido existente.";
            ZONA_CANVAS.classList.remove('is-reemplazo');
            
            document.querySelectorAll('.modo-indicador').forEach(etiqueta => {
                etiqueta.innerHTML = 'innerHTML <code>+=</code>';
            });
            document.querySelectorAll('.btn-inyector').forEach(ctn => {
                ctn.classList.replace('state-reemplazador', 'state-acumulador');
                ctn.classList.add('state-acumulador');
            });
        }
    }

    /* ==============================================================
       SANEAMIENTO GLOBAL (PURGA)
       ============================================================== */

    function limpiarCanvas() {
        // Enforce educational rule explicíta destructiva
        // Inyección via innerHTML — método central de este proyecto
        ZONA_CANVAS.innerHTML = '';
        
        // Reset Variables
        contadorInyecciones = 0;
        
        // Restaurar estado visual del fantasma originario.
        // Ojo: Lo recreamos crudo para obedecer la regla suprema de innerHTML.
        ZONA_CANVAS.innerHTML = `
            <div id="placeholderCanvas" class="placeholder-vacio">
                <span class="icono-gigante">🎨</span>
                <p class="fs-5 mb-1 text-claro">El canvas está vacío.</p>
                <p class="fst-italic opacity-75 m-0 text-sutil">Seleccioná un objeto del panel izquierdo para inyectarlo aquí con <code>innerHTML</code>.</p>
            </div>
        `;
        // Volvemos a asignarlo en memoria local actualizando la ref perdida
        window.PH_CANVAS = document.getElementById('placeholderCanvas');

        // Disparo reactivo al Visor para borrar los datos logeados
        window.Visor.actualizar('');
        _actualizarContadorUI();
    }

    function _limpiarHistorial() {
        historialInyecciones.length = 0;
        // Inyección via innerHTML — método central de este proyecto
        PANEL_HISTORIAL.innerHTML = '<span class="fst-italic text-muted px-2" style="font-size:0.8rem;">Sin operaciones realizadas...</span>';
    }

    /* ==============================================================
       RENDEREIZADOS UI TÁCTICOS
       ============================================================== */

    function _actualizarContadorUI() {
        if (CONTADOR) {
            CONTADOR.innerText = `${contadorInyecciones} objeto(s) inyectado(s)`;
            // Hard reset de clase flash para animar
            CONTADOR.classList.remove('badge-actualizado');
            void CONTADOR.offsetWidth;
            CONTADOR.classList.add('badge-actualizado');
        }
    }

    function _renderizarChipsHistorial() {
        // Obtenemos los últimos 10 de la cola.
        const ultimosDiez = historialInyecciones.slice(-10);
        
        // Creamos cadena HTML entera base (Inversión acumulativa en JS sin tocar DOM)
        let cadenaChips = '';
        
        ultimosDiez.forEach(op => {
            const sufijo = (op.modo === 'acumulacion') ? 'acu' : 'rem';
            const logModeStr = (op.modo === 'acumulacion') ? 'acumulación' : 'reemplazo';
            cadenaChips += `<span class="chip-inyeccion chip-${sufijo}">[${op.timestamp} · ${op.plantilla} · ${logModeStr}]</span>\n`;
        });
        
        // Inyección via innerHTML — método central de este proyecto
        PANEL_HISTORIAL.innerHTML = cadenaChips;
        
        // Auto scroll a derecha forzado
        PANEL_HISTORIAL.scrollLeft = PANEL_HISTORIAL.scrollWidth;
    }

    /* ==============================================================
       BINDINGS INICIALES EN DOM LOAD
       ============================================================== */

    function _init() {
        // Bind Botón Modo
        const bModo = document.getElementById('btnModo');
        if (bModo) bModo.addEventListener('click', alternarModo);

        // Bind Limpieza Hard (Doble Fase Confirmación)
        const btnPreClean = document.getElementById('btnLimpiarCanvas');
        const d_Cnf = document.getElementById('zonaConfirmacion');
        const b_Cnf = document.getElementById('btnConfirmarLimpieza');

        if (btnPreClean && d_Cnf && b_Cnf) {
            btnPreClean.addEventListener('click', () => d_Cnf.classList.remove('oculto'));
            b_Cnf.addEventListener('click', () => {
                d_Cnf.classList.add('oculto');
                limpiarCanvas();
            });
        }

        // Bind Limpiar Log Chips
        const btnA_cln = document.getElementById('btnLimpiarHistorial');
        if(btnA_cln) btnA_cln.addEventListener('click', _limpiarHistorial);

        // Asignación de clases iniciales state-acumulador
        document.querySelectorAll('.btn-inyector').forEach(ctn => ctn.classList.add('state-acumulador'));
    }

    // Encendido
    document.addEventListener('DOMContentLoaded', _init);

    // API EXPORTADA PUBLICA
    return {
        inyectar,
        alternarModo,
        limpiarCanvas,
        obtenerModo: () => modoActual
    };

})();
