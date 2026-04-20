/**
 * eventos-tiempo.js
 * Demostraciones profundas del asincronismo e intervalos JS y Threads compartidos.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    const dLog = document.getElementById('panelLog');
    const limpiarT = document.getElementById('btnLimpiarLog');

    function consolaGeneral(texto) {
        const hh = new Date().toLocaleTimeString('es-ES');
        const mk = document.createElement('div');
        mk.className = 'entrada-log text-opacity-75';
        mk.innerHTML = `<span class="hora-etiqueta">[${hh}]</span> ${texto}`;
        dLog.appendChild(mk);
        dLog.scrollTop = dLog.scrollHeight;
    }

    limpiarT.addEventListener('click', () => dLog.innerHTML='');

    /* ========================================================
       DEMO A: CRONÓMETRO GLOBAL (setInterval estricto)
       ======================================================== */
    let hiloCrono = null;
    let deltaMilisegundos = 0; // Tiempo bruto

    const uiReloj = document.getElementById('relojCrono');
    const uBtnSt = document.getElementById('btnCronoAArrancar');
    const uBtnPs = document.getElementById('btnCronoPausar');
    const uBtnVt = document.getElementById('btnCronoVuelta');
    const uBtnRst = document.getElementById('btnCronoReiniciar');
    const listaTrcks = document.getElementById('registroVueltas');

    function renderizarEsfera() {
        // Cálculo algebraico plano para el reloj
        const mins = Math.floor(deltaMilisegundos / 60000);
        const secs = Math.floor((deltaMilisegundos % 60000) / 1000);
        const ms = Math.floor((deltaMilisegundos % 1000) / 10); // decenas de mili para UX suave

        uiReloj.textContent = `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}:${ms.toString().padStart(2,'0')}`;
    }

    uBtnSt.addEventListener('click', () => {
        // Prevenir dobles invocaciones sucias
        if(!hiloCrono) {
            hiloCrono = setInterval(() => {
                deltaMilisegundos += 10; // 10 milisec pasos de render base
                renderizarEsfera();
            }, 10); 
            
            // UI States
            uBtnSt.disabled = true;
            uBtnPs.disabled = false;
            uBtnVt.disabled = false;
            consolaGeneral(`Cronógrafo de núcleo (DEMO A) activado disparando Callbacks cada 10ms.`);
        }
    });

    uBtnPs.addEventListener('click', () => {
        clearInterval(hiloCrono);
        hiloCrono = null; // liberamos memoria
        
        uBtnSt.disabled = false;
        uBtnPs.disabled = true;
        uBtnVt.disabled = true;
        consolaGeneral(`Cronógrafo suspendido por la intervención de pausa.`);
    });

    uBtnVt.addEventListener('click', () => {
        const lti = document.createElement('li');
        const numVuelta = listaTrcks.children.length + 1;
        lti.innerHTML = `<span class="text-secondary fw-bold text-uppercase">T.${numVuelta}</span> <span class="text-light">${uiReloj.textContent}</span>`;
        listaTrcks.appendChild(lti);
        listaTrcks.scrollTop = listaTrcks.scrollHeight;
        consolaGeneral(`Track T.${numVuelta} anotado (Lapping simulado)`);
    });

    uBtnRst.addEventListener('click', () => {
        clearInterval(hiloCrono);
        hiloCrono = null;
        deltaMilisegundos = 0;
        renderizarEsfera();
        listaTrcks.innerHTML = '';
        
        uBtnSt.disabled = false;
        uBtnPs.disabled = true;
        uBtnVt.disabled = true;
        consolaGeneral(`Reset general aplicado. Borrado de memoria interna acumulada de los contadores.`);
    });


    /* ========================================================
       DEMO B: CUENTA REGRESIVA CON PREVENCIÓN (setTimeout Recursive)
       ======================================================== */
    const inpSegs = document.getElementById('inputSegundos');
    const uBtnReG = document.getElementById('btnComenzarRegresiva');
    const uHaloVisual = document.getElementById('anilloRegresiva');
    const msgToastFinal = document.getElementById('toastTiempo');
    let ticketRegresivaT = null; // Timer ID

    function ticRegresivoCadena(valorResidual) {
        if (valorResidual > 0) {
            uHaloVisual.textContent = valorResidual;
            
            // Encadenación recursiva con el setTimeOut asíncrono
            ticketRegresivaT = setTimeout(() => {
                ticRegresivoCadena(valorResidual - 1);
            }, 1000);
        } else {
            // FIN DE CUENTAK
            uHaloVisual.textContent = 0;
            // Desencadenar explosión css de alerta de estado
            uHaloVisual.classList.remove('corriendo');
            uHaloVisual.classList.add('animacion-pulso-rojo');
            
            msgToastFinal.classList.add('mostrar');
            setTimeout(() => { msgToastFinal.classList.remove('mostrar'); }, 5000);
            
            uBtnReG.disabled = false;
            inpSegs.disabled = false;
            
            consolaGeneral(`Recursividad setTimeout completada tras converger al CERO (0). Acción final detonada.`);
        }
    }

    uBtnReG.addEventListener('click', () => {
        let maxExt = parseInt(inpSegs.value);
        if(isNaN(maxExt) || maxExt < 5 || maxExt > 60) {
            maxExt = 10;
        }

        clearTimeout(ticketRegresivaT); // purga preventiva para asegurar un thread único
        uHaloVisual.classList.remove('animacion-pulso-rojo');
        uHaloVisual.classList.add('corriendo');
        
        uBtnReG.disabled = true;
        inpSegs.disabled = true;
        
        consolaGeneral(`Petición setTimeout encadenada iterativa iniciada para N=${maxExt}`);
        ticRegresivoCadena(maxExt);
    });


    /* ========================================================
       DEMO C: AUTO-GUARDADO PASIVO DE CAMBIOS
       ======================================================== */
    const textBaseD = document.getElementById('textoAutoGuardado');
    const sIdcStatus = document.getElementById('indicadorStatus');
    const lListaLogsG = document.getElementById('logGuardado');
    
    let cacheCadenaS = '';
    const intervaloAutoS = 5000; // 5 segs

    // Input tracker simple para levantar bandera de modificación de UI
    textBaseD.addEventListener('input', () => {
        sIdcStatus.className = 'indicador-guardado modificado';
        sIdcStatus.textContent = '* Datos Modificados...';
    });

    // Subproceso paralelo independiente (Heartbeat monitor)
    setInterval(() => {
        if(textBaseD.value !== cacheCadenaS) {
            // Existe divergencia entre el estado base y el actual: Debemos AUTOGUARDAR simulando POST DB
            
            cacheCadenaS = textBaseD.value; // Validando..
            
            const liR = document.createElement('li');
            liR.innerHTML = `<span class="text-secondary fw-bold text-uppercase">SYS_SAVE</span> <span class="text-light text-opacity-75">Resguardo seguro: ${new Date().toLocaleTimeString('es-ES')} ✓</span>`;
            lListaLogsG.appendChild(liR);
            lListaLogsG.scrollTop = lListaLogsG.scrollHeight;

            // Transição Exitosa Visual
            sIdcStatus.className = 'indicador-guardado exito';
            sIdcStatus.textContent = 'Guardado Nube ✓';
            
            consolaGeneral(`AutoGuardador detectó cambios (Diff positivo) -> Volcando paquete en log interno.`);
        } else {
            // No mutó
            if(sIdcStatus.textContent !== 'Guardado Nube ✓') {
                sIdcStatus.className = 'indicador-guardado';
                sIdcStatus.textContent = 'Sin cambios...';
            }
        }
    }, intervaloAutoS);

});
