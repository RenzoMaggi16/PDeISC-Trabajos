let animales = ["gato", "perro", "conejo", "loro", "hamster"];
let numeros = [10, 25, 50, 75, 100];
let ciudades = ["Buenos Aires", "Madrid", "Barcelona", "Lima", "Ciudad de Mexico"];

function formatearArray(arr) {
  let elementos = arr.map(el => typeof el === 'string' ? `"${el}"` : el).join(", ");
  return `[ ${elementos} ]`;
}

// Devuelve el indice del elemento "perro"
function buscarPerro() {
  return animales.indexOf("perro");
}

// Devuelve el indice del numero 50 en el array numeros
function buscarCincuenta() {
  return numeros.indexOf(50);
}

// Devuelve el indice de la ciudad buscada
function buscarCiudad(ciudad) {
  return ciudades.indexOf(ciudad);
}

// Esperar a que el DOM este completamente cargado antes de interactuar con el HTML
document.addEventListener('DOMContentLoaded', () => {

  // --- Sub-ejercicio A ---
  // Obtenemos el contenedor donde se mostrara la salida visual
  let salidaA = document.getElementById('salida-a');
  
  // Limpiamos y preparamos la interfaz visual para empezar
  function reiniciarA() {
    salidaA.innerHTML = `Array original  ->  ${formatearArray(animales)}\n`;
  }
  reiniciarA();

  // Escuchador de click principal para buscar "perro"
  document.getElementById('btn-ejecutar-a').addEventListener('click', () => {
    // Llamada a la funcion logica para obtener el valor puramente matematico (indice)
    let indice = buscarPerro();
    // Creamos una cadena de texto estilizada resaltando unicamente a 'perro'
    let formato = formatearArray(animales).replace('"perro"', '<span class="texto-acento">"perro"</span>');
    // Pintamos los componentes en pantalla
    salidaA.innerHTML = `Array original  ->  ${formato}\n`;
    salidaA.innerHTML += `Resultado       ->  <span class="texto-exito">"perro" se encuentra en el indice: ${indice}</span>\n`;
  });
  document.getElementById('btn-reiniciar-a').addEventListener('click', reiniciarA);


  // --- Sub-ejercicio B ---
  // Seleccion del nodo DOM para salida de texto
  let salidaB = document.getElementById('salida-b');
  
  // Re-inyeccion de datos primarios
  function reiniciarB() {
    numeros = [10, 25, 50, 75, 100];
    salidaB.innerHTML = `Array original  ->  ${formatearArray(numeros)}\n`;
  }
  reiniciarB();

  // Boton que busca y despliega la posicion
  document.getElementById('btn-ejecutar-b').addEventListener('click', () => {
    // Extraccion de logica
    let indice = buscarCincuenta();
    salidaB.innerHTML = `Array original  ->  ${formatearArray(numeros)}\n`;
    // Estructura de control condicional para el UI (Manejo visual si no existe)
    if (indice !== -1) {
      salidaB.innerHTML += `Resultado       ->  <span class="texto-exito">50 se encuentra en el indice: ${indice}</span>\n`;
    } else {
      salidaB.innerHTML += `Resultado       ->  <span class="texto-advertencia">50 no se encuentra. Devuelve: ${indice}</span>\n`;
    }
  });

  // Boton extra para probar un caso distinto de test
  document.getElementById('btn-cambiar-b').addEventListener('click', () => {
    // Modifica los datos iniciales y altera la presentacion visual inmediatamente
    numeros = [10, 25, 30, 75, 100];
    salidaB.innerHTML = `Array alterado  ->  ${formatearArray(numeros)}\n(Se quito el 50)\n`;
  });
  document.getElementById('btn-reiniciar-b').addEventListener('click', reiniciarB);


  // --- Sub-ejercicio C ---
  // Selectores para input de texto de la ciudad y bloque de respuesta
  let salidaC = document.getElementById('salida-c');
  let entradaC = document.getElementById('input-ciudad');
  
  // Limpia el input del DOM
  function reiniciarC() {
    salidaC.innerHTML = `Ciudades        ->  ${formatearArray(ciudades)}\n`;
  }
  reiniciarC();

  // Busqueda custom a demanda del usuario
  document.getElementById('btn-ejecutar-c').addEventListener('click', () => {
    // Validacion de entrada a nivel interfaz grafica
    let valor = entradaC.value.trim();
    if (valor !== "") {
      // Pasamos el argumento seguro a logica pura
      let indice = buscarCiudad(valor);
      salidaC.innerHTML = `Ciudades        ->  ${formatearArray(ciudades)}\n`;
      // Feedback segun indice recuperado (-1 significa "no hay coincidencias")
      if (indice !== -1) {
        salidaC.innerHTML += `<span class="texto-exito">${valor} se encuentra en el indice: ${indice}</span>\n`;
      } else {
        salidaC.innerHTML += `<span class="texto-advertencia">${valor} no esta en el array. indexOf() devolvio: -1</span>\n`;
      }
      // Vacia el contenedor visual
      entradaC.value = '';
    }
  });
  document.getElementById('btn-reiniciar-c').addEventListener('click', reiniciarC);
});
