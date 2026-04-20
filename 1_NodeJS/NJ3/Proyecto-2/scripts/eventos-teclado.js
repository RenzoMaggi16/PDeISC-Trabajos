/**
 * eventos-teclado.js
 * Rastreo profundo de identificadores binarios del teclado físico.
 */
document.addEventListener('DOMContentLoaded', () => {

    const campoTexto = document.getElementById('campoTexto');
    const valorTecla = document.getElementById('valorTecla');
    const infoCodigo = document.getElementById('infoCodigo');
    
    // Modificadores de estado en el display
    const modCtrl = document.getElementById('modCtrl');
    const modAlt = document.getElementById('modAlt');
    const modShift = document.getElementById('modShift');

    // Paneles informativos 
    const conteoCar = document.getElementById('conteoCar');
    const conteoPalabras = document.getElementById('conteoPalabras');
    const panelLog = document.getElementById('panelLog');
    const btnLimpiarLog = document.getElementById('btnLimpiarLog');
    const toastAtajo = document.getElementById('toastAtajo');

    // Core utilitario para inserción de reporte lineal
    function logearBucle(mensaje, advertencia = false) {
        const hm = new Date().toLocaleTimeString('es-ES') + `.` + String(new Date().getMilliseconds()).padStart(3,'0');
        const col = document.createElement('div');
        col.className = `entrada-log ${advertencia ? 'text-warning font-weight-bold' : ''}`;
        col.innerHTML = `<span class="hora-etiqueta">[${hm}]</span> ${mensaje}`;
        panelLog.appendChild(col);
        panelLog.scrollTop = panelLog.scrollHeight;
    }

    // Funciones de utilidad visual (Modificadores Hardware)
    function actualizarBotonesControl(e) {
        e.ctrlKey ? modCtrl.classList.add('activo') : modCtrl.classList.remove('activo');
        e.altKey ? modAlt.classList.add('activo') : modAlt.classList.remove('activo');
        e.shiftKey ? modShift.classList.add('activo') : modShift.classList.remove('activo');
    }

    function mostrarToast(mensaje) {
        toastAtajo.textContent = mensaje;
        toastAtajo.classList.add('mostrar');
        setTimeout(() => toastAtajo.classList.remove('mostrar'), 2500);
    }

    // --- DETECCIÓN DE EVENTOS ---

    // 1. Keydown: Cuando el contacto de hardware baja (fase penetración)
    campoTexto.addEventListener('keydown', (e) => {
        actualizarBotonesControl(e);

        // Actualizar pizarra grande
        valorTecla.textContent = e.key === ' ' ? 'Space' : e.key;
        infoCodigo.textContent = `Código nativo: ${e.code}`;
        valorTecla.classList.remove('text-opacity-50');

        // Atajos Maestros del usuario
        if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
            e.preventDefault(); // Impedimos que el navegador intente "Guardar Como..." página web
            mostrarToast("¡Guardado simulado con éxito (Ctrl+S)!");
            logearBucle(`keydown → INTERCEPCIÓN ATAJO: Guardar buffer disparado`, true);
        } else if (e.key === 'Escape') {
            campoTexto.value = '';
            // Forzar recálculo del input contador porque hemos vaciado programáticamente el value
            campoTexto.dispatchEvent(new Event('input'));
            mostrarToast("¡Lienzo formateado por Escape!");
            logearBucle(`keydown → INTERCEPCIÓN ATAJO: Escape vació el nodo origen`, true);
        } else {
            logearBucle(`keydown → contacto a '${e.key}' (código id: ${e.code})`);
        }
    });

    // 2. Keyup: Cuando la energía recede y regresa al estado 0 mecánico
    campoTexto.addEventListener('keyup', (e) => {
        actualizarBotonesControl(e);
        valorTecla.classList.add('text-opacity-50'); // Dimming de estado inactivo visual
        logearBucle(`keyup → pieza '${e.key}' ha sido liberada a su pin-switch natural`);
    });

    // 3. Keypress: Protocolo depreciado, educativo sobre retardo.
    campoTexto.addEventListener('keypress', (e) => {
        // Antaño usado paralectura final post-hardware combinatoria, hoy obsoleto y cancelado a futuro por el DOM standard.
        logearBucle(`keypress → carácter devuelto: '${e.key}' (protocolo de rastro obsoleto en el estándar)`, true);
    });

    // 4. Input: Esencial para la actualización real de data (inmune a mantener apretado 's' que genera infinitos keydown)
    // El 'input' detona cuando en realidad el campo sufre una mutación legítima
    campoTexto.addEventListener('input', () => {
        const cadena = campoTexto.value;
        const numLetras = cadena.length;
        
        // Expresión regular que evalúa cuántas cadenas unidas existen omitiendo espacios múltiples nulos
        const numPalabras = cadena.trim().split(/\s+/).filter(word => word.length > 0).length;

        conteoCar.textContent = numLetras;
        conteoPalabras.textContent = numPalabras;
    });

    // 5. Botón Reset System
    btnLimpiarLog.addEventListener('click', () => panelLog.innerHTML = '');

});
