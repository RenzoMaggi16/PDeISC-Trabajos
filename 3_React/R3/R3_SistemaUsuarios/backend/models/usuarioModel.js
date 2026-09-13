// Modelo de acceso a datos para usuarios, roles y perfiles
// Implementa consultas SQL estrictamente parametrizadas con placeholders '?'

import dbPool from '../config/db.js';

// Busca un usuario por su correo electronico, incluyendo password_hash para verificacion de login
export async function findUserByEmail(email) {
  const query = `
    SELECT u.id, u.nombre, u.email, u.password_hash, u.rol_id, r.nombre_rol AS rol, u.fecha_registro
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.id
    WHERE u.email = ?
    LIMIT 1
  `;
  const [rows] = await dbPool.execute(query, [email.trim().toLowerCase()]);
  return rows[0] || null;
}

// Busca un usuario por su ID, retornando datos de usuario, rol y perfil (sin password_hash)
export async function findUserById(id) {
  const query = `
    SELECT 
      u.id, 
      u.nombre, 
      u.email, 
      r.nombre_rol AS rol, 
      u.fecha_registro AS fechaRegistro,
      p.telefono, 
      p.direccion, 
      p.fecha_nacimiento AS fechaNacimiento
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.id
    LEFT JOIN perfiles p ON u.id = p.usuario_id
    WHERE u.id = ?
    LIMIT 1
  `;
  const [rows] = await dbPool.execute(query, [id]);
  return rows[0] || null;
}

// Obtiene la lista completa de todos los usuarios registrados (sin password_hash)
export async function getAllUsers() {
  const query = `
    SELECT 
      u.id, 
      u.nombre, 
      u.email, 
      r.nombre_rol AS rol, 
      u.fecha_registro AS fechaRegistro,
      p.telefono, 
      p.direccion, 
      p.fecha_nacimiento AS fechaNacimiento
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.id
    LEFT JOIN perfiles p ON u.id = p.usuario_id
    ORDER BY u.id ASC
  `;
  const [rows] = await dbPool.execute(query);
  return rows;
}

// Obtiene el ID del rol por su nombre ('usuario' o 'administrador')
export async function getRoleIdByName(roleName) {
  const query = 'SELECT id FROM roles WHERE nombre_rol = ? LIMIT 1';
  const [rows] = await dbPool.execute(query, [roleName]);
  if (rows.length > 0) {
    return rows[0].id;
  }
  return 2; // Valor por defecto para rol 'usuario'
}

// Crea un nuevo usuario y su perfil asociado utilizando una transaccion SQL
export async function createUser({
  nombre,
  email,
  passwordHash,
  rolId = 2,
  telefono = null,
  direccion = null,
  fechaNacimiento = null
}) {
  const connection = await dbPool.getConnection();
  try {
    await connection.beginTransaction();

    // Insercion en tabla usuarios
    const insertUserQuery = `
      INSERT INTO usuarios (nombre, email, password_hash, rol_id)
      VALUES (?, ?, ?, ?)
    `;
    const [userResult] = await connection.execute(insertUserQuery, [
      nombre.trim(),
      email.trim().toLowerCase(),
      passwordHash,
      rolId
    ]);

    const newUserId = userResult.insertId;

    // Insercion en tabla 1:1 perfiles
    const insertProfileQuery = `
      INSERT INTO perfiles (usuario_id, telefono, direccion, fecha_nacimiento)
      VALUES (?, ?, ?, ?)
    `;
    await connection.execute(insertProfileQuery, [
      newUserId,
      telefono ? String(telefono).trim() : null,
      direccion ? String(direccion).trim() : null,
      fechaNacimiento || null
    ]);

    await connection.commit();
    return newUserId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Actualiza los datos de nombre de usuario y los atributos de su perfil
export async function updateUserAndProfile(id, { nombre, telefono, direccion, fechaNacimiento }) {
  const connection = await dbPool.getConnection();
  try {
    await connection.beginTransaction();

    // Actualizar nombre en usuarios si fue proporcionado
    if (nombre) {
      const updateUserQuery = 'UPDATE usuarios SET nombre = ? WHERE id = ?';
      await connection.execute(updateUserQuery, [nombre.trim(), id]);
    }

    // Actualizar o insertar perfil en perfiles
    const upsertProfileQuery = `
      INSERT INTO perfiles (usuario_id, telefono, direccion, fecha_nacimiento)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        telefono = VALUES(telefono),
        direccion = VALUES(direccion),
        fecha_nacimiento = VALUES(fecha_nacimiento)
    `;
    await connection.execute(upsertProfileQuery, [
      id,
      telefono !== undefined && telefono !== '' ? String(telefono).trim() : null,
      direccion !== undefined && direccion !== '' ? String(direccion).trim() : null,
      fechaNacimiento || null
    ]);

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Elimina un usuario por su ID (la foreign key con ON DELETE CASCADE limpia la tabla perfiles)
export async function deleteUser(id) {
  const query = 'DELETE FROM usuarios WHERE id = ?';
  const [result] = await dbPool.execute(query, [id]);
  return result.affectedRows > 0;
}
