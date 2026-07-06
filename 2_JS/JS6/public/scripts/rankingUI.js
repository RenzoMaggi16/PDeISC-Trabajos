// Gestiona el leaderboard: hace UNA sola petición POST /api/score/ranking,
// guarda el resultado en memoria (cache) y renderiza la tabla desde ahí.

let rankingCache = null; // se llena una vez y se reutiliza

// Formatea segundos a mm:ss.
function formatearTiempo(segundos) {
  const min = String(Math.floor(segundos / 60)).padStart(2, '0');
  const seg = String(segundos % 60).padStart(2, '0');
  return `${min}:${seg}`;
}

// Formatea la fecha (viene como string ISO desde MySQL/JSON).
function formatearFecha(fecha) {
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return fecha;
  return d.toLocaleString('es-ES');
}

// Pinta la tabla a partir de la cache en memoria.
function renderizarRanking() {
  const cuerpo = document.querySelector('#tablaRankingBody');
  const vacio = document.querySelector('#rankingVacio');
  if (!cuerpo) return;

  cuerpo.innerHTML = '';

  if (!rankingCache || rankingCache.length === 0) {
    if (vacio) vacio.classList.remove('d-none');
    return;
  }
  if (vacio) vacio.classList.add('d-none');

  rankingCache.forEach((registro, indice) => {
    const fila = document.createElement('tr');

    const posicion = document.createElement('td');
    posicion.textContent = indice + 1;

    const nombre = document.createElement('td');
    nombre.textContent = registro.nombre;

    const puntos = document.createElement('td');
    puntos.textContent = registro.puntos;

    const tiempo = document.createElement('td');
    tiempo.textContent = formatearTiempo(registro.tiempo);

    const fecha = document.createElement('td');
    fecha.textContent = formatearFecha(registro.fecha);

    fila.append(posicion, nombre, puntos, tiempo, fecha);
    cuerpo.appendChild(fila);
  });
}

// Descarga el ranking desde el backend (una sola vez salvo forzar recarga).
async function cargarRanking(forzar = false) {
  if (rankingCache && !forzar) {
    renderizarRanking();
    return;
  }

  try {
    const respuesta = await fetch('/api/score/ranking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const datos = await respuesta.json();

    if (!respuesta.ok || !datos.ok) {
      throw new Error(datos.mensaje || 'Error al obtener el ranking.');
    }

    rankingCache = datos.ranking;
    renderizarRanking();
  } catch (error) {
    console.error('Error al cargar el ranking:', error.message);
    const vacio = document.querySelector('#rankingVacio');
    if (vacio) {
      vacio.textContent = 'No se pudo cargar el ranking. ¿Está la base de datos conectada?';
      vacio.classList.remove('d-none');
    }
  }
}

// Invalida la cache para forzar una recarga tras guardar un puntaje nuevo.
function invalidarRanking() {
  rankingCache = null;
}

window.rankingUI = { cargarRanking, invalidarRanking };
