// Controlador para flujos de autenticacion (registro, inicio de sesion y perfil propio)

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  findUserByEmail,
  findUserById,
  getRoleIdByName,
  createUser
} from '../models/usuarioModel.js';
import {
  isValidEmail,
  isStrongPassword,
  isValidName,
  isValidDateString
} from '../utils/validators.js';

// Registra un nuevo usuario en la aplicacion
export async function registrar(req, res, next) {
  try {
    const { nombre, email, contraseña, telefono, direccion, fechaNacimiento } = req.body;

    // Validacion de campos obligatorios
    if (!nombre || !email || !contraseña) {
      return res.status(400).json({
        mensaje: 'Los campos nombre, correo electronico y contrasenia son requeridos.'
      });
    }

    if (!isValidName(nombre)) {
      return res.status(400).json({
        mensaje: 'El nombre debe contener al menos 2 caracteres.'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        mensaje: 'El formato del correo electronico es invalido.'
      });
    }

    if (!isStrongPassword(contraseña)) {
      return res.status(400).json({
        mensaje: 'La contrasenia debe tener minimo 6 caracteres e incluir al menos una letra y un numero.'
      });
    }

    if (fechaNacimiento && !isValidDateString(fechaNacimiento)) {
      return res.status(400).json({
        mensaje: 'El formato de fecha de nacimiento es invalido (debe ser AAAA-MM-DD).'
      });
    }

    // Verificar si el email ya existe
    const usuarioExistente = await findUserByEmail(email);
    if (usuarioExistente) {
      return res.status(409).json({
        mensaje: 'El correo electronico ya se encuentra registrado.'
      });
    }

    // Hashear contrasenia con bcrypt (factor de costo 10)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(contraseña, saltRounds);

    // Obtener id del rol por defecto 'usuario'
    const rolId = await getRoleIdByName('usuario');

    // Crear registro en tabla usuarios y perfiles
    const nuevoId = await createUser({
      nombre,
      email,
      passwordHash,
      rolId,
      telefono,
      direccion,
      fechaNacimiento
    });

    const usuarioCreado = await findUserById(nuevoId);

    return res.status(201).json({
      mensaje: 'Usuario registrado exitosamente.',
      usuario: usuarioCreado
    });
  } catch (error) {
    next(error);
  }
}

// Inicia sesion y genera el token JWT
export async function login(req, res, next) {
  try {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
      return res.status(400).json({
        mensaje: 'Debe proporcionar correo electronico y contrasenia.'
      });
    }

    // Buscar usuario por correo
    const usuario = await findUserByEmail(email);
    if (!usuario) {
      return res.status(401).json({
        mensaje: 'Credenciales invalidas. Verifique su correo o contrasenia.'
      });
    }

    // Comparar contrasenia ingresada con el hash almacenado
    const passwordValido = await bcrypt.compare(contraseña, usuario.password_hash);
    if (!passwordValido) {
      return res.status(401).json({
        mensaje: 'Credenciales invalidas. Verifique su correo o contrasenia.'
      });
    }

    // Generar JWT con vigencia de 4 horas
    const secret = process.env.JWT_SECRET || 'super_clave_secreta_jwt_r3_2026_segura';
    const payload = {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    };
    const token = jwt.sign(payload, secret, { expiresIn: '4h' });

    return res.status(200).json({
      mensaje: 'Inicio de sesion exitoso.',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    next(error);
  }
}

// Devuelve los datos del perfil del usuario autenticado actual
export async function perfil(req, res, next) {
  try {
    // req.usuario fue inyectado por authMiddleware
    return res.status(200).json(req.usuario);
  } catch (error) {
    next(error);
  }
}
