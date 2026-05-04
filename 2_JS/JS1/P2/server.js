const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

// Log every HTTP request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Route GET /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Handle EADDRINUSE gracefully
const server = app.listen(PORT, () => {
  console.log(`Servidor iniciado. Visita: http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[ERROR] El puerto ${PORT} ya está en uso. Cierra la otra aplicación o cambia el puerto en server.js.\n`);
    process.exit(1);
  } else {
    console.error('\n[ERROR] Error inesperado:', err.message, '\n');
  }
});
