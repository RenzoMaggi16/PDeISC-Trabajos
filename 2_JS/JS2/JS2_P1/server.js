
const express = require('express');
const path = require('path');
const fs = require('fs');
const indexRoutes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de middleware
app.use(express.json()); // Permite parsear JSON en el body de las peticiones POST

// Servir archivos estáticos (CSS y JS)
app.use('/styles', express.static(path.join(__dirname, 'public', 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Montar las rutas
app.use('/', indexRoutes);

// Asegurar que la carpeta 'galeria' exista
const galeriaPath = path.join(__dirname, 'galeria');
try {
  if (!fs.existsSync(galeriaPath)) {
    fs.mkdirSync(galeriaPath, { recursive: true });
    console.log(`[OK] Carpeta 'galeria' creada exitosamente en ${galeriaPath}`);
  } else {
    console.log(`[INFO] La carpeta 'galeria' ya existe.`);
  }
} catch (error) {
  console.error(`[ERROR] No se pudo crear la carpeta 'galeria': ${error.message}`);
}

// Interceptar todas las peticiones para loggearlas (middleware)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Manejo del inicio del servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor iniciado y escuchando en http://localhost:${PORT}`);
});

// Manejo elegante del error EADDRINUSE
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[ERROR] El puerto ${PORT} ya está en uso. Por favor, cerrá la aplicación que lo ocupa o cambiá el puerto.`);
    process.exit(1);
  } else {
    console.error(`[ERROR] Ocurrió un problema con el servidor: ${err.message}`);
  }
});
