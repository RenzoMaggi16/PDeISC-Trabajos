// Importaciones nativas y de terceros requeridas
const express = require('express');
const path = require('path');

// Inicialización de la aplicación Express
const app = express();
const PUERTO = 3000;

// Registrar peticiones entrantes mediante middleware centralizado
app.use((peticion, respuesta, siguiente) => {
    const horaLocal = new Date().toLocaleTimeString('es-AR');
    console.log(`[${horaLocal}] INFO: ${peticion.method} -> ${peticion.url}`);
    siguiente();
});

// Desplegar directorios públicos (Estilos y Scripts) como assets estáticos absolutos
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Habilitar Ruta Estática Troncal
app.get('/', (peticion, respuesta) => {
    respuesta.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Gestionar Rutas Desconocidas (Manejo global de 404)
app.use((peticion, respuesta) => {
    respuesta.status(404).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="utf-8">
            <title>404 - Ruta Inexistente</title>
            <style>
                body { font-family: monospace; background: #0f172a; color: #f8fafc; text-align: center; padding: 100px 20px; }
                a { color: #3b82f6; text-decoration: none; border-bottom: 1px dotted #3b82f6; }
            </style>
        </head>
        <body>
            <h1>Error 404</h1>
            <p>La dirección que buscas no habita en la infraestructura del Proyecto 5.</p>
            <a href="/">← Regresar a la Aplicación Central</a>
        </body>
        </html>
    `);
});

// Levantar Escucha e Intercepción de Errores Críticos (EADDRINUSE)
const servidor = app.listen(PUERTO, () => {
    console.log(`🚀 Proyecto 5 (Motor innerHTML) operativo y sirviendo en: http://localhost:${PUERTO}`);
});

servidor.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Fallo Crítico por Dirección Ocupada: El puerto ${PUERTO} ya está bloqueado por otro proceso en Node. Detenlo antes de arrancar este componente.`);
        process.exit(1);
    } else {
        console.error('⚠️ Desbordamiento inesperado del servidor HTTP:', error);
    }
});
