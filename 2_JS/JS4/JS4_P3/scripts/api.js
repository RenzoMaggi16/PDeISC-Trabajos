// Módulo de red: única función que realiza el fetch a la API, sin acceso al DOM

const API_URL = 'https://jsonplaceholder.typicode.com/users';

// Obtiene todos los usuarios desde la API y devuelve el array parseado
async function obtenerUsuarios() {
  try {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw `Error del servidor: ${respuesta.status} ${respuesta.statusText}`;
    }

    return await respuesta.json();
  } catch (err) {
    if (typeof err === 'string') throw err;
    throw 'No se pudo conectar con la API. Verificá tu conexión a internet.';
  }
}

// Expone la función en el objeto global para que app.js pueda invocarla
window.obtenerUsuarios = obtenerUsuarios;
