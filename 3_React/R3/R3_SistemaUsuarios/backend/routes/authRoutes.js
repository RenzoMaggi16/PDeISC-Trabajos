// Definicion de rutas de autenticacion (/api/auth)

import { Router } from 'express';
import { registrar, login, perfil } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

// Ruta publica para registrar un nuevo usuario
router.post('/registrar', registrar);

// Ruta publica para iniciar sesion y obtener token JWT
router.post('/login', login);

// Ruta protegida para consultar el perfil del usuario autenticado
router.get('/perfil', verifyToken, perfil);

export default router;
