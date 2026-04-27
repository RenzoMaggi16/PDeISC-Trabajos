let frutas = [];
let amigos = ["Carlos"];
let numeros = [2, 7, 14];

function formatearArray(arr) {
  let elementos = arr.map(el => typeof el === 'string' ? `"${el}"` : el).join(", ");
  return `[ ${elementos} ]`;
}

// Agrega una fruta al final del array
function agregarFruta(fruta) {
  frutas.push(fruta);
  return [...frutas];
}

// Agrega un amigo al final del array
function agregarAmigo(nombre) {
  amigos.push(nombre);
  return [...amigos];
}

// Agrega el numero al array solo si es mayor que el ultimo elemento
function agregarSiEsMayor(valor) {
  let ultimo = numeros[numeros.length - 1];
  if (valor > ultimo) {
    numeros.push(valor);
  }
  return [...numeros];
}

// Esperar a que el DOM este completamente cargado antes de interactuar con el HTML
document.addEventListener('DOMContentLoaded', () => {

  // --- Sub-ejercicio A ---
  // Obtenemos el contenedor donde se mostrara la salida visual
  let salidaA = document.getElementById('salida-a');
  let pasosFrutas = ["Manzana", "Banana", "Naranja"];
  let indiceFrutas = 0;

  // Funcion para reiniciar el estado del sub-ejercicio a sus valores originales
  function reiniciarA() {
    frutas = [];
    indiceFrutas = 0;
    salidaA.textContent = "";
  }
  // Llamada inicial para mostrar el estado original apenas carga la pagina
  reiniciarA();

  // Escuchador del boton para ejecutar la logica principal del metodo
  document.getElementById('btn-ejecutar-a').addEventListener('click', () => {
    if (indiceFrutas < pasosFrutas.length) {
      let nueva = pasosFrutas[indiceFrutas];
      // Llamamos a la funcion pura y guardamos el resultado
      let copia = agregarFruta(nueva);
      let formato = formatearArray(copia);
      // Inyectamos el resultado en el HTML
      salidaA.innerHTML += `push("${nueva}")  ->  <span class="texto-acento">${formato}</span>\n`;
      indiceFrutas++;
    }
  });
  // Escuchador del boton de reinicio para limpiar los datos y la pantalla
  document.getElementById('btn-reiniciar-a').addEventListener('click', reiniciarA);


  // --- Sub-ejercicio B ---
  // Referencias a los elementos de entrada y salida
  let entradaB = document.getElementById('input-amigo');
  let salidaB = document.getElementById('salida-b');

  // Reiniciamos los valores por defecto
  function reiniciarB() {
    amigos = ["Carlos"];
    salidaB.textContent = 'Array original  ->  [ "Carlos" ]\n';
  }
  reiniciarB();

  // Escuchador para agregar un amigo desde el input
  document.getElementById('btn-ejecutar-b').addEventListener('click', () => {
    // Obtenemos el valor del input y evitamos espacios extra
    let valor = entradaB.value.trim();
    if (valor !== "") {
      // Llamada a la funcion de logica
      let copia = agregarAmigo(valor);
      let formato = formatearArray(copia);
      // Mostramos la transformacion en el DOM
      salidaB.innerHTML += `Agregado "${valor}"  ->  <span class="texto-acento">${formato}</span>\n`;
      entradaB.value = ''; // Limpiamos el input
    }
  });
  document.getElementById('btn-reiniciar-b').addEventListener('click', reiniciarB);


  // --- Sub-ejercicio C ---
  // Referencias a los elementos de entrada y salida
  let entradaC = document.getElementById('input-numero');
  let salidaC = document.getElementById('salida-c');

  // Reiniciamos el array y mostramos el valor base
  function reiniciarC() {
    numeros = [2, 7, 14];
    salidaC.textContent = 'Array original  ->  [ 2, 7, 14 ]\nUltimo elemento ->  14\n\n';
  }
  reiniciarC();

  // Escuchador para validar e insertar el numero condicional
  document.getElementById('btn-ejecutar-c').addEventListener('click', () => {
    let valor = parseFloat(entradaC.value);
    if (!isNaN(valor)) {
      let ultimo = numeros[numeros.length - 1];
      let copia = agregarSiEsMayor(valor);
      let formato = formatearArray(copia);
      // Mostramos exito o error dependiendo de si la condicion se cumplio
      if (valor > ultimo) {
        salidaC.innerHTML += `Aceptado: ${valor}  ->  <span class="texto-exito">${formato}</span>\n`;
      } else {
        salidaC.innerHTML += `<span class="texto-error">Rechazado: ${valor} no es mayor que ${ultimo}</span>\n`;
      }
      entradaC.value = ''; // Limpiamos el input
    }
  });
  document.getElementById('btn-reiniciar-c').addEventListener('click', reiniciarC);
});
