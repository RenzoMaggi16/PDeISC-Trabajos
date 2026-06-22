// Servidor Express para JS4_P1 — sirve la SPA y archivos estáticos
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Registra cada solicitud entrante con método y URL
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Sirve los estilos personalizados desde /public/styles
app.use('/public/styles', express.static(path.join(__dirname, 'public', 'styles')));

// Sirve los scripts del cliente desde /scripts
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Ruta principal — entrega la página HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Inicia el servidor y maneja el error de puerto ocupado
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: el puerto ${PORT} ya está en uso. Cerrá el proceso que lo ocupa e intentá de nuevo.`);
    process.exit(1);
  }
  throw err;
});
