// Importar módulos nativos y de terceros requeridos
const express = require('express');
const path = require('path');

// Inicialización de la aplicación de red Express
const app = express();
const PUERTO = 3000;

// Registrar de forma ubicua toda petición entrante mediante middleware (Registro de Acceso)
app.use((peticion, respuesta, siguiente) => {
    const horaLocal = new Date().toLocaleTimeString('es-AR');
    console.log(`[${horaLocal}] INFO: ${peticion.method} -> ${peticion.url}`);
    siguiente();
});

// Desplegar directorios públicos (Assets, Hojas de Estilo y Scripts)
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Habilitar Rutas (Endpoints Estáticos)
app.get('/', (peticion, respuesta) => {
    respuesta.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/acerca', (peticion, respuesta) => {
    respuesta.sendFile(path.join(__dirname, 'pages', 'acerca.html'));
});

// Gestionar Ruta Desconocida (Comodín Error 404)
app.use((peticion, respuesta) => {
    respuesta.status(404).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="utf-8">
            <title>Error 404 - Documento No Existente</title>
            <style>
                body { font-family: monospace; background: #0f172a; color: #f8fafc; text-align: center; padding: 100px 20px; }
                a { color: #38bdf8; text-decoration: none; border-bottom: 1px dotted #38bdf8; }
            </style>
        </head>
        <body>
            <h1>Error 404</h1>
            <p>La vista hipertextual que intentas recuperar no radica en este servidor del Proyecto 4.</p>
            <a href="/">← Volver a la Sala de Máquinas</a>
        </body>
        </html>
    `);
});

// Levantar Escucha e intercepción del EADDRINUSE local
const servidor = app.listen(PUERTO, () => {
    console.log(`🚀 Proyecto 4 (Generador DOM) en ejecución paralela sobre: http://localhost:${PUERTO}`);
});

servidor.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Fallo Fatal por Colisión: El puerto ${PUERTO} está asignado a otro proceso (posiblemente un proyecto anterior de NJS). Detenlo antes de proceder.`);
        process.exit(1);
    } else {
        console.error('⚠️ Desbordamiento inesperado del servidor HTTP:', error);
    }
});
