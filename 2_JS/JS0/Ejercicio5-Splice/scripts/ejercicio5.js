let letras = ["a", "b", "c", "d", "e"];
let nombres = ["Ana", "Carlos", "Elena"];
let frutas = ["Manzana", "Naranja", "Pera", "Uva", "Kiwi"];

function formatearArray(arr) {
  let elementos = arr.map(el => typeof el === 'string' ? `"${el}"` : el).join(", ");
  return `[ ${elementos} ]`;
}

// Elimina 2 elementos desde el indice 1
function eliminarLetras() {
  let eliminados = letras.splice(1, 2);
  return { eliminados, arr: [...letras] };
}

// Inserta "Beatriz" en el indice 1 sin eliminar nada
function insertarNombre() {
  nombres.splice(1, 0, "Beatriz");
  return [...nombres];
}

// Elimina 2 elementos desde el indice 2 y los reemplaza por otros
function reemplazarFrutas() {
  let eliminados = frutas.splice(2, 2, "Mango", "Durazno");
  return { eliminados, arr: [...frutas] };
}

// Esperar a que el DOM este completamente cargado antes de interactuar con el HTML
document.addEventListener('DOMContentLoaded', () => {

  // --- Sub-ejercicio A ---
  // Obtenemos el contenedor donde se mostrara la salida visual
  let salidaA = document.getElementById('salida-a');
  
  // Funcion para reiniciar el estado a sus valores originales
  function reiniciarA() {
    letras = ["a", "b", "c", "d", "e"];
    salidaA.innerHTML = "";
  }
  reiniciarA();

  // Escuchador del boton de ejecucion
  document.getElementById('btn-ejecutar-a').addEventListener('click', () => {
    salidaA.innerHTML = `Array original   ->  ${formatearArray(letras)}\n`;
    // Llamada a la funcion logica pura
    let res = eliminarLetras();
    // Modificacion visual reflejando los eliminados y el resultante
    salidaA.innerHTML += `Eliminados       ->  <span class="texto-error">${formatearArray(res.eliminados)}</span>\n`;
    salidaA.innerHTML += `Array resultante ->  <span class="texto-acento">${formatearArray(res.arr)}</span>\n`;
  });
  document.getElementById('btn-reiniciar-a').addEventListener('click', reiniciarA);


  // --- Sub-ejercicio B ---
  // Obtenemos la referencia visual
  let salidaB = document.getElementById('salida-b');
  
  // Reiniciamos los datos y la pantalla
  function reiniciarB() {
    nombres = ["Ana", "Carlos", "Elena"];
    salidaB.innerHTML = "";
  }
  reiniciarB();

  // Escuchador del evento de insercion
  document.getElementById('btn-ejecutar-b').addEventListener('click', () => {
    salidaB.innerHTML = `Array original   ->  ${formatearArray(nombres)}\n`;
    // Ejecuta insercion pura
    let res = insertarNombre();
    // Inyecta el resultado
    salidaB.innerHTML += `Array resultante ->  <span class="texto-acento">${formatearArray(res)}</span>\n`;
    salidaB.innerHTML += `<span class="texto-exito">Insertado: "Beatriz" en posicion 1</span>\n`;
  });
  document.getElementById('btn-reiniciar-b').addEventListener('click', reiniciarB);


  // --- Sub-ejercicio C ---
  // Obtenemos contenedor de salida
  let salidaC = document.getElementById('salida-c');
  
  // Reseteo inicial de datos y UI
  function reiniciarC() {
    frutas = ["Manzana", "Naranja", "Pera", "Uva", "Kiwi"];
    salidaC.innerHTML = "";
  }
  reiniciarC();

  // Escuchador del boton para reemplazar datos
  document.getElementById('btn-ejecutar-c').addEventListener('click', () => {
    salidaC.innerHTML = `Array original  ->  ${formatearArray(frutas)}\n`;
    // Extrae la respuesta de la funcion sin DOM
    let res = reemplazarFrutas();
    // Formatea los elementos y actualiza el HTML
    salidaC.innerHTML += `Eliminados      ->  <span class="texto-error">${formatearArray(res.eliminados)}</span>\n`;
    salidaC.innerHTML += `Insertados      ->  <span class="texto-exito">[ "Mango", "Durazno" ]</span>\n`;
    salidaC.innerHTML += `Array final     ->  <span class="texto-acento">${formatearArray(res.arr)}</span>\n`;
  });
  document.getElementById('btn-reiniciar-c').addEventListener('click', reiniciarC);
});
