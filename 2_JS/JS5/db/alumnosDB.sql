-- Ejecutar este script una sola vez antes de iniciar el servidor
-- Comando: mysql -u root -p < db/alumnosDB.sql

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS alumnosDB;

-- Seleccionar la base de datos
USE alumnosDB;

-- Crear la tabla de alumnos si no existe
CREATE TABLE IF NOT EXISTS alumnos (
  id       INT          AUTO_INCREMENT PRIMARY KEY,
  nombre   VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  edad     INT          NOT NULL
);

-- Insertar 5 alumnos de ejemplo (seed data)
INSERT INTO alumnos (nombre, apellido, edad) VALUES
  ('Lucía',      'González',  20),
  ('Mateo',      'Ramírez',   22),
  ('Valentina',  'Torres',    19),
  ('Santiago',   'López',     23),
  ('Camila',     'Fernández', 21);
