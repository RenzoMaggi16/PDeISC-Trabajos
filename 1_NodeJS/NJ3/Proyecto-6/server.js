const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware de registro de peticiones (Logging)
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString('es-AR')}] ${req.method} ${req.url}`);
    next();
});

// Servir archivos estáticos (CSS de public y JS de scripts)
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Ruta principal: Entrega la SPA (Single Page Application)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Ruta 404 estricta para rutas no encontradas
app.use((req, res) => {
    res.status(404).send(`
        <html lang="es">
        <head>
            <meta charset="utf-8">
            <title>Error 404 - No Encontrado</title>
            <style>
                body { font-family: sans-serif; background: #0f172a; color: #e2e8f0; text-align: center; padding-top: 20%; }
                h1 { color: #ef4444; }
                a { color: #38bdf8; text-decoration: none; }
            </style>
        </head>
        <body>
            <h1>Error 404</h1>
            <p>La ruta solicitada no existe en este servidor.</p>
            <a href="/">Volver al formulario</a>
        </body>
        </html>
    `);
});

// Manejo de errores a nivel servidor y EADDRINUSE
const server = app.listen(PORT, () => {
    console.log(`🚀 Formulario Dinámico iniciado en http://localhost:${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Error fatal: El puerto ${PORT} ya está en uso por otro proceso.`);
        process.exit(1);
    } else {
        console.error(`❌ Error de servidor:`, err);
    }
});
