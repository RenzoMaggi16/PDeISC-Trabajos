/**
 * pagina-mouse.js
 * Modulo local que inicializa el inspector en /mouse e incrusta la demostración de eventos.
 */

// Referencias visuales a los DOMs del cuerpo del Dashboard (Log)
const _consola = document.getElementById('consolaSalida');
const _btnLimpiarLog = document.getElementById('btnLimpiarConsola');

function anexarLog(mensaje, clase = 'text-white') {
    const p = document.createElement('p');
    p.className = clase;
    p.innerText = `> ${mensaje}`;
    _consola.appendChild(p);
    _consola.scrollTop = _consola.scrollHeight;
}

// ============================================================
// SECCIÓN 1: INICIALIZACIÓN DEL INSPECTOR
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Configurar el botón maestro de toggle del inspector (Core P3)
    const btnModo = document.getElementById('btnModoInspector');
    if (btnModo) {
        btnModo.addEventListener('click', () => {
            if (typeof alternarInspector === 'function') alternarInspector();
        });
    }
  
    // Inicializar los demos propios de esta página
    inicializarDemos();
});

// ============================================================
// SECCIÓN 2: DEMOS DE EVENTOS (lógica de Proyecto 2 Recompilada)
// ============================================================

function inicializarDemos() {
    const areaTrack = document.getElementById('areaTrack');
    const zonaClicks = document.getElementById('zonaClicks');
    const btnP = document.getElementById('btnPrimario');
    const btnS = document.getElementById('btnSecundario');

    _btnLimpiarLog.addEventListener('click', () => {
        _consola.innerHTML = '<p class="text-success">&gt; Consola limpia. Reanudando capturas.</p>';
    });

    // Eventos de Movimiento puro
    areaTrack.addEventListener('mouseenter', () => anexarLog('mouseenter: El cursor entró al bloque Área 1.', 'text-info'));
    areaTrack.addEventListener('mouseleave', () => anexarLog('mouseleave: El puntero ha salido fuera de la zona.', 'text-danger'));
    
    // Control de Frecuencia simple para el mousemove
    let cuenta = 0;
    areaTrack.addEventListener('mousemove', (e) => {
        // Reducir la contaminación del log escribiendo 1 de cada 20
        cuenta++;
        if (cuenta % 20 === 0) {
            anexarLog(`mousemove (Rate 20/1): Eje X: ${e.offsetX}, Eje Y: ${e.offsetY}`, 'text-secundario');
        }
    });

    // Clicks Dinámicos
    btnP.addEventListener('click', () => anexarLog('click regular: Disparado por botón primario.', 'text-primary'));
    btnS.addEventListener('dblclick', () => anexarLog('dblclick especial: Botón secundario superado.', 'text-warning'));
    
    zonaClicks.addEventListener('mousedown', (e) => {
        if(e.target === zonaClicks) {
            anexarLog('mousedown general: Clic apretado pero no soltado sobre el área madre.', 'text-acento');
        }
    });
}
