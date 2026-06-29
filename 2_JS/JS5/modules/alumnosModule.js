// Módulo de acceso a datos — contiene todas las consultas SQL para la tabla alumnos
const pool = require('../db/connection');

// Obtiene todos los alumnos ordenados por id ascendente
async function obtenerTodos() {
  const [rows] = await pool.execute('SELECT * FROM alumnos ORDER BY id ASC');
  return rows;
}

// Obtiene un alumno por su id; devuelve el primer resultado o undefined
async function obtenerPorId(id) {
  const [rows] = await pool.execute('SELECT * FROM alumnos WHERE id = ?', [id]);
  return rows[0];
}

// Inserta un nuevo alumno y devuelve el insertId generado
async function crearAlumno(datos) {
  const { nombre, apellido, edad } = datos;
  const [result] = await pool.execute(
    'INSERT INTO alumnos (nombre, apellido, edad) VALUES (?, ?, ?)',
    [nombre, apellido, edad]
  );
  return result.insertId;
}

// Actualiza los campos de un alumno existente; devuelve affectedRows
async function actualizarAlumno(id, datos) {
  const { nombre, apellido, edad } = datos;
  const [result] = await pool.execute(
    'UPDATE alumnos SET nombre = ?, apellido = ?, edad = ? WHERE id = ?',
    [nombre, apellido, edad, id]
  );
  return result.affectedRows;
}

// Elimina un alumno por id; devuelve affectedRows
async function eliminarAlumno(id) {
  const [result] = await pool.execute('DELETE FROM alumnos WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = { obtenerTodos, obtenerPorId, crearAlumno, actualizarAlumno, eliminarAlumno };
