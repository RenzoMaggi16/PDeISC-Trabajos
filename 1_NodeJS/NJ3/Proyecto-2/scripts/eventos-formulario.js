/**
 * eventos-formulario.js
 * Capturas masivas en tiempo real, focus control y simulación sintética de submit.
 */
document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('formularioRegistro');
    const inputs = document.querySelectorAll('.form-control, .form-select, .form-check-input');
    const panelLog = document.getElementById('panelLog');
    const btnLimpiarLog = document.getElementById('btnLimpiarLog');
    const exitoBanner = document.getElementById('alertaExito');

    const barraFuerza = document.getElementById('barraFuerzaClave');
    const btnTextoFuerza = document.getElementById('textoFuerzaClave');
    const inputClave = document.getElementById('inputClave');
    const inputNombre = document.getElementById('inputNombre');
    const spanContadorNombre = document.getElementById('conteoNom');

    // 1. Logger
    function registrar(mensaje, error = false) {
        const hm = new Date().toLocaleTimeString('es-ES') + '.' + new Date().getMilliseconds();
        const d = document.createElement('div');
        d.className = `entrada-log ${error ? 'destaque-evento fw-bold' : ''}`;
        d.innerHTML = `<span class="hora-etiqueta">[${hm}]</span> ${mensaje}`;
        panelLog.appendChild(d);
        panelLog.scrollTop = panelLog.scrollHeight;
    }

    // 2. Focus y Blur (A todos los inputs)
    inputs.forEach(campo => {
        // FOCUS: El cursor interactúa visualmente y el componente "despierta"
        campo.addEventListener('focus', () => {
            // Elemento hermano previo <label> debe colorearse si existe
            const etiquetaAsociada = campo.previousElementSibling;
            if (etiquetaAsociada && etiquetaAsociada.tagName === 'LABEL') {
                etiquetaAsociada.classList.add('label-enfocado');
            }
            registrar(`focus → Atractor en el campo '${campo.id}'`);
        });

        // BLUR: El usuario descarta el nodo o se marcha a otro frame 
        campo.addEventListener('blur', () => {
            const etiquetaAsociada = campo.previousElementSibling;
            if (etiquetaAsociada && etiquetaAsociada.tagName === 'LABEL') {
                etiquetaAsociada.classList.remove('label-enfocado');
            }

            // Validar la integridad del campo aislado asíncronamente
            validarCampo(campo);
            registrar(`blur → Descarte e inicio validación del subnodo base '${campo.id}'`);
        });
    });

    // 3. Validador Aislado (Injecta mensajes de texto bajo las clases de bootstrap si es falso)
    function validarCampo(campo) {
        // Encontrar error cercano con id
        let msgCajaError = campo.parentNode.querySelector('.msg-error');
        
        // Excepcion especificada visual checkbox/label position mismatch (Bootstrap specific)
        if(campo.id === 'checkCondiciones') {
            msgCajaError = document.getElementById('errorTerminos');
        }

        if(!campo.checkValidity()) {
            campo.classList.add('border-danger');
            if(msgCajaError) msgCajaError.style.display = 'block';
            return false;
        } else {
            campo.classList.remove('border-danger');
            if(msgCajaError) msgCajaError.style.display = 'none';
            return true;
        }
    }

    // 4. CHANGE events en inputs no estáticos (Selects y Checkboxes)
    const slPais = document.getElementById('selectPais');
    slPais.addEventListener('change', (e) => {
        registrar(`change → El bloque selector alteró la nación activa a: '${e.target.value}'`);
        validarCampo(slPais);
    });

    const ckConds = document.getElementById('checkCondiciones');
    ckConds.addEventListener('change', (e) => {
        registrar(`change → La caja booleana alteró su estado natural a: [${e.target.checked ? '✔ VERDADERO' : '❌ FALSO'}]`);
        validarCampo(ckConds);
    });

    // 5. INPUT events vivos
    // A) Contador nominal
    inputNombre.addEventListener('input', () => {
        spanContadorNombre.textContent = inputNombre.value.length;
        if(inputNombre.value.length > 50) inputNombre.value = inputNombre.value.substring(0, 50); // limitador duro
    });

    // B) Algoritmo de Criptografía visual del Password
    inputClave.addEventListener('input', () => {
        const val = inputClave.value;
        let pnts = 0;
        
        // Limpiamos estilos residuales estancados...
        barraFuerza.className = 'medidor-fuerza'; 
        btnTextoFuerza.className = 'texto-fuerza';

        if(val.length === 0) {
            btnTextoFuerza.textContent = 'Carencia absoluta de seguridad';
            return;
        }

        if(val.length >= 8) pnts++;
        if(/[0-9]/.test(val) && val.length >= 8) pnts++;
        if(/[^A-Za-z0-9]/.test(val) && val.length >= 12) pnts++; // Símbolos

        if(pnts === 0 || pnts === 1) {
            barraFuerza.classList.add('medidor-debil');
            btnTextoFuerza.classList.add('debil');
            btnTextoFuerza.textContent = 'Estado: Débil';
        } else if (pnts === 2) {
            barraFuerza.classList.add('medidor-media');
            btnTextoFuerza.classList.add('media');
            btnTextoFuerza.textContent = 'Estado: Tolerable / Medio';
        } else {
            barraFuerza.classList.add('medidor-fuerte');
            btnTextoFuerza.classList.add('fuerte');
            btnTextoFuerza.textContent = 'Estado: Fortaleza Robusta Acorazada';
        }
    });

    // 6. SUBMIT event (Interceptado para simular Front-end aislado)
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Corte total al reinicio de la ventana (Bloquear HTTP POST)
        
        let formularioValido = true;
        inputs.forEach(campo => {
            const campoPasado = validarCampo(campo);
            if(!campoPasado) {
                // Al fracasar añadimos animación Shake y borde rojo
                campo.classList.add('input-error');
                setTimeout(() => campo.classList.remove('input-error'), 400); // remover el clase en 400ms para permitirlo de nuevo
                formularioValido = false;
            }
        });

        if(formularioValido) {
            exitoBanner.classList.remove('d-none');
            form.style.pointerEvents = 'none'; // cerramos grifo 
            form.style.opacity = '0.5';
            registrar(`submit → SIMULACIÓN EXITOSA DEL REQUEST DEL FORMULARIO HACIA SERVER`, false);
        } else {
            exitoBanner.classList.add('d-none');
            registrar(`submit → PROCESAMIENTO RECHAZADO: Existen vulnerabilidades validadoras latentes y fallos rebotados`, true);
        }
    });

    // 7. EVENTO RESET
    form.addEventListener('reset', () => {
        // Al ocurrir reset native, las barras rebotan, el form retorna su UI normal...
        exitoBanner.classList.add('d-none');
        form.style.pointerEvents = 'auto';
        form.style.opacity = '1';
        
        // Quitar las advertencias visuales personalizadas que le agregué
        inputs.forEach(campo => {
            campo.classList.remove('border-danger', 'input-error');
            const errorDOM = campo.parentNode.querySelector('.msg-error');
            if(errorDOM) errorDOM.style.display = 'none';
        });
        document.getElementById('errorTerminos').style.display='none';

        spanContadorNombre.textContent = 0;
        barraFuerza.className = 'medidor-fuerza'; 
        btnTextoFuerza.className = 'texto-fuerza';
        btnTextoFuerza.textContent = 'Sistema Re-inicilizado';

        registrar(`reset → Limpieza general de la zona interactiva gatillada con éxito. Listo para nueva entrada bruta.`);
    });

    btnLimpiarLog.addEventListener('click', () => panelLog.innerHTML = '');

});
