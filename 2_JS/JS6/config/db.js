// Configuración de la conexión a MySQL usando un pool de mysql2/promise.
// Las credenciales por defecto corresponden a una instalación estándar de XAMPP.
// Puedes modificarlas aquí (o mover a variables de entorno si lo prefieres).

import mysql from 'mysql2/promise';

// --- Credenciales configurables ---
const config = {
  host: 'localhost',   // servidor de la base de datos
  user: 'root',        // usuario por defecto de XAMPP
  password: '',        // contraseña por defecto de XAMPP (vacía)
  database: 'Score',   // nombre de la base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Pool de conexiones reutilizable en toda la aplicación.
const pool = mysql.createPool(config);

export default pool;
