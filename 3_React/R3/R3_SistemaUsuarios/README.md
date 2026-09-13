# R3 — Sistema de Gestión de Usuarios (React + Express + MySQL)

Este proyecto implementa una solución full-stack robusta para la administración de usuarios y perfiles, respaldada por una base de datos relacional MySQL y dos arquitecturas frontend alternativas que consumen la misma fuente de datos.

---

## 1. Estructura del Proyecto

El sistema está encapsulado en una **única carpeta raíz** (`R3_SistemaUsuarios/`) atomizada en tres subcarpetas independientes:

```
R3_SistemaUsuarios/
├── backend/                  -> API REST en Express con ES Modules y persistencia MySQL
│   ├── .env                  -> Configuración de base de datos y clave secreta JWT
│   ├── init.sql              -> Script DDL para creación de tablas y datos semilla
│   ├── server.js             -> Punto de entrada Express con control de EADDRINUSE y Helmet
│   ├── config/               -> Pool asíncrono con mysql2/promise
│   ├── middleware/           -> Middleware de autenticación JWT y centralizador de errores
│   ├── models/               -> Consultas parametrizadas (1NF, 2NF, 3NF)
│   ├── controllers/          -> Controladores de auth y CRUD de usuarios
│   ├── routes/               -> Definición de rutas /api/auth y /api/usuarios
│   └── utils/                -> Validaciones en JavaScript del servidor
│
├── frontend-router/          -> Aplicación React 18 + Vite con navegación vía React Router v6
│   ├── index.html            -> Bootstrap 5 CDN y Google Fonts
│   ├── vite.config.js        -> Puerto 5173
│   └── src/                  -> Páginas (/login, /registro, Dashboard protegida, 404)
│
└── frontend-state/           -> Aplicación React 18 + Vite con navegación vía useState (sin Router)
    ├── index.html            -> Bootstrap 5 CDN y Google Fonts
    ├── vite.config.js        -> Puerto 5174
    └── src/                  -> Vistas condicionales (VistaLogin, VistaRegistro, VistaPanel con guard)
```

---

## 2. Base de Datos Relacional (`usuarios_db`)

El diseño relacional cumple estrictamente con **1NF, 2NF y 3NF**:
- `roles` (`id`, `nombre_rol` UNIQUE).
- `usuarios` (`id`, `nombre`, `email` UNIQUE, `password_hash`, `rol_id` FK, `fecha_registro`).
- `perfiles` (`usuario_id` PK/FK ON DELETE CASCADE, `telefono`, `direccion`, `fecha_nacimiento`).

### Inicialización de la Base de Datos
Si se requiere inicializar o restaurar la base de datos, ejecute el script `backend/init.sql`:
```bash
mysql -u root -p < backend/init.sql
```

---

## 3. Instrucciones de Ejecución

### A. Backend (`http://localhost:4000`)
```bash
cd backend
npm install
npm run dev
# o directamente: node server.js
```
El servidor confirmará su inicio imprimiendo en consola:
`Servidor backend iniciado exitosamente en el puerto 4000. Estado: en linea.`

### B. Frontend con React Router (`http://localhost:5173`)
```bash
cd ../frontend-router
npm install
npm run dev
```

### C. Frontend con useState (`http://localhost:5174`)
```bash
cd ../frontend-state
npm install
npm run dev
```

---

## 4. Convenciones Globales Aplicadas
- **Idioma:** Textos de interfaz y mensajes en **español**; nombres de utilidades en **inglés**; atributos de dominio en **español**.
- **Seguridad:** Contraseñas protegidas mediante hash `bcrypt` (factor de costo 10); autenticación mediante `JWT` firmado con expiración de 4 horas; consultas MySQL 100% parametrizadas con placeholders `?` para prevenir inyecciones SQL.
- **Validaciones:** Ejecutadas íntegramente en JavaScript mediante `react-hook-form` en frontend y funciones de validación en backend; sin atributos nativos HTML5.
- **Diseño:** Bootstrap 5 vía CDN, Google Fonts (Plus Jakarta Sans e Inter), diseño responsivo, tarjetas modernas con sombras suaves y cero estilos en línea (`no inline styles`).
