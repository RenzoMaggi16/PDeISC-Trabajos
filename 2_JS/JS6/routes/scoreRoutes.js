// Rutas de la API de puntajes. Por restricción del proyecto, solo se usa POST.

import { Router } from 'express';
import { guardarPuntaje, obtenerRanking } from '../controllers/scoreController.js';

const router = Router();

// Guardar un puntaje nuevo.
router.post('/guardar', guardarPuntaje);

// Consultar el ranking (top 10). Se usa POST por la restricción del proyecto.
router.post('/ranking', obtenerRanking);

export default router;
