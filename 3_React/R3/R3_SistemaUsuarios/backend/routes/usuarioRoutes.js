// Definicion de rutas protegidas de usuarios (/api/usuarios)

import { Router } from 'express';
import {
  listarUsuarios,
  actualizarUsuario,
  eliminarUsuario
} from '../controllers/usuarioController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

// Todas las rutas de usuarios requieren autenticacion previa
router.use(verifyToken);

// Obtiene la lista completa de usuarios
router.get('/', listarUsuarios);

// Actualiza los datos de un usuario por su ID
router.put('/:id', actualizarUsuario);

// Elimina un usuario por su ID
router.delete('/:id', eliminarUsuario);

export default router;
