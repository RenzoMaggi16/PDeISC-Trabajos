// Obtiene una palabra desde el backend (que a su vez consulta la API externa
// con su lista de respaldo). Se usa POST por la restricción del proyecto.

async function obtenerPalabra() {
  const respuesta = await fetch('/api/palabra', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });

  if (!respuesta.ok) {
    throw new Error('No se pudo obtener la palabra del servidor.');
  }

  const datos = await respuesta.json();
  return datos.palabra;
}

window.palabraApi = { obtenerPalabra };
