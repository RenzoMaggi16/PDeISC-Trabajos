// Middleware de autenticacion por JWT
// Verifica el token en el encabezado Authorization y adjunta req.usuario

import jwt from 'jsonwebtoken';
import { findUserById } from '../models/usuarioModel.js';

export async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        mensaje: 'Acceso no autorizado. Se requiere un token valido.'
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'super_clave_secreta_jwt_r3_2026_segura';

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (jwtError) {
      return res.status(401).json({
        mensaje: 'Token invalido o expirado. Inicie sesion nuevamente.'
      });
    }

    // Buscar el usuario actualizado en la base de datos
    const usuario = await findUserById(decoded.id);
    if (!usuario) {
      return res.status(401).json({
        mensaje: 'El usuario asociado al token no existe.'
      });
    }

    // Adjuntar usuario autenticado a la peticion
    req.usuario = usuario;
    next();
  } catch (error) {
    next(error);
  }
}
