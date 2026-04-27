let letras = ["a", "b", "c", "d", "e", "f"];
let numeros = [10, 20, 30, 40, 50, 60, 70];

function formatearArray(arr) {
  let elementos = arr.map(el => typeof el === 'string' ? `"${el}"` : el).join(", ");
  return `[ ${elementos} ]`;
}

// Devuelve una copia invertida de las letras
function invertirLetras() {
  return [...letras].reverse();
}

// Devuelve una copia invertida de numeros
function invertirNumeros() {
  return [...numeros].reverse();
}

// Devuelve una copia doblemente invertida de numeros
function dobleInversionNumeros() {
  return [...numeros].reverse().reverse();
}

// Recibe un texto y devuelve un array con los pasos de reversion
function invertirTexto(texto) {
  let paso1 = texto.split("");
  let paso2 = [...paso1].reverse();
  let paso3 = paso2.join("");
  return { original: texto, s1: paso1, s2: paso2, res: paso3 };
}

// Esperar a que el DOM este completamente cargado antes de interactuar con el HTML
document.addEventListener('DOMContentLoaded', () => {

  // --- Sub-ejercicio A ---
  // Obtenemos el contenedor donde se mostrara la salida visual
  let salidaA = document.getElementById('salida-a');
  
  // Funcion local de reseteo del array
  function reiniciarA() {
    salidaA.innerHTML = `Array original  ->  ${formatearArray(letras)}\n`;
  }
  // Carga inicial
  reiniciarA();

  // Escuchador que revierte la posicion de cada elemento del array (tail to head)
  document.getElementById('btn-ejecutar-a').addEventListener('click', () => {
    // Solicitamos a funcion externa el clon modificado
    let inv = invertirLetras();
    // Reestructuracion del DOM display
    salidaA.innerHTML = `Array original  ->  ${formatearArray(letras)}\n`;
    salidaA.innerHTML += `Array invertido ->  <span class="texto-acento">${formatearArray(inv)}</span>\n`;
    salidaA.innerHTML += `<span class="texto-advertencia">reverse() modifica el original. Se uso [...letras] para preservarlo.</span>\n`;
  });
  document.getElementById('btn-reiniciar-a').addEventListener('click', reiniciarA);


  // --- Sub-ejercicio B ---
  // Selector DOM block output
  let salidaB = document.getElementById('salida-b');
  
  // Reseteo original display
  function reiniciarB() {
    salidaB.innerHTML = `Array original  ->  ${formatearArray(numeros)}\n`;
  }
  reiniciarB();

  // Escuchador default de Inversion
  document.getElementById('btn-ejecutar-b').addEventListener('click', () => {
    let inv = invertirNumeros();
    salidaB.innerHTML = `Array original  ->  ${formatearArray(numeros)}\n`;
    salidaB.innerHTML += `Array invertido ->  <span class="texto-acento">${formatearArray(inv)}</span>\n`;
  });

  // Escuchador para "Doble Inversion" que demuestra anulacion tecnica
  document.getElementById('btn-ejecutar-b2').addEventListener('click', () => {
    // La anulacion de 2 renders consecutivos en reverse equivale matematicamente a inmutabilidad de index
    let inv = dobleInversionNumeros();
    salidaB.innerHTML = `Array original  ->  ${formatearArray(numeros)}\n`;
    salidaB.innerHTML += `Resultado       ->  <span class="texto-acento">${formatearArray(inv)}</span>\n`;
    salidaB.innerHTML += `<span class="texto-exito">Al invertir dos veces, el array vuelve a su estado original.</span>\n`;
  });
  document.getElementById('btn-reiniciar-b').addEventListener('click', reiniciarB);


  // --- Sub-ejercicio C ---
  // Referencias multiples para captura y validacion de input field
  let salidaC = document.getElementById('salida-c');
  let entradaC = document.getElementById('input-texto');
  
  // Reset del DOM que vacia el textbox explicitamente
  function reiniciarC() {
    entradaC.value = "";
    salidaC.innerHTML = "Esperando texto...\n";
  }
  reiniciarC();

  // Escuchador que parsea string puro, convierte a array, manipula e inyecta de regreso a string
  document.getElementById('btn-ejecutar-c').addEventListener('click', () => {
    let valor = entradaC.value;
    
    // Verificamos que no este vacio antes del procesamiento local
    if (valor.trim() !== "") {
      // Invertimos la cadena de texto a traves de modulo abstracto
      let r = invertirTexto(valor);
      
      // Render de los 4 steps transaccionales (String > Array > Reverse > String)
      salidaC.innerHTML = `Texto original  ->  "${r.original}"\n`;
      salidaC.innerHTML += `split("")       ->  ${formatearArray(r.s1)}\n`;
      salidaC.innerHTML += `reverse()       ->  ${formatearArray(r.s2)}\n`;
      salidaC.innerHTML += `join("")        ->  "${r.res}"\n`;
      salidaC.innerHTML += `Texto invertido ->  <span class="texto-exito">"${r.res}"</span>\n`;
    } else {
      // Condicional preventivo UX
      salidaC.innerHTML = `<span class="texto-advertencia">Escribi un texto antes de invertir.</span>\n`;
    }
  });
  document.getElementById('btn-reiniciar-c').addEventListener('click', reiniciarC);
});
