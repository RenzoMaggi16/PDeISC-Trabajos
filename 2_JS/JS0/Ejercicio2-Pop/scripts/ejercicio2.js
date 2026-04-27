let animales = ["perro", "gato", "conejo", "loro"];
let compras = ["leche", "pan", "arroz", "jabon", "cafe"];
let pila = ["A", "B", "C", "D", "E", "F"];

function formatearArray(arr) {
  let elementos = arr.map(el => typeof el === 'string' ? `"${el}"` : el).join(", ");
  return `[ ${elementos} ]`;
}

// Elimina el ultimo animal y lo devuelve
function quitarAnimal() {
  let eliminado = animales.pop();
  return { eliminado, arr: [...animales] };
}

// Elimina el ultimo producto y lo devuelve
function quitarProducto() {
  let quitado = compras.pop();
  return { quitado, arr: [...compras] };
}

// Elimina el ultimo elemento de la pila y lo devuelve
function quitarDePila() {
  let sacado = pila.pop();
  return sacado;
}

// Esperar a que el DOM este completamente cargado antes de interactuar con el HTML
document.addEventListener('DOMContentLoaded', () => {

  // --- Sub-ejercicio A ---
  // Obtenemos el contenedor donde se mostrara la salida visual
  let salidaA = document.getElementById('salida-a');
  
  // Funcion para reiniciar el estado del sub-ejercicio a sus valores originales
  function reiniciarA() {
    animales = ["perro", "gato", "conejo", "loro"];
    salidaA.innerHTML = `Array original   ->  ${formatearArray(animales)}\n`;
  }
  // Llamada inicial para mostrar el estado original apenas carga la pagina
  reiniciarA();

  // Escuchador del boton para ejecutar la logica principal del metodo
  document.getElementById('btn-ejecutar-a').addEventListener('click', () => {
    if (animales.length > 0) {
      // Llamamos a la funcion pura y guardamos el resultado
      let res = quitarAnimal();
      // Inyectamos el resultado en el HTML
      salidaA.innerHTML += `Elemento quitado ->  <span class="texto-error">"${res.eliminado}"</span>\n`;
      salidaA.innerHTML += `Array resultante ->  <span class="texto-acento">${formatearArray(res.arr)}</span>\n\n`;
    }
  });
  // Escuchador del boton de reinicio para limpiar los datos y la pantalla
  document.getElementById('btn-reiniciar-a').addEventListener('click', reiniciarA);


  // --- Sub-ejercicio B ---
  // Referencia a la salida visual
  let salidaB = document.getElementById('salida-b');

  // Funcion de reinicio del estado original
  function reiniciarB() {
    compras = ["leche", "pan", "arroz", "jabon", "cafe"];
    salidaB.innerHTML = `Array original   ->  ${formatearArray(compras)}\n`;
  }
  reiniciarB();

  // Escuchador del boton de ejecucion
  document.getElementById('btn-ejecutar-b').addEventListener('click', () => {
    if (compras.length > 0) {
      // Modificamos datos mediante la logica desacoplada
      let res = quitarProducto();
      // Renderizamos la respuesta formateada
      salidaB.innerHTML += `Quitado: "${res.quitado}"  ->  <span class="texto-acento">${formatearArray(res.arr)}</span>\n`;
    }
  });
  document.getElementById('btn-reiniciar-b').addEventListener('click', reiniciarB);


  // --- Sub-ejercicio C ---
  // Referencia a la salida visual
  let salidaC = document.getElementById('salida-c');

  // Funcion para reiniciar la pila a su estado inicial
  function reiniciarC() {
    pila = ["A", "B", "C", "D", "E", "F"];
    salidaC.innerHTML = `Array original   ->  ${formatearArray(pila)}\n`;
  }
  reiniciarC();

  // Escuchador que lanza un bucle simulado utilizando DOM updates
  document.getElementById('btn-ejecutar-c').addEventListener('click', () => {
    salidaC.innerHTML = `Vaciando: ${formatearArray(pila)}\n`;
    // Bucle while para vaciar usando pop()
    while (pila.length > 0) {
      let quitado = quitarDePila();
      // Imprime el proceso paso a paso
      salidaC.innerHTML += `Eliminado: <span class="texto-error">"${quitado}"</span>\n`;
    }
    salidaC.innerHTML += `<span class="texto-exito">El array esta vacio.</span>\n`;
  });
  document.getElementById('btn-reiniciar-c').addEventListener('click', reiniciarC);
});
