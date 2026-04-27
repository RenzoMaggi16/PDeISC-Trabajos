let roles = ["usuario", "editor", "admin", "moderador"];
let colores = ["rojo", "azul", "verde", "amarillo", "naranja"];
let numeros = [5, 12, 27, 43];

function formatearArray(arr) {
  let elementos = arr.map(el => typeof el === 'string' ? `"${el}"` : el).join(", ");
  return `[ ${elementos} ]`;
}

// Verifica si un rol especifico existe
function existeRol(rol) {
  return roles.includes(rol);
}

// Verifica si un color existe
function existeColor(color) {
  return colores.includes(color);
}

// Agrega un numero solo si no esta incluido previamente
function agregarSinDuplicados(num) {
  if (!numeros.includes(num)) {
    numeros.push(num);
    return { agregado: true, arr: [...numeros] };
  }
  return { agregado: false, arr: [...numeros] };
}

// Esperar a que el DOM este completamente cargado antes de interactuar con el HTML
document.addEventListener('DOMContentLoaded', () => {

  // --- Sub-ejercicio A ---
  // Obtenemos el contenedor donde se mostrara la salida visual
  let salidaA = document.getElementById('salida-a');
  
  // Limpiamos los datos visuales al estado primario
  function reiniciarA() {
    salidaA.innerHTML = `Array original  ->  ${formatearArray(roles)}\n`;
  }
  reiniciarA();

  // Primer escuchador que valida el caso "true"
  document.getElementById('btn-ejecutar-a').addEventListener('click', () => {
    // Uso del modulo logico purificado
    let res = existeRol("admin");
    // Volcamos string procesado a innerHTML con inyeccion dinamica
    salidaA.innerHTML = `Array original  ->  ${formatearArray(roles)}\n`;
    salidaA.innerHTML += `Resultado       ->  <span class="texto-exito">true (admin SI existe)</span>\n`;
  });
  // Segundo escuchador que valida el caso "false" alternativo
  document.getElementById('btn-ejecutar-a2').addEventListener('click', () => {
    // Modulo logico con "superadmin"
    let res = existeRol("superadmin");
    // Volcamos a DOM
    salidaA.innerHTML = `Array original  ->  ${formatearArray(roles)}\n`;
    salidaA.innerHTML += `Resultado       ->  <span class="texto-error">false (superadmin NO existe)</span>\n`;
  });
  document.getElementById('btn-reiniciar-a').addEventListener('click', reiniciarA);


  // --- Sub-ejercicio B ---
  // Definicion de elementos DOM
  let salidaB = document.getElementById('salida-b');
  let entradaB = document.getElementById('input-color');
  
  // Funcion de blanqueo local de bloque UI
  function reiniciarB() {
    salidaB.innerHTML = `Colores validos ->  ${formatearArray(colores)}\n`;
  }
  reiniciarB();

  // Ejecucion vinculada a ingreso de campo input
  document.getElementById('btn-ejecutar-b').addEventListener('click', () => {
    // Forzamos el input a estar libre de espacios extra y completamente en minusculas (formateo DOM)
    let valor = entradaB.value.trim().toLowerCase();
    if (valor !== "") {
      // Verificacion booleana nativa
      let existe = existeColor(valor);
      salidaB.innerHTML = `Colores validos ->  ${formatearArray(colores)}\n`;
      // Alteracion cromatica segun resultado de comprobacion logica
      if (existe) {
        salidaB.innerHTML += `<span class="texto-exito">El color ${valor} SI esta en el array.</span>\n`;
      } else {
        salidaB.innerHTML += `<span class="texto-error">El color ${valor} NO esta en el array.</span>\n`;
      }
      entradaB.value = ''; // Retornar barra blanca al inicio
    }
  });
  document.getElementById('btn-reiniciar-b').addEventListener('click', reiniciarB);


  // --- Sub-ejercicio C ---
  // Carga de elementos DOM intervinientes
  let salidaC = document.getElementById('salida-c');
  let entradaC = document.getElementById('input-numero');
  
  // Recuperar arrays de memoria mutados
  function reiniciarC() {
    numeros = [5, 12, 27, 43];
    salidaC.innerHTML = `Numeros         ->  ${formatearArray(numeros)}\n`;
  }
  reiniciarC();

  // Accion transaccional (Insercion controlada via feedback UI)
  document.getElementById('btn-ejecutar-c').addEventListener('click', () => {
    // Parsea string de un tag a un numero decimal logico
    let valor = parseFloat(entradaC.value);
    if (!isNaN(valor)) {
      // Disparamos funcion y esperamos objeto transaccional con "status" + "array nuevo"
      let res = agregarSinDuplicados(valor);
      
      // Chequeo logico dictamina rendering positivo o alerta negativa de insercion
      if (res.agregado) {
        salidaC.innerHTML = `<span class="texto-exito">Agregado con exito.</span>\nNumeros         ->  ${formatearArray(res.arr)}\n`;
      } else {
        salidaC.innerHTML = `<span class="texto-advertencia">El numero ${valor} ya existe. No se agrego.</span>\nNumeros         ->  ${formatearArray(res.arr)}\n`;
      }
      entradaC.value = ''; // Blank field
    }
  });
  document.getElementById('btn-reiniciar-c').addEventListener('click', reiniciarC);
});
