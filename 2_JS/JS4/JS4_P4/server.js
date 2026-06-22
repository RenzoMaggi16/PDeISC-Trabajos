// Servidor Express para JS4_P4 — monta la API REST y sirve el frontend
const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3003;

// Parsea cuerpos JSON en las requests (necesario para futuros POST si se extiende)
app.use(express.json());

// Registra método, URL y código de estado de cada solicitud
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} → ${res.statusCode}`);
  });
  next();
});

// Monta el router de alumnos bajo el prefijo /api
app.use('/api', require('./routes/alumnos'));

// Sirve los estilos personalizados y los scripts del cliente
app.use('/public/styles', express.static(path.join(__dirname, 'public', 'styles')));
app.use('/scripts',       express.static(path.join(__dirname, 'scripts')));

// Ruta principal — entrega la página HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Inicia el servidor y maneja el error de puerto ocupado
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`API disponible en http://localhost:${PORT}/api/alumnos`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: el puerto ${PORT} ya está en uso. Cerrá el proceso que lo ocupa e intentá de nuevo.`);
    process.exit(1);
  }
  throw err;
});
