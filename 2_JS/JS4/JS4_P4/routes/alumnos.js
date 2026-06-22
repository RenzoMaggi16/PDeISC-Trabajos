// Router de Express para /api/alumnos — capa HTTP pura, sin lógica de negocio
const express = require('express');
const router  = express.Router();
const { obtenerTodos, obtenerPorId } = require('../modules/alumnos');

// GET /api/alumnos — devuelve todos los alumnos, con filtro opcional por carrera
router.get('/alumnos', (req, res) => {
  const carrera  = req.query.carrera || '';
  const resultado = obtenerTodos(carrera);
  res.status(200).json(resultado);
});

// GET /api/alumnos/:id — devuelve un alumno por ID o 404 si no existe
router.get('/alumnos/:id', (req, res) => {
  const id     = parseInt(req.params.id, 10);
  const alumno = obtenerPorId(id);

  if (!alumno) {
    return res.status(404).json({ error: 'Alumno no encontrado' });
  }

  res.status(200).json(alumno);
});

module.exports = router;
