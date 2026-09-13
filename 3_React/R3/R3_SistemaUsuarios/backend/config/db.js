// Configuracion del pool de conexiones a MySQL usando mysql2/promise
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Creacion del pool con variables de entorno y limites razonables
export const dbPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'usuarios_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Verificacion inicial de conectividad al arrancar
export async function testConnection() {
  try {
    const connection = await dbPool.getConnection();
    console.log('Conexion exitosa con la base de datos MySQL (usuarios_db).');
    connection.release();
  } catch (error) {
    console.error('Error al conectar con la base de datos MySQL:', error.message);
  }
}

export default dbPool;
