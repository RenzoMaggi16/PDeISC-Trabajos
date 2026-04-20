/**
 * pagina-ventana.js
 */

const _consola = document.getElementById('consolaSalida');

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
    const btnModo = document.getElementById('btnModoInspector');
    if (btnModo) {
        btnModo.addEventListener('click', () => {
            if (typeof alternarInspector === 'function') alternarInspector();
        });
    }
    inicializarDemos();
});

// ============================================================
// SECCIÓN 2: DEMOS DE EVENTOS (lógica de Proyecto 2)
// ============================================================

function inicializarDemos() {
    const dResize = document.getElementById('displayResize');
    const dScroll = document.getElementById('displayScroll');

    // Primera pinta
    dResize.innerText = `Ancho actual: ${window.innerWidth} px`;

    // Resize Event
    let cResize = 0;
    window.addEventListener('resize', () => {
        dResize.innerText = `Ancho actual: ${window.innerWidth} px`;
        cResize++;
        if (cResize % 15 === 0) {
            anexarLog(`resize global: Capturando ajuste en ${window.innerWidth}x${window.innerHeight}`, 'text-info');
        }
    });

    // Scroll Event
    let cScroll = 0;
    window.addEventListener('scroll', () => {
        let sc = Math.round(window.scrollY);
        dScroll.innerText = `Posición Y: ${sc} px`;
        cScroll++;
        if (cScroll % 30 === 0) {
            anexarLog(`scroll analítico: Eje Y rebasó barrera (${sc}px)`, 'text-warning');
        }
    });
}
