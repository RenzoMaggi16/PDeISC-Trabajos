// Router de Express para todos los endpoints de /api/alumnos
const express = require('express');
const router  = express.Router();
const {
  obtenerTodos,
  obtenerPorId,
  crearAlumno,
  actualizarAlumno,
  eliminarAlumno,
} = require('../modules/alumnosModule');

// Valida que nombre y apellido sean strings no vacíos y edad sea entero entre 1 y 120
function validarDatos(body) {
  const { nombre, apellido, edad } = body;
  if (typeof nombre !== 'string' || nombre.trim() === '') return false;
  if (typeof apellido !== 'string' || apellido.trim() === '') return false;
  const edadNum = Number(edad);
  if (!Number.isInteger(edadNum) || edadNum < 1 || edadNum > 120) return false;
  return true;
}

// GET /api/alumnos — obtener todos los alumnos
router.get('/api/alumnos', async (req, res) => {
  try {
    const datos = await obtenerTodos();
    res.json({ ok: true, datos });
  } catch (error) {
    console.error('Error al obtener alumnos:', error);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
});

// GET /api/alumnos/:id — obtener alumno por id
router.get('/api/alumnos/:id', async (req, res) => {
  try {
    const dato = await obtenerPorId(req.params.id);
    if (!dato) return res.status(404).json({ ok: false, mensaje: 'Alumno no encontrado' });
    res.json({ ok: true, dato });
  } catch (error) {
    console.error('Error al obtener alumno por id:', error);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
});

// POST /api/alumnos — crear nuevo alumno
router.post('/api/alumnos', async (req, res) => {
  if (!validarDatos(req.body)) {
    return res.status(400).json({ ok: false, mensaje: 'Datos inválidos' });
  }
  try {
    const id = await crearAlumno(req.body);
    res.status(201).json({ ok: true, mensaje: 'Alumno creado correctamente', id });
  } catch (error) {
    console.error('Error al crear alumno:', error);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
});

// PUT /api/alumnos/:id — actualizar alumno existente
router.put('/api/alumnos/:id', async (req, res) => {
  if (!validarDatos(req.body)) {
    return res.status(400).json({ ok: false, mensaje: 'Datos inválidos' });
  }
  try {
    const afectados = await actualizarAlumno(req.params.id, req.body);
    if (afectados === 0) return res.status(404).json({ ok: false, mensaje: 'Alumno no encontrado' });
    res.json({ ok: true, mensaje: 'Alumno actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar alumno:', error);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
});

// DELETE /api/alumnos/:id — eliminar alumno
router.delete('/api/alumnos/:id', async (req, res) => {
  try {
    const afectados = await eliminarAlumno(req.params.id);
    if (afectados === 0) return res.status(404).json({ ok: false, mensaje: 'Alumno no encontrado' });
    res.json({ ok: true, mensaje: 'Alumno eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar alumno:', error);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
});

module.exports = router;
