// timeModule.js - Funciones de tiempo y fecha

// Devuelve la hora actual en formato HH:MM:SS
function getCurrentTime() {
  const ahora = new Date();
  const h = String(ahora.getHours()).padStart(2, '0');
  const m = String(ahora.getMinutes()).padStart(2, '0');
  const s = String(ahora.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// Devuelve la fecha actual en formato DD/MM/AAAA
function getCurrentDate() {
  const ahora = new Date();
  const dia = String(ahora.getDate()).padStart(2, '0');
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const anio = ahora.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

// Devuelve la marca de tiempo ISO
function getTimestamp() {
  return new Date().toISOString();
}

// Devuelve el día de la semana en español
function getDayOfWeek() {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[new Date().getDay()];
}

// Devuelve los segundos transcurridos desde una fecha dada
function getElapsedSeconds(startDate) {
  return Math.floor((Date.now() - startDate.getTime()) / 1000);
}

module.exports = { getCurrentTime, getCurrentDate, getTimestamp, getDayOfWeek, getElapsedSeconds };
