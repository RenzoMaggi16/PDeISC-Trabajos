// Función pura: envía un POST a JSONPlaceholder usando axios (cargado vía CDN)

const AXIOS_API_URL = 'https://jsonplaceholder.typicode.com/users';

// Envía los datos del usuario vía axios y devuelve un objeto normalizado
async function postConAxios(nombre, email) {
  try {
    const respuesta = await axios.post(AXIOS_API_URL, { nombre, email });

    // axios retorna los datos directamente en respuesta.data
    const datos = respuesta.data;

    return {
      id:         datos.id,
      nombre:     datos.nombre,
      email:      datos.email,
      status:     respuesta.status,
      statusText: respuesta.statusText,
      payload:    datos,
    };
  } catch (err) {
    // axios adjunta detalles del error en err.response
    if (err.response) {
      throw `Error del servidor: ${err.response.status} ${err.response.statusText}`;
    }
    throw 'No se pudo conectar con el servidor. Verificá tu conexión a internet.';
  }
}

// Expone la función en el objeto global para que formulario.js pueda invocarla
window.postConAxios = postConAxios;
