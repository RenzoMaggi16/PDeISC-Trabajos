// Servidor principal de Express para el sistema R3 Backend
// Implementa ES Modules, Helmet, CORS, rutas modulares y control de EADDRINUSE

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { testConnection } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Configuracion de cabeceras de seguridad
app.use(helmet());

// Origenes permitidos para ambos frontends (React Router y useState)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir solicitudes sin origen (ej. Postman, curl, scripts locales) o que coincidan con la lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Acceso no permitido por la politica de CORS.'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parseo de cuerpos JSON
app.use(express.json());

// Verificacion de conectividad con la base de datos MySQL
testConnection();

// Rutas de la API REST
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Ruta base de estado para monitoreo
app.get('/api/estado', (req, res) => {
  res.status(200).json({
    sistema: 'R3 Backend API',
    estado: 'en linea',
    timestamp: new Date().toISOString()
  });
});

// Middleware centralizado de errores
app.use(errorHandler);

// Inicio del servidor con control explicito de EADDRINUSE
const server = app.listen(PORT, () => {
  console.log(`Servidor backend iniciado exitosamente en el puerto ${PORT}. Estado: en linea.`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: El puerto ${PORT} ya esta en uso por otro proceso. Cierre la aplicacion que ocupa el puerto o cambie la variable PORT en el archivo .env.`);
    process.exit(1);
  } else {
    console.error('Error no controlado al iniciar el servidor:', err.message);
    process.exit(1);
  }
});

export default app;
