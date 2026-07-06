// Motor del juego del Ahorcado. Es una clase pura: gestiona el estado del
// juego pero NO toca el DOM. Se expone como global en window.Ahorcado.

class Ahorcado {
  constructor(palabra) {
    this.palabra = String(palabra).toUpperCase();
    this.letrasAdivinadas = new Set(); // letras correctas
    this.letrasFalladas = new Set();   // letras incorrectas
    this.maxIntentos = 6;              // 6 fallos = horca completa
    this.estado = 'jugando';           // 'jugando' | 'ganado' | 'perdido'
  }

  // Intenta adivinar una letra. Devuelve true si acierta, false si falla.
  // Ignora letras ya usadas o si el juego terminó.
  adivinarLetra(letra) {
    const l = String(letra).toUpperCase();

    if (this.estado !== 'jugando') return false;
    if (this.letrasAdivinadas.has(l) || this.letrasFalladas.has(l)) return false;

    const acierto = this.palabra.includes(l);
    if (acierto) {
      this.letrasAdivinadas.add(l);
    } else {
      this.letrasFalladas.add(l);
    }

    // Actualiza el estado del juego tras el intento.
    if (this.estaGanado()) {
      this.estado = 'ganado';
    } else if (this.estaPerdido()) {
      this.estado = 'perdido';
    }

    return acierto;
  }

  // Número de intentos fallados hasta ahora.
  intentosFallados() {
    return this.letrasFalladas.size;
  }

  // Intentos que le quedan al jugador.
  intentosRestantes() {
    return this.maxIntentos - this.letrasFalladas.size;
  }

  // ¿Ya adivinó todas las letras de la palabra?
  estaGanado() {
    for (const caracter of this.palabra) {
      if (!this.letrasAdivinadas.has(caracter)) return false;
    }
    return true;
  }

  // ¿Se quedó sin intentos?
  estaPerdido() {
    return this.letrasFalladas.size >= this.maxIntentos;
  }

  // Devuelve la palabra con guiones bajos en las letras no adivinadas.
  // Ejemplo: "_ A _ A".
  obtenerProgreso() {
    return this.palabra
      .split('')
      .map((caracter) => (this.letrasAdivinadas.has(caracter) ? caracter : '_'))
      .join(' ');
  }
}

window.Ahorcado = Ahorcado;
