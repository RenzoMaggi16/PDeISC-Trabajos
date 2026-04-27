let numeros = [10, 20, 30, 40, 50];
let mensajes = ["Hola!", "Como estas?", "Todo bien", "Nos vemos"];
let cola = ["Ana", "Bruno", "Carla", "Diego", "Elena"];

function formatearArray(arr) {
  let elementos = arr.map(el => typeof el === 'string' ? `"${el}"` : el).join(", ");
  return `[ ${elementos} ]`;
}

// Elimina y devuelve el primer numero
function quitarPrimerNumero() {
  let quitado = numeros.shift();
  return { quitado, arr: [...numeros] };
}

// Elimina y devuelve el primer mensaje
function quitarPrimerMensaje() {
  let quitado = mensajes.shift();
  return { quitado, arr: [...mensajes] };
}

// Elimina y devuelve a la primera persona de la cola
function atenderPrimeraPersona() {
  let atendida = cola.shift();
  return { atendida, arr: [...cola] };
}

// Esperar a que el DOM este completamente cargado antes de interactuar con el HTML
document.addEventListener('DOMContentLoaded', () => {

  // --- Sub-ejercicio A ---
  // Obtenemos el contenedor donde se mostrara la salida visual
  let salidaA = document.getElementById('salida-a');
  
  // Funcion para reiniciar el estado del sub-ejercicio a sus valores originales
  function reiniciarA() {
    numeros = [10, 20, 30, 40, 50];
    salidaA.innerHTML = `Array original   ->  ${formatearArray(numeros)}\n`;
  }
  // Llamada inicial para mostrar el estado original apenas carga la pagina
  reiniciarA();

  // Escuchador del boton para ejecutar la logica principal del metodo
  document.getElementById('btn-ejecutar-a').addEventListener('click', () => {
    if (numeros.length > 0) {
      // Llamamos a la funcion pura y guardamos el resultado
      let res = quitarPrimerNumero();
      // Inyectamos el resultado en el HTML
      salidaA.innerHTML += `Elemento quitado ->  <span class="texto-error">${res.quitado}</span>\n`;
      salidaA.innerHTML += `Array resultante ->  <span class="texto-acento">${formatearArray(res.arr)}</span>\n\n`;
    }
  });
  // Escuchador del boton de reinicio para limpiar los datos y la pantalla
  document.getElementById('btn-reiniciar-a').addEventListener('click', reiniciarA);


  // --- Sub-ejercicio B ---
  // Referencias visuales
  let salidaB = document.getElementById('salida-b');
  
  // Funcion de reinicio
  function reiniciarB() {
    mensajes = ["Hola!", "Como estas?", "Todo bien", "Nos vemos"];
    salidaB.innerHTML = `Array original   ->  ${formatearArray(mensajes)}\n`;
  }
  reiniciarB();

  // Escuchador para eliminar el primer mensaje
  document.getElementById('btn-ejecutar-b').addEventListener('click', () => {
    if (mensajes.length > 0) {
      let res = quitarPrimerMensaje();
      // Modificacion visual reflejando el elemento quitado al frente
      salidaB.innerHTML += `Eliminado: "${res.quitado}"\nRestantes: <span class="texto-acento">${formatearArray(res.arr)}</span>\n\n`;
    }
  });
  document.getElementById('btn-reiniciar-b').addEventListener('click', reiniciarB);


  // --- Sub-ejercicio C ---
  // Referencias a la salida visual y al boton interactivo
  let salidaC = document.getElementById('salida-c');
  let btnAtender = document.getElementById('btn-ejecutar-c');
  
  // Funcion para reiniciar estado y volver a activar el boton si estaba deshabilitado
  function reiniciarC() {
    cola = ["Ana", "Bruno", "Carla", "Diego", "Elena"];
    btnAtender.disabled = false;
    let lista = cola.map((p, i) => `${i+1}. ${p}`).join(" | ");
    salidaC.innerHTML = `Cola inicial ->  ${lista}\n\n`;
  }
  reiniciarC();

  // Escuchador para simular atender una cola real extraida por shift()
  btnAtender.addEventListener('click', () => {
    if (cola.length > 0) {
      // Quitamos del frente
      let res = atenderPrimeraPersona();
      salidaC.innerHTML += `Atendiendo a: <span class="texto-exito">${res.atendida}</span>\n`;
      let lista = res.arr.map((p, i) => `${i+1}. ${p}`).join(" | ");
      salidaC.innerHTML += `Cola actual  ->  ${lista}\n\n`;
    } else {
      // Bloqueamos la accion en la UI si no hay mas elementos
      btnAtender.disabled = true;
      salidaC.innerHTML += `<span class="texto-advertencia">No hay mas clientes en espera.</span>\n`;
    }
  });
  document.getElementById('btn-reiniciar-c').addEventListener('click', reiniciarC);
});
