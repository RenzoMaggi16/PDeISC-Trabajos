// Importar los módulos necesarios de Express y FileSystem / Path
const express = require('express');
const path = require('path');

// Inicializar la aplicación
const app = express();
const PUERTO = 3000;

// Middleware global para registrar cada petición HTTP en la consola
app.use((peticion, respuesta, siguiente) => {
    console.log(`[Petición Recibida] Método: ${peticion.method} | Ruta: ${peticion.url}`);
    siguiente();
});

// Servir de forma estática los recursos desde la carpeta /public y /scripts
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Ruta principal web: procesa la URL base y devuelve el index.html
app.get('/', (peticion, respuesta) => {
    respuesta.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Comienzo de la escucha del servidor con mensaje alfanumérico exitoso
const servidor = app.listen(PUERTO, () => {
    console.log(`✅ Servidor iniciado correctamente. Puedes acceder ingresando a http://localhost:${PUERTO} en tu navegador.`);
});

// Manejo seguro para prevenir la caída del servidor si el puerto ya está ocupado (EADDRINUSE)
servidor.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ ¡Error crítico! El puerto ${PUERTO} ya se encuentra ocupado. Por favor, cierra la otra aplicación activa e intenta ejecutar nuevamente.`);
        process.exit(1);
    } else {
        console.error('⚠️ Ocurrió un error inesperado al intentar arrancar Express:', error);
    }
});
