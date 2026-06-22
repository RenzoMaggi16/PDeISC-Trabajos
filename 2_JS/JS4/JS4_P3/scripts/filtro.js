// Módulo de filtrado: función pura sin efectos secundarios ni acceso al DOM

// Filtra el array de usuarios por nombre sin modificar el original
function filtrarPorNombre(usuarios, termino) {
  const terminoLimpio = termino.trim().toLowerCase();

  // Sin término de búsqueda devuelve el array completo
  if (!terminoLimpio) return usuarios;

  return usuarios.filter((usuario) =>
    usuario.name.toLowerCase().includes(terminoLimpio)
  );
}

// Expone la función en el objeto global para que app.js pueda invocarla
window.filtrarPorNombre = filtrarPorNombre;
