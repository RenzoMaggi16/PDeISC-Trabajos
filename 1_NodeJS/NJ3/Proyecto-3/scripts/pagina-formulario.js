/**
 * pagina-formulario.js
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
    const inputFocus = document.getElementById('campoFocus');
    const inputSelect = document.getElementById('campoSelect');
    const form = document.getElementById('formularioPrueba');

    // Mapeo Focus / Blur
    inputFocus.addEventListener('focus', () => anexarLog('focus: El campo ganó el cursor del usuario.', 'text-info'));
    inputFocus.addEventListener('blur', () => anexarLog('blur: El campo interactivo perdió el foco.', 'text-secundario'));

    // Mapeo Change
    inputSelect.addEventListener('change', (e) => {
        anexarLog(`change: Elección modificada a valor central "${e.target.value}".`, 'text-warning');
    });

    // Mapeo Submit interceptado
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // detención imperiosa
        anexarLog(`submit: El envío del formulario fue secuestrado impidiendo recargas de red.`, 'text-danger fw-bold');
    });
}
