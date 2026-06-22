// Función pura: envía un POST a JSONPlaceholder usando la API fetch nativa del browser

const FETCH_API_URL = 'https://jsonplaceholder.typicode.com/users';

// Envía los datos del usuario vía fetch y devuelve un objeto normalizado
async function postConFetch(nombre, email) {
  try {
    const respuesta = await fetch(FETCH_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email }),
    });

    if (!respuesta.ok) {
      throw `Error del servidor: ${respuesta.status} ${respuesta.statusText}`;
    }

    const datos = await respuesta.json();

    return {
      id:         datos.id,
      nombre:     datos.nombre,
      email:      datos.email,
      status:     respuesta.status,
      statusText: respuesta.statusText,
      payload:    datos,
    };
  } catch (err) {
    // Re-lanza strings propios; convierte errores de red en mensaje en español
    if (typeof err === 'string') throw err;
    throw 'No se pudo conectar con el servidor. Verificá tu conexión a internet.';
  }
}

// Expone la función en el objeto global para que formulario.js pueda invocarla
window.postConFetch = postConFetch;
