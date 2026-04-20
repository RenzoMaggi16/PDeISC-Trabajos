// Importar dependencias esenciales
const express = require('express');
const path = require('path');

// Inicialización de la aplicación Express
const app = express();
const PUERTO = 3000;

// Registrar cada petición entrante en la consola con marca de tiempo
app.use((peticion, respuesta, siguiente) => {
    const fecha = new Date().toLocaleTimeString('es-ES');
    console.log(`[${fecha}] ${peticion.method} ${peticion.url}`);
    siguiente();
});

// Servir archivos estáticos (CSS y JS locales) de forma pública
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Mapeo detallado de rutas (Routing Map)
app.get('/', (peticion, respuesta) => {
    respuesta.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/eventos-mouse', (peticion, respuesta) => {
    respuesta.sendFile(path.join(__dirname, 'pages', 'eventos-mouse.html'));
});

app.get('/eventos-teclado', (peticion, respuesta) => {
    respuesta.sendFile(path.join(__dirname, 'pages', 'eventos-teclado.html'));
});

app.get('/eventos-formulario', (peticion, respuesta) => {
    respuesta.sendFile(path.join(__dirname, 'pages', 'eventos-formulario.html'));
});

app.get('/eventos-ventana', (peticion, respuesta) => {
    respuesta.sendFile(path.join(__dirname, 'pages', 'eventos-ventana.html'));
});

app.get('/eventos-tiempo', (peticion, respuesta) => {
    respuesta.sendFile(path.join(__dirname, 'pages', 'eventos-tiempo.html'));
});

// Ruta Comodín (Catch-all) para gestionar el clásico Error 404
app.use((peticion, respuesta) => {
    respuesta.status(404).send(`
        <html lang="es">
        <head>
            <meta charset="utf-8">
            <title>Error 404 - Página no encontrada</title>
            <style>body { font-family: sans-serif; background: #0a0a0b; color: #f8fafc; text-align: center; padding: 100px 20px; }</style>
        </head>
        <body>
            <h1>Error 404</h1>
            <p>Lo sentimos, esta página o ruta no existe en el explorador del Proyecto 2.</p>
            <a href="/" style="color: #3b82f6; text-decoration: none; border-bottom: 1px solid #3b82f6;">← Volver al inicio seguro</a>
        </body>
        </html>
    `);
});

// Inicio y despliegue del servidor con manejo riguroso de excepciones (EADDRINUSE)
const servidor = app.listen(PUERTO, () => {
    console.log(`🚀 Plataforma Multi-Page iniciada satisfactoriamente en http://localhost:${PUERTO}`);
});

servidor.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ ¡Error crítico! El puerto ${PUERTO} ya se encuentra ocupado. Cierra el otro proceso e inténtalo nuevamente para evitar colisiones.`);
        process.exit(1);
    } else {
        console.error('⚠️ Ocurrió un fallo desconocido al levantar el servicio HTTP:', error);
    }
});
