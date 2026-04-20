/**
 * eventos-mouse.js
 * Módulo puro de interceptación de dispositivos analógicos y apuntadores.
 */
document.addEventListener('DOMContentLoaded', () => {

    // Referencias Principales
    const area = document.getElementById('areaDemo');
    const panelLog = document.getElementById('panelLog');
    const coordFlotante = document.getElementById('coordsFlotantes');
    const tooltipLocal = document.getElementById('tooltipLocal');
    const btnLimpiarLog = document.getElementById('btnLimpiarLog');

    // Función de utilidad: Imprimir rastro formato consola
    function registrarEvento(mensaje, esDestaque = false) {
        const marcaTiempo = new Date().toLocaleTimeString('es-ES', { hour12: false }) + '.' + String(new Date().getMilliseconds()).padStart(3, '0');
        const linea = document.createElement('div');
        linea.className = 'entrada-log';
        linea.innerHTML = `<span class="hora-etiqueta">[${marcaTiempo}]</span> <span class="${esDestaque ? 'destaque-evento fw-bold' : ''}">${mensaje}</span>`;
        panelLog.appendChild(linea);
        panelLog.scrollTop = panelLog.scrollHeight; // Auto-scroll
    }

    // 1. Mouse Enter (Cuando entra físicamente al perímetro)
    area.addEventListener('mouseenter', () => {
        area.classList.add('hover-activo');
        coordFlotante.classList.remove('d-none');
        registrarEvento('mouseenter → cursor ingresó al perímetro activo');
    });

    // 2. Mouse Leave (Cuando abandona el perímetro)
    area.addEventListener('mouseleave', () => {
        area.classList.remove('hover-activo');
        coordFlotante.classList.add('d-none');
        tooltipLocal.classList.add('d-none'); // Esconder el menú falso
        registrarEvento('mouseleave → cursor salió');
    });

    // 3. Mouse Move (Rastreo 1:1)
    area.addEventListener('mousemove', (e) => {
        // En un caso real evitamos registrar cada milímetro porque colapsa el CPU, pero es el requerimiento
        const rect = area.getBoundingClientRect();
        const posX = Math.round(e.clientX - rect.left);
        const posY = Math.round(e.clientY - rect.top);
        
        coordFlotante.textContent = `X: ${posX} | Y: ${posY}`;
        // Movemos el badge cerca del puntero
        coordFlotante.style.left = `${posX + 15}px`;
        coordFlotante.style.top = `${posY + 15}px`;

        // Solo registramos modularmente para no saturar 10.000 logs
        if (posX % 40 === 0 && posY % 40 === 0) {
            registrarEvento(`mousemove → X: ${posX}, Y: ${posY}`);
        }
    });

    // 4. Mouse Down (Presionar botón físico de mouse)
    area.addEventListener('mousedown', (e) => {
        area.classList.add('flash-activo');
        registrarEvento(`mousedown → botón ${e.button} incrustado contra el lienzo`, true);
    });

    // 5. Mouse Up (Liberar botón)
    area.addEventListener('mouseup', () => {
        area.classList.remove('flash-activo');
        // Hack para forzar que el classList CSS reinicie su animación si scipeamos rápido
        void area.offsetWidth; 
        registrarEvento('mouseup → gatillo liberado progresivamente');
    });

    // 6. Double Click (Misma coordenada rápida)
    area.addEventListener('dblclick', (e) => {
        const rect = area.getBoundingClientRect();
        const posX = e.clientX - rect.left;
        const posY = e.clientY - rect.top;

        // Inyectar visualmente una burbuja estéril
        const punto = document.createElement('div');
        punto.className = 'punto-doble-click';
        punto.style.left = `${posX}px`;
        punto.style.top = `${posY}px`;
        area.appendChild(punto);

        registrarEvento(`dblclick → punto creado físicamente en (${Math.round(posX)}, ${Math.round(posY)})`, true);
        
        // Auto-eliminar la basura del DOM tras 1 segundo
        setTimeout(() => punto.remove(), 1000);
    });

    // 7. Context Menu (Clic derecho de sistema / Opciones del navegador)
    area.addEventListener('contextmenu', (e) => {
        // Intercepta totalmente la conducta de llamada a opciones del S.O
        e.preventDefault(); 
        
        const rect = area.getBoundingClientRect();
        const posX = e.clientX - rect.left;
        const posY = e.clientY - rect.top;

        tooltipLocal.style.left = `${posX}px`;
        tooltipLocal.style.top = `${posY}px`;
        tooltipLocal.classList.remove('d-none');

        registrarEvento('contextmenu → invocación denegada, protegiendo con menú personalizado abstracto', true);
    });

    // Herramienta Base: Limpiar Consola
    btnLimpiarLog.addEventListener('click', () => {
        panelLog.innerHTML = '';
        registrarEvento('* Operador de sistema ejecutó purga de buffer *', true);
    });

});
