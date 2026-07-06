// Servicio de palabras: intenta obtener una palabra en español desde una API
// externa y, si falla o la palabra no es válida, usa una lista local de respaldo.
// Decisión: se trabaja con palabras SIN acentos para simplificar la comparación
// durante el juego (categorías variadas: animales, países, frutas, objetos).
// Se priorizan palabras cortas y comunes (3 a 7 letras) para que el juego sea accesible.

const PALABRAS_FALLBACK = [
  // Animales
  'GATO', 'PERRO', 'LEON', 'OSO', 'PATO', 'VACA', 'RANA', 'PEZ',
  // Países
  'PERU', 'CUBA', 'CHILE', 'ITALIA', 'SUIZA',
  // Frutas
  'PERA', 'UVA', 'LIMON', 'MANGO', 'KIWI', 'COCO',
  // Objetos
  'MESA', 'SILLA', 'LLAVE', 'RELOJ', 'LIBRO', 'TAZA'
];

// Quita acentos y pasa a mayúsculas, dejando solo letras A-Z (más la Ñ).
function normalizar(palabra) {
  return palabra
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // elimina las tildes (marcas diacríticas)
    .toUpperCase()
    .replace(/[^A-ZÑ]/g, '');
}

// Valida que la palabra normalizada sea usable en el juego.
// Se limita a 3-8 letras para mantener el juego accesible y descartar
// palabras demasiado largas que a veces devuelve la API externa.
function esValida(palabra) {
  return typeof palabra === 'string' && palabra.length >= 3 && palabra.length <= 8;
}

// Devuelve una palabra aleatoria de la lista de respaldo.
function palabraDeRespaldo() {
  const indice = Math.floor(Math.random() * PALABRAS_FALLBACK.length);
  return PALABRAS_FALLBACK[indice];
}

// Obtiene una palabra: primero intenta la API externa, luego el fallback.
export async function obtenerPalabra() {
  try {
    const respuesta = await fetch('https://random-word-api.herokuapp.com/word?lang=es', {
      signal: AbortSignal.timeout(4000)
    });
    if (!respuesta.ok) throw new Error('Respuesta no válida de la API externa');

    const datos = await respuesta.json();
    const cruda = Array.isArray(datos) ? datos[0] : datos;
    const normalizada = normalizar(String(cruda ?? ''));

    if (esValida(normalizada)) {
      return normalizada;
    }
    // Palabra inválida -> usar respaldo.
    return palabraDeRespaldo();
  } catch (error) {
    console.warn('No se pudo obtener palabra de la API externa, usando respaldo:', error.message);
    return palabraDeRespaldo();
  }
}
