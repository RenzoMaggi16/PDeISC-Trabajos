// Módulo de red: funciones de fetch hacia la API propia, sin acceso al DOM

// Obtiene la lista de alumnos con filtro opcional de carrera y mide el tiempo de respuesta
async function fetchAlumnos(carrera) {
  const url = carrera
    ? `/api/alumnos?carrera=${encodeURIComponent(carrera)}`
    : '/api/alumnos';

  const inicio = Date.now();
  try {
    const respuesta = await fetch(url);
    const tiempoMs  = Date.now() - inicio;

    if (!respuesta.ok) {
      throw `Error del servidor: ${respuesta.status} ${respuesta.statusText}`;
    }

    const data = await respuesta.json();
    return { data, status: respuesta.status, statusText: respuesta.statusText, url, tiempoMs };
  } catch (err) {
    if (typeof err === 'string') throw err;
    throw 'No se pudo conectar con la API. Verificá que el servidor esté corriendo.';
  }
}

// Obtiene un alumno por ID; devuelve el objeto (o el error 404) sin lanzar excepción en 404
async function fetchAlumnoPorId(id) {
  const url    = `/api/alumnos/${id}`;
  const inicio = Date.now();

  try {
    const respuesta = await fetch(url);
    const tiempoMs  = Date.now() - inicio;
    const data      = await respuesta.json();

    return { data, status: respuesta.status, statusText: respuesta.statusText, url, tiempoMs };
  } catch (err) {
    throw 'No se pudo conectar con la API. Verificá que el servidor esté corriendo.';
  }
}

// Expone las funciones en el objeto global para que app.js pueda invocarlas
window.fetchAlumnos     = fetchAlumnos;
window.fetchAlumnoPorId = fetchAlumnoPorId;
