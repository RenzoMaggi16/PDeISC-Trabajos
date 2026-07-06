-- Script de creación de la base de datos y tabla para el leaderboard del Ahorcado.
-- Ejecutar en phpMyAdmin (XAMPP) o desde la consola de MySQL.

CREATE DATABASE IF NOT EXISTS Score;
USE Score;

CREATE TABLE IF NOT EXISTS score (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  puntos INT NOT NULL,
  tiempo INT NOT NULL COMMENT 'tiempo en segundos que tardó el jugador',
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);
