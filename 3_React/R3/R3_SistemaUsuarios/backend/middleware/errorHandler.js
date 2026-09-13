// Middleware centralizado para el manejo de errores en Express

export function errorHandler(err, req, res, next) {
  console.error('Error interno del servidor:', err);

  // Manejo de violacion de clave unica en MySQL (ej. email duplicado)
  if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
    return res.status(409).json({
      mensaje: 'El correo electronico ingresado ya se encuentra registrado.'
    });
  }

  // Manejo de errores de sintaxis JSON en el cuerpo de la peticion
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      mensaje: 'Formato JSON invalido en el cuerpo de la peticion.'
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const mensaje = err.message || 'Ocurrio un error interno en el servidor.';

  return res.status(statusCode).json({
    mensaje,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}
