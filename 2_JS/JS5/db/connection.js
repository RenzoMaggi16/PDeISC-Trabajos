// Pool de conexión compartido utilizado por todos los módulos de la aplicación
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:             'localhost',
  user:             'root',
  password:         '',
  database:         'alumnodb',
  waitForConnections: true,
  connectionLimit:  10,
});

module.exports = pool;
