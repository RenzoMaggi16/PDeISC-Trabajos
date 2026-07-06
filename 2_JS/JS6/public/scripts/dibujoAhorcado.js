// Dibuja la figura del ahorcado de forma progresiva usando un SVG.
// Se crea el patíbulo completo una sola vez y se van mostrando las partes
// del cuerpo según la cantidad de intentos fallados (de 0 a 6).
// Arte de líneas original y simple (sin personajes con derechos de autor).

// Orden en que aparecen las partes del cuerpo (una por cada fallo).
const PARTES = ['cabeza', 'cuerpo', 'brazoIzq', 'brazoDer', 'piernaIzq', 'piernaDer'];

// Genera el markup SVG con todas las partes ocultas por defecto.
function crearSvg() {
  return `
    <svg viewBox="0 0 200 220" class="dibujo-ahorcado" role="img" aria-label="Figura del ahorcado">
      <!-- Patíbulo (siempre visible) -->
      <line x1="20" y1="210" x2="120" y2="210" class="palo" />
      <line x1="60" y1="210" x2="60" y2="20" class="palo" />
      <line x1="60" y1="20" x2="140" y2="20" class="palo" />
      <line x1="140" y1="20" x2="140" y2="45" class="palo" />

      <!-- Partes del cuerpo (se muestran al fallar) -->
      <circle id="cabeza" cx="140" cy="60" r="15" class="parte" />
      <line id="cuerpo" x1="140" y1="75" x2="140" y2="140" class="parte" />
      <line id="brazoIzq" x1="140" y1="90" x2="115" y2="120" class="parte" />
      <line id="brazoDer" x1="140" y1="90" x2="165" y2="120" class="parte" />
      <line id="piernaIzq" x1="140" y1="140" x2="120" y2="180" class="parte" />
      <line id="piernaDer" x1="140" y1="140" x2="160" y2="180" class="parte" />
    </svg>
  `;
}

// Inserta el SVG dentro del contenedor indicado.
function inicializarDibujo(contenedor) {
  contenedor.innerHTML = crearSvg();
}

// Muestra las partes del cuerpo correspondientes a los intentos fallados.
function actualizarDibujo(contenedor, intentosFallados) {
  PARTES.forEach((parte, indice) => {
    const elemento = contenedor.querySelector(`#${parte}`);
    if (!elemento) return;
    if (indice < intentosFallados) {
      elemento.classList.add('visible');
    } else {
      elemento.classList.remove('visible');
    }
  });
}

window.dibujoAhorcado = { inicializarDibujo, actualizarDibujo };
