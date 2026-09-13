-- Creacion de la base de datos usuarios_db si no existe
CREATE DATABASE IF NOT EXISTS `usuarios_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `usuarios_db`;

-- Tabla de roles (1NF, 2NF, 3NF: aísla nombres de roles)
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre_rol` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_nombre_rol` (`nombre_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla principal de usuarios (1NF, 2NF, 3NF: núcleo liviano de autenticación)
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `rol_id` INT UNSIGNED NOT NULL DEFAULT 2,
  `fecha_registro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_email` (`email`),
  KEY `fk_usuario_rol` (`rol_id`),
  CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla de perfiles (1NF, 2NF, 3NF: extensión 1:1, evita datos parciales/transitivos en usuarios)
CREATE TABLE IF NOT EXISTS `perfiles` (
  `usuario_id` INT UNSIGNED NOT NULL,
  `telefono` VARCHAR(20) DEFAULT NULL,
  `direccion` VARCHAR(255) DEFAULT NULL,
  `fecha_nacimiento` DATE DEFAULT NULL,
  PRIMARY KEY (`usuario_id`),
  CONSTRAINT `fk_perfil_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insertar roles por defecto si no existen
INSERT INTO `roles` (`id`, `nombre_rol`) VALUES
  (1, 'administrador'),
  (2, 'usuario')
ON DUPLICATE KEY UPDATE `nombre_rol` = VALUES(`nombre_rol`);
