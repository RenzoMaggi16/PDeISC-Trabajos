/**
 * eventos-ventana.js
 * Manipulación contextual abstracta de todo el Document Object Model y la Ventana principal.
 */

// Global tracker temporal inicial para DOMContentLoaded
const marcadorTiempoInicial = performance.now();

document.addEventListener('DOMContentLoaded', () => {
    const miliTardados = (performance.now() - marcadorTiempoInicial).toFixed(2);
    
    const panelLog = document.getElementById('panelLog');
    const barraScroll = document.getElementById('barraProgresoScroll');
    const cAncho = document.getElementById('coordAncho');
    const cAlto = document.getElementById('coordAlto');
    const fabIrArriba = document.getElementById('fabIrArriba');
    const btnLimpiar = document.getElementById('btnLimpiarLog');

    function anotarEnConsola(msg, destacado = false) {
        if (!panelLog) return;
        const horaX = new Date().toLocaleTimeString('es-ES') + ' -';
        const contenedor = document.createElement('div');
        contenedor.className = `entrada-log ${destacado ? 'fw-bold' : ''}`;
        contenedor.innerHTML = `<span class="hora-etiqueta">${horaX}</span> <span class="${destacado?'destaque-evento':''}">${msg}</span>`;
        panelLog.appendChild(contenedor);
        panelLog.scrollTop = panelLog.scrollHeight;
    }

    anotarEnConsola(`DOMContentLoaded → El árbol fundamental (DOM DOMMainReady) tardó en procesarse exactamente ${miliTardados}ms`);

    // 1. EVENTO RESIZE (Cambio escalar de resolución en la ventana principal de navegador)
    function reflejarDimensiones() {
        const anc = window.innerWidth;
        const alt = window.innerHeight;
        if(cAncho && cAlto) {
            cAncho.textContent = anc;
            cAlto.textContent = alt;
        }
        anotarEnConsola(`resize → Recalibración detectada, la geometría actual mutó a: ${anc}x${alt}px`);
    }
    
    // Configuración base de inicio
    if(cAncho && cAlto) {
        cAncho.textContent = window.innerWidth;
        cAlto.textContent = window.innerHeight;
    }

    // Retardador (Debounce simulado) para evitar el espameo masivo del evento resize y estresar el cliente
    let ticketResize;
    window.addEventListener('resize', () => {
        clearTimeout(ticketResize);
        ticketResize = setTimeout(reflejarDimensiones, 300); // 300ms de gracia tras finalizar arrastre del usuario
    });

    // 2. EVENTO LOAD (Carga final asíncrona de recursos como imágenes y hojas CSS)
    window.addEventListener('load', () => {
        const loadAbsoluto = performance.now();
        anotarEnConsola(`load → La página (Archivos periféricos, multimedia) culminó su carga a los ${loadAbsoluto.toFixed(2)}ms`, true);
        
        const toastIntro = document.getElementById('toastLoad');
        if(toastIntro) {
            toastIntro.classList.add('mostrar');
            setTimeout(() => toastIntro.classList.remove('mostrar'), 3000); // Toast desaparece a los 3s
        }
    });

    // 3. EVENTO SCROLL (Movimiento del eje Y sobre el plano Document)
    window.addEventListener('scroll', () => {
        // Altura disponible desplazable (Toda la altura documento MENOS la porción visible viewport)
        const espacioHundidoVisual = document.documentElement.scrollTop || document.body.scrollTop;
        const alturaCalculable = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        let porcentajeAvanzado = 0;
        if(alturaCalculable > 0) {
            porcentajeAvanzado = (espacioHundidoVisual / alturaCalculable) * 100;
        }
        
        // Carga la barra CSS
        if(barraScroll) {
            barraScroll.style.width = porcentajeAvanzado.toFixed(1) + '%';
        }

        // Lógica del botón flotante
        if(espacioHundidoVisual > 200) {
            fabIrArriba.classList.add('visible');
        } else {
            fabIrArriba.classList.remove('visible');
        }

        // Solo logeo si pasamos rangos muy específicos (para no colapsar la bitácora)
        if(porcentajeAvanzado === 0 || porcentajeAvanzado === 100 || Math.round(porcentajeAvanzado) === 50) {
            anotarEnConsola(`scroll → Rueda movida. Perímetro vertical: ${Math.round(porcentajeAvanzado)}% recorrido.`);
            // Truco rápido temporal
        }
    });

    // Clickeo utilitario para volver arriba desde el FAB
    fabIrArriba.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 4. VISIBILITY CHANGE (Ocultamiento del tab o cambio a otro programa)
    document.addEventListener('visibilitychange', () => {
        const estadoCapa = document.hidden ? 'oculta (Render Pausado)' : 'visible (Foco reactivado)';
        anotarEnConsola(`visibilitychange → La pestaña ha cambiado su jerarquía matriz hacia: ${estadoCapa}`, true);
        // Podríamos hipotéticamente pausar consumo de vídeo aquí..
    });

    // 5. BEFORE UNLOAD (Navegador exige salir del tab actual o recargar F5)
    window.addEventListener('beforeunload', (e) => {
        // Ciertas políticas estrictas de Firefox/Chrome recientes obligan a poner preventDefault
        e.preventDefault(); 
        // string a e.returnValue dispara la confirmación general bloqueante del sistema operativo "Abandonar sitio"
        e.returnValue = 'La página encoló configuraciones. ¿Cerrar sesión inminente sin salvaguardar?'; 
    });

    btnLimpiar.addEventListener('click', () => {
        panelLog.innerHTML = '';
        anotarEnConsola(`Administrador activó el comando PurgarBuffer() en consola.`);
    });
});
