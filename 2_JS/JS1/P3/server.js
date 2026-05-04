const express = require('express');
const path = require('path');

const app = express();
const PORT = 3002;

// Log HTTP requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Route GET /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`Servidor iniciado. Visita: http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[ERROR] El puerto ${PORT} ya está en uso. Por favor, cierra la otra aplicación o cambia el puerto.\n`);
    process.exit(1);
  } else {
    console.error('\n[ERROR] Error inesperado:', err.message, '\n');
  }
});
