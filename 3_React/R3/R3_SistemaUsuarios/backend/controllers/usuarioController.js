// Controlador para operaciones CRUD de usuarios protegidas

import {
  getAllUsers,
  findUserById,
  updateUserAndProfile,
  deleteUser
} from '../models/usuarioModel.js';
import { isValidName, isValidDateString } from '../utils/validators.js';

// Retorna el listado completo de usuarios
export async function listarUsuarios(req, res, next) {
  try {
    const usuarios = await getAllUsers();
    return res.status(200).json(usuarios);
  } catch (error) {
    next(error);
  }
}

// Actualiza los datos de un usuario y su perfil asociado
export async function actualizarUsuario(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ mensaje: 'El ID de usuario debe ser un numero valido.' });
    }

    // Regla de autorizacion: solo el propio usuario o un administrador pueden modificar
    const esAdmin = req.usuario.rol === 'administrador';
    const esMismoUsuario = req.usuario.id === id;

    if (!esAdmin && !esMismoUsuario) {
      return res.status(403).json({
        mensaje: 'No tiene permisos para modificar este usuario.'
      });
    }

    const usuarioExistente = await findUserById(id);
    if (!usuarioExistente) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    const { nombre, telefono, direccion, fechaNacimiento } = req.body;

    if (nombre !== undefined && !isValidName(nombre)) {
      return res.status(400).json({
        mensaje: 'El nombre debe contener al menos 2 caracteres.'
      });
    }

    if (fechaNacimiento && !isValidDateString(fechaNacimiento)) {
      return res.status(400).json({
        mensaje: 'El formato de fecha de nacimiento es invalido (AAAA-MM-DD).'
      });
    }

    await updateUserAndProfile(id, {
      nombre: nombre || usuarioExistente.nombre,
      telefono,
      direccion,
      fechaNacimiento
    });

    const usuarioActualizado = await findUserById(id);

    return res.status(200).json({
      mensaje: 'Usuario y perfil actualizados exitosamente.',
      usuario: usuarioActualizado
    });
  } catch (error) {
    next(error);
  }
}

// Elimina un usuario por su ID
export async function eliminarUsuario(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ mensaje: 'El ID de usuario debe ser un numero valido.' });
    }

    // Regla de autorizacion: solo un administrador o el propio usuario pueden eliminar la cuenta
    const esAdmin = req.usuario.rol === 'administrador';
    const esMismoUsuario = req.usuario.id === id;

    if (!esAdmin && !esMismoUsuario) {
      return res.status(403).json({
        mensaje: 'No tiene permisos para eliminar este usuario.'
      });
    }

    const usuarioExistente = await findUserById(id);
    if (!usuarioExistente) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    await deleteUser(id);

    return res.status(200).json({
      mensaje: 'Usuario eliminado exitosamente.',
      id
    });
  } catch (error) {
    next(error);
  }
}
