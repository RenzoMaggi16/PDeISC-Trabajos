/**
 * pagina-tiempo.js
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
    // Referencias Timeout
    const btnLanzar = document.getElementById('btnLanzar');
    const btnCancelar = document.getElementById('btnCancelar');
    
    // Referencias Interval
    const displayReloj = document.getElementById('displayReloj');
    const btnReloj = document.getElementById('btnToggleReloj');

    // 1. Lógica Timeout
    let temporizadorFugaz;

    btnLanzar.addEventListener('click', () => {
        anexarLog("Comenzando cuenta atrás (3000ms)...", "text-info");
        btnLanzar.disabled = true;
        btnCancelar.disabled = false;

        temporizadorFugaz = setTimeout(() => {
            anexarLog("¡IGNICIÓN! Temporizador disparado correctamente.", "text-acento fw-bold");
            alert("⏰ Tiempo superado: Alerta asíncrona demostrativa cumplida.");
            // Reset
            btnLanzar.disabled = false;
            btnCancelar.disabled = true;
        }, 3000);
    });

    btnCancelar.addEventListener('click', () => {
        clearTimeout(temporizadorFugaz);
        anexarLog("Abortado. Temporizador destruido prematuramente.", "text-danger");
        btnLanzar.disabled = false;
        btnCancelar.disabled = true;
    });

    // 2. Lógica Intervalo (Reloj continuo)
    let idIntervalo;
    let relojActivo = true;

    function pintarHora() {
        const d = new Date();
        displayReloj.innerText = d.toLocaleTimeString('es-ES');
    }

    // Pinta manual inicial paralela y encendido cíclico
    pintarHora();
    idIntervalo = setInterval(pintarHora, 1000);
    anexarLog("Reloj central encendido cíclicamente.", "text-success");

    btnReloj.addEventListener('click', () => {
        if (relojActivo) {
            clearInterval(idIntervalo);
            relojActivo = false;
            btnReloj.innerText = 'Reanudar Reloj';
            btnReloj.classList.replace('btn-warning', 'btn-success');
            anexarLog("Reloj pausado forzosamente.", "text-warning");
        } else {
            pintarHora(); // pintado rápido anti-lag
            idIntervalo = setInterval(pintarHora, 1000);
            relojActivo = true;
            btnReloj.innerText = 'Detener Reloj';
            btnReloj.classList.replace('btn-success', 'btn-warning');
            anexarLog("Reloj recuperado sin bloqueos secuenciales.", "text-secundario");
        }
    });
}
