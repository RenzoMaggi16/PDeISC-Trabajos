/**
 * pagina-teclado.js
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
  
    // Iniciar
    inicializarDemos();
});

// ============================================================
// SECCIÓN 2: DEMOS DE EVENTOS (lógica de Proyecto 2)
// ============================================================

function inicializarDemos() {
    const inputRegular = document.getElementById('inputTeclas');
    const inputCombo = document.getElementById('inputCombo');

    inputRegular.addEventListener('keydown', (e) => {
        anexarLog(`keydown: Oprimiste -> "${e.key}" (Cód: ${e.code})`, 'text-info');
    });

    inputRegular.addEventListener('keyup', (e) => {
        anexarLog(`keyup: Soltaste -> "${e.key}"`, 'text-warning');
    });

    // Detectar Combinación
    inputCombo.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            anexarLog(`✨ ÉXITO: Combinación detectada explícitamente (Ctrl + Enter).`, 'text-primary fw-bold');
            inputCombo.value = ''; // Limpiar tras el existo
        } else {
            anexarLog(`Buscando combinación. Tecla leída: ${e.key}`, 'text-secundario');
        }
    });
}
