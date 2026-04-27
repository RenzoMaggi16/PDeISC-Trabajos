let numeros = [10, 20, 30, 40, 50, 60];
let peliculas = ["Inception", "Matrix", "Interstellar", "Dune", "Avatar", "Oppenheimer"];
let colores = ["rojo", "verde", "azul", "amarillo", "naranja", "violeta"];

function formatearArray(arr) {
  let elementos = arr.map(el => typeof el === 'string' ? `"${el}"` : el).join(", ");
  return `[ ${elementos} ]`;
}

// Copia los primeros 3 numeros
function copiarPrimerosTres() {
  return numeros.slice(0, 3);
}

// Copia del indice 2 al 4 (indice 5 excluido)
function copiarPeliculas() {
  return peliculas.slice(2, 5);
}

// Copia los ultimos 3 elementos usando indice negativo
function copiarUltimosTres() {
  return colores.slice(-3);
}

// Esperar a que el DOM este completamente cargado antes de interactuar con el HTML
document.addEventListener('DOMContentLoaded', () => {

  // --- Sub-ejercicio A ---
  // Obtenemos el contenedor donde se mostrara la salida visual
  let salidaA = document.getElementById('salida-a');
  
  // Funcion para reiniciar el estado visual a sus valores iniciales
  function reiniciarA() {
    salidaA.innerHTML = `Array original   ->  ${formatearArray(numeros)}\n`;
  }
  reiniciarA();

  // Escuchador para obtener el slice(0, 3)
  document.getElementById('btn-ejecutar-a').addEventListener('click', () => {
    // Obtenemos la subcopia del array
    let copia = copiarPrimerosTres();
    // Renderizamos los resultados preservando la estructura del string
    salidaA.innerHTML = `Array original   ->  ${formatearArray(numeros)}\n`;
    salidaA.innerHTML += `Copia obtenida   ->  <span class="texto-acento">${formatearArray(copia)}</span>\n`;
    salidaA.innerHTML += `Original sin cambios ->  ${formatearArray(numeros)}\n`;
  });
  document.getElementById('btn-reiniciar-a').addEventListener('click', reiniciarA);


  // --- Sub-ejercicio B ---
  // Referencias al elemento HTML de salida
  let salidaB = document.getElementById('salida-b');
  
  // Reseteo visual
  function reiniciarB() {
    salidaB.innerHTML = `Array original   ->  ${formatearArray(peliculas)}\n`;
  }
  reiniciarB();

  // Ejecucion de slice(2, 5)
  document.getElementById('btn-ejecutar-b').addEventListener('click', () => {
    // Solicitamos la extraccion pura
    let copia = copiarPeliculas();
    // Construimos la interfaz de usuario con la respuesta
    salidaB.innerHTML = `Array original   ->  ${formatearArray(peliculas)}\n`;
    salidaB.innerHTML += `Copia obtenida   ->  <span class="texto-acento">${formatearArray(copia)}</span>\n`;
    salidaB.innerHTML += `<span class="texto-advertencia">Nota: El indice 5 ("Oppenheimer") no se incluye.</span>\n`;
  });
  document.getElementById('btn-reiniciar-b').addEventListener('click', reiniciarB);


  // --- Sub-ejercicio C ---
  // Capturamos el area de salida
  let salidaC = document.getElementById('salida-c');
  
  // Vaciamos e inicializamos
  function reiniciarC() {
    salidaC.innerHTML = `Array original   ->  ${formatearArray(colores)}\n`;
  }
  reiniciarC();

  // Evento para slice(-3)
  document.getElementById('btn-ejecutar-c').addEventListener('click', () => {
    // Generamos la copia invertida desde funcion externa
    let copia = copiarUltimosTres();
    // Integramos al bloque de texto con estilos CSS adecuados
    salidaC.innerHTML = `Array original   ->  ${formatearArray(colores)}\n`;
    salidaC.innerHTML += `Ultimos 3 elems  ->  <span class="texto-acento">${formatearArray(copia)}</span>\n`;
    salidaC.innerHTML += `Original sin cambios ->  ${formatearArray(colores)}\n`;
    salidaC.innerHTML += `<span class="texto-exito">slice(-3) toma los ultimos 3 elementos usando indice negativo.</span>\n`;
  });
  document.getElementById('btn-reiniciar-c').addEventListener('click', reiniciarC);
});
