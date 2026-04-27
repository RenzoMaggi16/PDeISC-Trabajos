let colores = [];
let tareas = ["Estudiar", "Hacer ejercicio", "Leer"];
let usuarios = ["Maria", "Juan", "Pedro"];

function formatearArray(arr) {
  let elementos = arr.map(el => typeof el === 'string' ? `"${el}"` : el).join(", ");
  return `[ ${elementos} ]`;
}

// Inserta un color al inicio del array
function agregarColor(color) {
  colores.unshift(color);
  return [...colores];
}

// Inserta una tarea al inicio del array
function agregarTarea(tarea) {
  tareas.unshift(tarea);
  return [...tareas];
}

// Inserta un usuario al inicio de la lista
function conectarUsuario(usuario) {
  usuarios.unshift(usuario);
  return [...usuarios];
}

// Esperar a que el DOM este completamente cargado antes de interactuar con el HTML
document.addEventListener('DOMContentLoaded', () => {

  // --- Sub-ejercicio A ---
  // Obtenemos el contenedor donde se mostrara la salida visual
  let salidaA = document.getElementById('salida-a');
  let pasosColores = ["rojo", "verde", "azul"];
  let indiceColores = 0;

  // Funcion para reiniciar el estado del sub-ejercicio a sus valores originales
  function reiniciarA() {
    colores = [];
    indiceColores = 0;
    salidaA.textContent = "Array original  ->  [ ]\n";
  }
  // Llamada inicial para mostrar el estado original apenas carga la pagina
  reiniciarA();

  // Escuchador del boton para ejecutar la logica principal del metodo
  document.getElementById('btn-ejecutar-a').addEventListener('click', () => {
    if (indiceColores < pasosColores.length) {
      let nuevo = pasosColores[indiceColores];
      // Llamamos a la funcion pura y guardamos el resultado
      let copia = agregarColor(nuevo);
      let formato = formatearArray(copia);
      // Inyectamos el resultado en el HTML
      salidaA.innerHTML += `unshift("${nuevo}")   ->  <span class="texto-acento">${formato}</span>\n`;
      indiceColores++;
    }
  });
  // Escuchador del boton de reinicio para limpiar los datos y la pantalla
  document.getElementById('btn-reiniciar-a').addEventListener('click', reiniciarA);


  // --- Sub-ejercicio B ---
  // Referencias a los elementos de entrada y salida
  let entradaB = document.getElementById('input-tarea');
  let salidaB = document.getElementById('salida-b');

  // Reiniciamos los valores por defecto
  function reiniciarB() {
    tareas = ["Estudiar", "Hacer ejercicio", "Leer"];
    salidaB.textContent = `Lista tareas    ->  ${formatearArray(tareas)}\n`;
  }
  reiniciarB();

  // Escuchador para insertar el input al inicio
  document.getElementById('btn-ejecutar-b').addEventListener('click', () => {
    let valor = entradaB.value.trim();
    if (valor !== "") {
      let copia = agregarTarea(valor);
      // Mostramos el nuevo array reordenado
      salidaB.innerHTML += `Agregado        ->  <span class="texto-acento">${formatearArray(copia)}</span>\n`;
      entradaB.value = ''; // Limpiamos el input
    }
  });
  document.getElementById('btn-reiniciar-b').addEventListener('click', reiniciarB);


  // --- Sub-ejercicio C ---
  // Referencias a los elementos de entrada y salida
  let entradaC = document.getElementById('input-usuario');
  let salidaC = document.getElementById('salida-c');

  // Reiniciamos el estado
  function reiniciarC() {
    usuarios = ["Maria", "Juan", "Pedro"];
    salidaC.textContent = `Usuarios online ->  ${formatearArray(usuarios)}\n`;
  }
  reiniciarC();

  // Escuchador del boton para conectar el usuario
  document.getElementById('btn-ejecutar-c').addEventListener('click', () => {
    let valor = entradaC.value.trim();
    if (valor !== "") {
      // Modifica la lista logica y retorna array actualizado
      let copia = conectarUsuario(valor);
      // Resaltamos el nombre especifico recien insertado para la UI
      let htmlModificado = formatearArray(copia).replace(`"${valor}"`, `<span class="texto-exito">"${valor}"</span>`);
      // Aplicamos cambios visuales
      salidaC.innerHTML += `Nuevo online    ->  ${htmlModificado}\n`;
      entradaC.value = ''; // Limpiamos el input
    }
  });
  document.getElementById('btn-reiniciar-c').addEventListener('click', reiniciarC);
});
