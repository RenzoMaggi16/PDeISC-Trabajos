// La arquitectura se asegura esperar íntegramente a que el esqueleto HTML se estructure
document.addEventListener('DOMContentLoaded', () => {

    // 1. Estados de rastreo guardados a nivel de módulo (Variables)
    let h1Agregado = false;
    let imagenAgregada = false;
    let indiceColor = 0;
    let estadoTamanio = 0;
    let indiceImagen = 0;

    // 2. Matrices (Arrays) requeridos para el ciclado de contenidos
    const coloresAcento = ['#6366f1', '#ec4899', '#10b981', '#f59e0b']; // Índigo, Rosa, Esmeralda, Ámbar
    const identificadoresPicsum = ['13', '24', '35', '42']; // Semillas ID diferenciadas en Picsum
    const escalasResolucionPx = ['150px', '300px', '500px']; // Umbrales: Pequeño, mediano, grande

    // 3. Captura global de los contenedores estáticos y de alerta
    const areaVisualizacion = document.getElementById('areaVisualizacion');
    const barraEstado = document.getElementById('barraEstado');
    
    // Captura global de los componentes de interacción
    const botonAgregaH1 = document.getElementById('btnAgregarH1');
    const botonCambiaTexto = document.getElementById('btnCambiarTexto');
    const botonCambiaColor = document.getElementById('btnCambiarColor');
    
    const botonAgregaImagen = document.getElementById('btnAgregarImagen');
    const botonCambiaImagen = document.getElementById('btnCambiarImagen');
    const botonCambiaTamanio = document.getElementById('btnCambiarTamanio');

    // 4. Funciones semánticas lógicas
    
    // Inyecta el título H1 inicial en la pantalla si no existe
    function agregarH1() {
        if (!h1Agregado) {
            const h1Nuevo = document.createElement('h1');
            h1Nuevo.id = 'textoInteractuable';
            h1Nuevo.textContent = 'Hola DOM';
            h1Nuevo.style.color = '#ffffff'; 
            
            areaVisualizacion.appendChild(h1Nuevo);
            
            h1Agregado = true;
            actualizarEstado('Título H1 agregado al DOM y renderizado');
            actualizarBotones();
        }
    }

    // Modifica el contenido textual del título creado
    function cambiarTexto() {
        if (h1Agregado) {
            const titularH1 = document.getElementById('textoInteractuable');
            titularH1.textContent = 'Chau DOM';
            actualizarEstado('Contenido del H1 modificado textualmente');
        }
    }

    // Altera cíclicamente el código de color del texto apuntando secuencialmente al arreglo
    function cambiarColor() {
        if (h1Agregado) {
            const titularH1 = document.getElementById('textoInteractuable');
            indiceColor = (indiceColor + 1) % coloresAcento.length;
            titularH1.style.color = coloresAcento[indiceColor];
            actualizarEstado(`Color rotado. Secuencia cíclica en nivel: ${indiceColor}`);
        }
    }

    // Crea y anexa dinámicamente un nodo de imagen en la mínima escala según los requerimientos (150px)
    function agregarImagen() {
        if (!imagenAgregada) {
            const imagenNueva = document.createElement('img');
            imagenNueva.id = 'imagenInteractuable';
            // Configurar URL con las especificaciones establecidas
            imagenNueva.src = `https://picsum.photos/id/${identificadoresPicsum[indiceImagen]}/400/250`;
            imagenNueva.style.width = escalasResolucionPx[0]; // Fuerza 150px al insertar
            
            areaVisualizacion.appendChild(imagenNueva);
            
            imagenAgregada = true;
            estadoTamanio = 0; // Índice posicionado en Pequeño
            actualizarEstado('Componente fotográfico inyectado al final del DOM');
            actualizarBotones();
        }
    }

    // Reemplaza el origen "src" del nodo IMG, consumiendo una semilla "seed" diferente en orden cíclico
    function cambiarImagen() {
        if (imagenAgregada) {
            const interactivoVisual = document.getElementById('imagenInteractuable');
            indiceImagen = (indiceImagen + 1) % identificadoresPicsum.length;
            interactivoVisual.src = `https://picsum.photos/id/${identificadoresPicsum[indiceImagen]}/400/250`;
            actualizarEstado(`Fotografía remplazada usando nueva semilla ID: ${identificadoresPicsum[indiceImagen]}`);
        }
    }

    // Agranda o comprime el ancho CSS de la imagen, rotando incesantemente por las escalas configuradas
    function cambiarTamanio() {
        if (imagenAgregada) {
            const interactivoVisual = document.getElementById('imagenInteractuable');
            estadoTamanio = (estadoTamanio + 1) % escalasResolucionPx.length;
            interactivoVisual.style.width = escalasResolucionPx[estadoTamanio];
            actualizarEstado(`Resolución reajustada progresivamente a ${escalasResolucionPx[estadoTamanio]}`);
        }
    }

    // Actualiza el span en la parte inferior para proveer el diagnóstico de contexto en tiempo real
    function actualizarEstado(notificacionSistema) {
        barraEstado.textContent = `Última acción comunicada: ${notificacionSistema}`;
    }

    // Activa y desactiva las directivas restrictivas interactables en función a la disponibilidad del lienzo DOM
    function actualizarBotones() {
        botonAgregaH1.disabled = h1Agregado;
        botonCambiaTexto.disabled = !h1Agregado;
        botonCambiaColor.disabled = !h1Agregado;
        
        botonAgregaImagen.disabled = imagenAgregada;
        botonCambiaImagen.disabled = !imagenAgregada;
        botonCambiaTamanio.disabled = !imagenAgregada;
    }

    // Utilidad: Retrae inmediatamente el menú de navegación Hamburguesa cuando en tamaño móvil se hace clic en él
    function habilitarRepliegueSeguroNavegacion() {
        const enlacesRedireccionNavegador = document.querySelectorAll('.navbar-nav .nav-link');
        enlacesRedireccionNavegador.forEach(enlace => {
            enlace.addEventListener('click', () => {
                const cajaDesplegable = document.getElementById('menuNavbar');
                // Se invoca el método directo del propio paquete importado para controlar el cierre natural
                const instanciaNativaCSS = bootstrap.Collapse.getInstance(cajaDesplegable);
                if (instanciaNativaCSS) {
                    instanciaNativaCSS.hide();
                }
            });
        });
    }

    // 5. Asignación contundente de responsabilidades interactivas Click
    botonAgregaH1.addEventListener('click', agregarH1);
    botonCambiaTexto.addEventListener('click', cambiarTexto);
    botonCambiaColor.addEventListener('click', cambiarColor);
    
    botonAgregaImagen.addEventListener('click', agregarImagen);
    botonCambiaImagen.addEventListener('click', cambiarImagen);
    botonCambiaTamanio.addEventListener('click', cambiarTamanio);

    // 6. Actuadores mandatorios pre-comienzo
    habilitarRepliegueSeguroNavegacion();
    actualizarBotones();
});
