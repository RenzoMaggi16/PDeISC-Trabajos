const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware for logging every HTTP request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static files from 'public' and 'scripts'
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Route GET / to serve the landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'landing.html'));
});

// Route GET /formulario to serve the SPA shell
app.get('/formulario', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Start the server and handle EADDRINUSE gracefully
const server = app.listen(PORT, () => {
  console.log(`Servidor iniciado con éxito. Por favor visita: http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[ERROR] El puerto ${PORT} ya está en uso. Por favor cierra la otra aplicación o cambia el puerto en server.js.\n`);
    process.exit(1);
  } else {
    console.error('\n[ERROR] Ocurrió un error inesperado al iniciar el servidor:', err.message, '\n');
  }
});
