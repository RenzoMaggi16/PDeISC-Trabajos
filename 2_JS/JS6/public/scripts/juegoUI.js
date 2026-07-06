// Orquestador del juego: conecta el motor (Ahorcado), el dibujo, el teclado,
// el temporizador, el modal de resultado y el guardado del puntaje.

document.addEventListener('DOMContentLoaded', () => {
  // --- Referencias del DOM ---
  const pantallaInicio = document.querySelector('#pantallaInicio');
  const areaJuego = document.querySelector('#areaJuego');
  const btnIniciarJuego = document.querySelector('#btnIniciarJuego');
  const contenedorDibujo = document.querySelector('#contenedorDibujo');
  const progresoEl = document.querySelector('#progreso');
  const tecladoEl = document.querySelector('#teclado');
  const intentosEl = document.querySelector('#intentosRestantes');
  const timerEl = document.querySelector('#temporizador');
  const btnReiniciar = document.querySelector('#btnReiniciar');
  const mensajeEstadoEl = document.querySelector('#mensajeEstado');

  // Modal de resultado.
  const modalEl = document.querySelector('#modalResultado');
  const modalResultado = new bootstrap.Modal(modalEl);
  const modalTitulo = document.querySelector('#modalTitulo');
  const modalCuerpo = document.querySelector('#modalCuerpo');
  const inputNombre = document.querySelector('#inputNombre');
  const errorNombre = document.querySelector('#errorNombre');
  const btnGuardar = document.querySelector('#btnGuardar');
  const btnDescargarPdf = document.querySelector('#btnDescargarPdf');
  const btnJugarDeNuevo = document.querySelector('#btnJugarDeNuevo');
  const zonaGuardar = document.querySelector('#zonaGuardar');
  const avisoGuardado = document.querySelector('#avisoGuardado');

  const LETRAS = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

  // --- Estado de la partida ---
  let juego = null;
  let segundos = 0;
  let intervaloTimer = null;
  let ultimaPartida = null; // datos para guardar/exportar

  // Formatea segundos a mm:ss.
  function formatearTiempo(total) {
    const min = String(Math.floor(total / 60)).padStart(2, '0');
    const seg = String(total % 60).padStart(2, '0');
    return `${min}:${seg}`;
  }

  // Calcula los puntos según la fórmula documentada:
  // puntos = max(0, 100 - fallos*10 - floor(tiempo/5)).
  function calcularPuntos(fallos, tiempoSegundos) {
    const puntos = 100 - fallos * 10 - Math.floor(tiempoSegundos / 5);
    return Math.max(0, puntos);
  }

  // --- Temporizador ---
  function iniciarTimer() {
    detenerTimer();
    segundos = 0;
    timerEl.textContent = formatearTiempo(segundos);
    intervaloTimer = setInterval(() => {
      segundos += 1;
      timerEl.textContent = formatearTiempo(segundos);
    }, 1000);
  }

  function detenerTimer() {
    if (intervaloTimer) {
      clearInterval(intervaloTimer);
      intervaloTimer = null;
    }
  }

  // --- Teclado en pantalla ---
  function crearTeclado() {
    tecladoEl.innerHTML = '';
    LETRAS.forEach((letra) => {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'btn btn-outline-primary tecla';
      boton.textContent = letra;
      boton.dataset.letra = letra;
      boton.addEventListener('click', () => jugarLetra(letra));
      tecladoEl.appendChild(boton);
    });
  }

  // Marca una tecla como usada (acierto/fallo) y la deshabilita.
  function marcarTecla(letra, acierto) {
    const boton = tecladoEl.querySelector(`[data-letra="${letra}"]`);
    if (!boton) return;
    boton.disabled = true;
    boton.classList.remove('btn-outline-primary');
    boton.classList.add(acierto ? 'btn-success' : 'btn-danger');
  }

  // --- Render del estado actual ---
  function renderizar() {
    progresoEl.textContent = juego.obtenerProgreso();
    intentosEl.textContent = juego.intentosRestantes();
    window.dibujoAhorcado.actualizarDibujo(contenedorDibujo, juego.intentosFallados());
  }

  // Procesa un intento de letra (desde clic o teclado físico).
  function jugarLetra(letra) {
    if (!juego || juego.estado !== 'jugando') return;
    const l = letra.toUpperCase();
    if (!LETRAS.includes(l)) return;

    // Evita re-procesar letras ya usadas.
    if (juego.letrasAdivinadas.has(l) || juego.letrasFalladas.has(l)) return;

    const acierto = juego.adivinarLetra(l);
    marcarTecla(l, acierto);
    renderizar();

    if (juego.estado !== 'jugando') {
      finalizarPartida();
    }
  }

  // --- Fin de partida ---
  function finalizarPartida() {
    detenerTimer();
    const gano = juego.estado === 'ganado';
    const fallos = juego.intentosFallados();
    const puntos = gano ? calcularPuntos(fallos, segundos) : 0;

    ultimaPartida = {
      puntos,
      tiempo: segundos,
      fecha: new Date().toLocaleString('es-ES')
    };

    // Configura el modal.
    modalTitulo.textContent = gano ? '¡Ganaste! 🎉' : 'Perdiste 😞';
    modalCuerpo.innerHTML = gano
      ? `Adivinaste la palabra <strong>${juego.palabra}</strong>.<br>
         Tiempo: <strong>${formatearTiempo(segundos)}</strong> ·
         Puntos: <strong>${puntos}</strong>`
      : `La palabra era <strong>${juego.palabra}</strong>.<br>
         ¡Sigue intentándolo!`;

    // Solo se puede guardar puntaje si ganó.
    if (gano) {
      zonaGuardar.classList.remove('d-none');
    } else {
      zonaGuardar.classList.add('d-none');
    }
    avisoGuardado.classList.add('d-none');
    errorNombre.classList.add('d-none');
    inputNombre.value = '';
    btnGuardar.disabled = false;

    modalResultado.show();
  }

  // Guarda el puntaje en el backend (POST). Valida el nombre en JS.
  async function guardarPuntaje() {
    const nombre = inputNombre.value.trim();

    if (nombre === '') {
      errorNombre.textContent = 'El nombre no puede estar vacío.';
      errorNombre.classList.remove('d-none');
      return;
    }
    if (nombre.length > 50) {
      errorNombre.textContent = 'El nombre no puede superar los 50 caracteres.';
      errorNombre.classList.remove('d-none');
      return;
    }
    errorNombre.classList.add('d-none');
    btnGuardar.disabled = true;

    try {
      const respuesta = await fetch('/api/score/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          puntos: ultimaPartida.puntos,
          tiempo: ultimaPartida.tiempo
        })
      });
      const datos = await respuesta.json();

      if (!respuesta.ok || !datos.ok) {
        throw new Error(datos.mensaje || 'Error al guardar el puntaje.');
      }

      // Guarda el nombre para el PDF y refresca el ranking.
      ultimaPartida.nombre = nombre;
      avisoGuardado.textContent = 'Puntaje guardado correctamente.';
      avisoGuardado.classList.remove('alert-danger');
      avisoGuardado.classList.add('alert-success');
      avisoGuardado.classList.remove('d-none');
      zonaGuardar.classList.add('d-none');

      window.rankingUI.invalidarRanking();
      window.rankingUI.cargarRanking(true);
    } catch (error) {
      btnGuardar.disabled = false;
      avisoGuardado.textContent = error.message;
      avisoGuardado.classList.remove('alert-success');
      avisoGuardado.classList.add('alert-danger');
      avisoGuardado.classList.remove('d-none');
    }
  }

  // Genera el PDF del resultado (usa el nombre escrito, o "Anónimo").
  function descargarPdf() {
    const datos = {
      nombre: (ultimaPartida.nombre || inputNombre.value.trim() || 'Anónimo'),
      puntos: ultimaPartida.puntos,
      tiempo: ultimaPartida.tiempo,
      fecha: ultimaPartida.fecha
    };
    window.exportarPdf.descargarPdf(datos);
  }

  // Muestra el área de juego y oculta la pantalla de inicio, luego arranca la partida.
  function iniciarJuego() {
    pantallaInicio.classList.add('d-none');
    areaJuego.classList.remove('d-none');
    nuevaPartida();
  }

  // --- Inicio / reinicio de partida ---
  async function nuevaPartida() {
    mensajeEstadoEl.textContent = 'Cargando palabra...';
    tecladoEl.innerHTML = '';
    progresoEl.textContent = '';
    window.dibujoAhorcado.inicializarDibujo(contenedorDibujo);

    try {
      const palabra = await window.palabraApi.obtenerPalabra();
      juego = new window.Ahorcado(palabra);
      crearTeclado();
      renderizar();
      iniciarTimer();
      mensajeEstadoEl.textContent = '¡Adivina la palabra!';
    } catch (error) {
      console.error(error);
      mensajeEstadoEl.textContent = 'No se pudo cargar la palabra. Reintenta.';
    }
  }

  // --- Eventos ---
  btnIniciarJuego.addEventListener('click', iniciarJuego);
  btnReiniciar.addEventListener('click', nuevaPartida);
  btnGuardar.addEventListener('click', guardarPuntaje);
  btnDescargarPdf.addEventListener('click', descargarPdf);
  btnJugarDeNuevo.addEventListener('click', () => {
    modalResultado.hide();
    nuevaPartida();
  });

  // Teclado físico.
  document.addEventListener('keydown', (evento) => {
    const letra = evento.key.toUpperCase();
    if (LETRAS.includes(letra)) {
      jugarLetra(letra);
    }
  });

  // Cierra el menú hamburguesa al hacer clic en un enlace (móvil).
  document.querySelectorAll('.nav-link').forEach((enlace) => {
    enlace.addEventListener('click', () => {
      const navbar = document.querySelector('#navbarPrincipal');
      if (navbar && navbar.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(navbar).hide();
      }
    });
  });

  // Arranque inicial: solo se carga el ranking. El juego y el temporizador
  // arrancan cuando el jugador presiona "Iniciar juego".
  window.rankingUI.cargarRanking();
});
