// Controladores para gestionar los puntajes en la base de datos.
// Todas las consultas usan mysql2/promise y están envueltas en try/catch.

import pool from '../config/db.js';

// Inserta un nuevo puntaje. La fecha se asigna automáticamente en la BD.
export async function guardarPuntaje(req, res) {
  try {
    const { nombre, puntos, tiempo } = req.body ?? {};

    // --- Validaciones en el servidor ---
    if (typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({ ok: false, mensaje: 'El nombre no puede estar vacío.' });
    }
    if (nombre.trim().length > 50) {
      return res.status(400).json({ ok: false, mensaje: 'El nombre no puede superar los 50 caracteres.' });
    }
    if (!Number.isFinite(Number(puntos)) || !Number.isFinite(Number(tiempo))) {
      return res.status(400).json({ ok: false, mensaje: 'Los puntos y el tiempo deben ser números válidos.' });
    }

    const [resultado] = await pool.query(
      'INSERT INTO score (nombre, puntos, tiempo) VALUES (?, ?, ?)',
      [nombre.trim(), Math.trunc(Number(puntos)), Math.trunc(Number(tiempo))]
    );

    return res.status(201).json({
      ok: true,
      mensaje: 'Puntaje guardado correctamente.',
      id: resultado.insertId
    });
  } catch (error) {
    console.error('Error al guardar el puntaje:', error.message);
    return res.status(500).json({ ok: false, mensaje: 'Error del servidor al guardar el puntaje.' });
  }
}

// Devuelve los 10 mejores puntajes ordenados por puntos (desc) y tiempo (asc).
export async function obtenerRanking(req, res) {
  try {
    const [filas] = await pool.query(
      'SELECT id, nombre, puntos, tiempo, fecha FROM score ORDER BY puntos DESC, tiempo ASC LIMIT 10'
    );
    return res.status(200).json({ ok: true, ranking: filas });
  } catch (error) {
    console.error('Error al obtener el ranking:', error.message);
    return res.status(500).json({ ok: false, mensaje: 'Error del servidor al obtener el ranking.' });
  }
}
