let nombres = ["Ana", "Bruno", "Carla", "Diego", "Elena"];
let numeros = [3, 7, 12, 25, 40];
let personas = [
  { nombre: "Lucia",   edad: 22 },
  { nombre: "Marcos",  edad: 35 },
  { nombre: "Valeria", edad: 28 },
  { nombre: "Tomas",   edad: 19 }
];

function formatearArray(arr) {
  let elementos = arr.map(el => typeof el === 'string' ? `"${el}"` : JSON.stringify(el)).join(", ");
  return `[ ${elementos} ]`;
}

// Retorna un array con los saludos para imprimir
function procesarSaludos() {
  let mensajes = [];
  nombres.forEach(nombre => {
    mensajes.push(`Hola, <span class="texto-acento">${nombre}</span>!`);
  });
  return mensajes;
}

// Retorna un array de strings con los dobles
function procesarDobles() {
  let resultados = [];
  numeros.forEach(num => {
    resultados.push(`${num}  ->  doble: ${num * 2}`);
  });
  return resultados;
}

// Retorna un array formateando a las personas
function procesarPersonas() {
  let lineas = [];
  personas.forEach(p => {
    lineas.push(`<span class="texto-acento">${p.nombre}</span> — ${p.edad} anos`);
  });
  return lineas;
}

// Esperar a que el DOM este completamente cargado antes de interactuar con el HTML
document.addEventListener('DOMContentLoaded', () => {

  // --- Sub-ejercicio A ---
  // Obtenemos el contenedor donde se mostrara la salida visual
  let salidaA = document.getElementById('salida-a');
  
  // Funcion para reiniciar el estado de la salida visual
  function reiniciarA() {
    salidaA.innerHTML = `Nombres: ${formatearArray(nombres)}\n`;
  }
  // Llamada inicial
  reiniciarA();

  // Escuchador del boton para ejecutar la logica
  document.getElementById('btn-ejecutar-a').addEventListener('click', () => {
    // Limpiamos salida previa
    salidaA.innerHTML = "";
    // Obtenemos todos los mensajes iterados desde logica
    let mensajes = procesarSaludos();
    // Inyectamos secuencialmente en DOM
    mensajes.forEach(msg => {
      salidaA.innerHTML += `${msg}\n`;
    });
  });
  // Restaurar el bloque DOM
  document.getElementById('btn-reiniciar-a').addEventListener('click', reiniciarA);


  // --- Sub-ejercicio B ---
  // Referencia a DOM element
  let salidaB = document.getElementById('salida-b');
  
  // Limpieza inicial UI
  function reiniciarB() {
    salidaB.innerHTML = `Numeros: ${formatearArray(numeros)}\n`;
  }
  reiniciarB();

  // Disparador
  document.getElementById('btn-ejecutar-b').addEventListener('click', () => {
    salidaB.innerHTML = "";
    // Procesamos todos los dobles de numeros a una lista segura
    let resultados = procesarDobles();
    // Render
    resultados.forEach(res => {
      salidaB.innerHTML += `${res}\n`;
    });
    salidaB.innerHTML += `\n<span class="texto-advertencia">forEach() no devuelve un nuevo array. Para eso se usa map().</span>\n`;
  });
  document.getElementById('btn-reiniciar-b').addEventListener('click', reiniciarB);


  // --- Sub-ejercicio C ---
  // Salida visual apuntada
  let salidaC = document.getElementById('salida-c');
  
  // Reseteo visual
  function reiniciarC() {
    salidaC.innerHTML = `Presiona mostrar personas...\n`;
  }
  reiniciarC();

  // Escuchador que recupera y muestra el mapeo de la DB simulada (array personas)
  document.getElementById('btn-ejecutar-c').addEventListener('click', () => {
    salidaC.innerHTML = "";
    // Llamado seguro a logica backend (sin HTML DOM calls directas ahi)
    let lineas = procesarPersonas();
    // Append al buffer visible HTML
    lineas.forEach(linea => {
      salidaC.innerHTML += `${linea}\n`;
    });
  });
  document.getElementById('btn-reiniciar-c').addEventListener('click', reiniciarC);
});
