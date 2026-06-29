// Punto de entrada principal de la aplicación alumnosDB
const express = require('express');
const path    = require('path');

const alumnosRouter = require('./routes/alumnos');

const app  = express();
const PORT = 3000;

// Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(express.json());

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de registro de solicitudes
app.use((req, res, next) => {
  console.log(`Solicitud recibida: [${req.method}] ${req.url}`);
  next();
});

// Montar el router de alumnos (las rutas incluyen el prefijo /api/alumnos)
app.use('/', alumnosRouter);

// Ruta raíz — sirve la página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Iniciar el servidor con manejo del error EADDRINUSE
const servidor = app.listen(PORT, () => {
  console.log(`Servidor iniciado correctamente en http://localhost:${PORT}`);
});

servidor.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Error: el puerto ${PORT} ya está en uso. Cerrá el proceso que lo ocupa e intentá de nuevo.`);
    process.exit(1);
  } else {
    console.error('Error inesperado en el servidor:', error);
    process.exit(1);
  }
});
