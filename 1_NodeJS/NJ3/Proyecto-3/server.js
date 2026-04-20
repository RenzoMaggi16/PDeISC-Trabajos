// Importar las dependencias esenciales
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

// Servir archivos estáticos de forma pública
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Mapeo detallado de vistas HTML
app.get('/', (peticion, respuesta) => {
    respuesta.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/mouse', (peticion, respuesta) => {
    respuesta.sendFile(path.join(__dirname, 'pages', 'pagina-mouse.html'));
});

app.get('/teclado', (peticion, respuesta) => {
    respuesta.sendFile(path.join(__dirname, 'pages', 'pagina-teclado.html'));
});

app.get('/formulario', (peticion, respuesta) => {
    respuesta.sendFile(path.join(__dirname, 'pages', 'pagina-formulario.html'));
});

app.get('/ventana', (peticion, respuesta) => {
    respuesta.sendFile(path.join(__dirname, 'pages', 'pagina-ventana.html'));
});

app.get('/tiempo', (peticion, respuesta) => {
    respuesta.sendFile(path.join(__dirname, 'pages', 'pagina-tiempo.html'));
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
            <p>Lo sentimos, esta página explícita no existe en el Inspector de Nodos (Proyecto 3).</p>
            <a href="/" style="color: #3b82f6; text-decoration: none; border-bottom: 1px solid #3b82f6;">← Volver al inicio seguro</a>
        </body>
        </html>
    `);
});

// Inicio y despliegue del servidor con manejo riguroso de excepciones (EADDRINUSE)
const servidor = app.listen(PUERTO, () => {
    console.log(`🚀 Plataforma Inspector de Nodos iniciada satisfactoriamente en http://localhost:${PUERTO}`);
});

servidor.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ ¡Error crítico! El puerto ${PUERTO} ya se encuentra ocupado. Cierra el otro proceso e inténtalo nuevamente para evitar colisiones.`);
        process.exit(1);
    } else {
        console.error('⚠️ Ocurrió un fallo desconocido al levantar el servicio HTTP:', error);
    }
});
