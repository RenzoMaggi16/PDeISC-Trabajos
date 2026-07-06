// Servidor principal del juego Ahorcado (ES Modules).
// Sirve el frontend estático, expone la API de puntajes y provee palabras.

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import scoreRoutes from './routes/scoreRoutes.js';
import { obtenerPalabra } from './modules/palabraService.js';

// En ES Modules no existe __dirname; lo reconstruimos con import.meta.url.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Permite leer cuerpos JSON en las peticiones.
app.use(express.json());

// Middleware de logging: registra método y URL de cada petición.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Archivos estáticos (CSS y JS del frontend).
app.use(express.static(path.join(__dirname, 'public')));

// Página principal del juego.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Endpoint para obtener una palabra (solo POST, por la restricción del proyecto).
app.post('/api/palabra', async (req, res) => {
  try {
    const palabra = await obtenerPalabra();
    res.status(200).json({ ok: true, palabra });
  } catch (error) {
    console.error('Error al obtener la palabra:', error.message);
    res.status(500).json({ ok: false, mensaje: 'Error del servidor al obtener la palabra.' });
  }
});

// Rutas de puntajes.
app.use('/api/score', scoreRoutes);

// Arranque del servidor con manejo de EADDRINUSE.
const server = app.listen(PORT, () => {
  console.log(`✅ Servidor del Ahorcado escuchando en http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('❌ El puerto 3000 ya está en uso.');
  } else {
    console.error(`❌ Error del servidor: ${err.message}`);
  }
  process.exit(1);
});
