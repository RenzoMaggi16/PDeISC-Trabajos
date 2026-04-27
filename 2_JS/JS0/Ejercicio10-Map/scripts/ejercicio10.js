let numeros = [2, 5, 8, 11, 14];
let nombres = ["ana", "bruno", "carla", "diego"];
let precios = [100, 250, 80, 430, 60];

function formatearArray(arr) {
  let elementos = arr.map(el => typeof el === 'string' ? `"${el}"` : el).join(", ");
  return `[ ${elementos} ]`;
}

// Devuelve un nuevo array con los numeros multiplicados por 3
function multiplicarPorTres() {
  return numeros.map(num => num * 3);
}

// Devuelve un nuevo array con los nombres en mayusculas
function convertirMayusculas() {
  return nombres.map(nombre => nombre.toUpperCase());
}

// Devuelve un array de objetos con precios e IVA calculado
function calcularIVA() {
  return precios.map(precio => {
    return { base: precio, iva: precio * 0.21, final: precio * 1.21 };
  });
}

// Esperar a que el DOM este completamente cargado antes de interactuar con el HTML
document.addEventListener('DOMContentLoaded', () => {

  // --- Sub-ejercicio A ---
  // Definicion de elementos DOM e inyeccion principal de resets
  let salidaA = document.getElementById('salida-a');
  
  // Limpia el visor inyectando la cadena base
  function reiniciarA() {
    salidaA.innerHTML = `Array original  ->  ${formatearArray(numeros)}\n`;
  }
  reiniciarA();

  // Escuchador del trigger
  document.getElementById('btn-ejecutar-a').addEventListener('click', () => {
    // Calculo logico del .map()
    let resultado = multiplicarPorTres();
    // Output UI
    salidaA.innerHTML = `Array original  ->  ${formatearArray(numeros)}\n`;
    salidaA.innerHTML += `Array resultado ->  <span class="texto-acento">${formatearArray(resultado)}</span>\n`;
    salidaA.innerHTML += `Original intacto->  ${formatearArray(numeros)}\n\n`;
    
    // Mostramos la formula desglosada
    let operacion = numeros.map(n => `${n} x 3 = ${n * 3}`).join("  |  ");
    salidaA.innerHTML += `<span class="texto-exito">${operacion}</span>\n`;
  });
  document.getElementById('btn-reiniciar-a').addEventListener('click', reiniciarA);


  // --- Sub-ejercicio B ---
  // Manipulacion del segundo box de texto
  let salidaB = document.getElementById('salida-b');
  
  // Helper reset
  function reiniciarB() {
    salidaB.innerHTML = `Array original  ->  ${formatearArray(nombres)}\n`;
  }
  reiniciarB();

  // Conversion textual en array
  document.getElementById('btn-ejecutar-b').addEventListener('click', () => {
    // Solicitamos la logica de mapping
    let resultado = convertirMayusculas();
    // Renderizado comparativo del array alterado y original preservado
    salidaB.innerHTML = `Array original  ->  ${formatearArray(nombres)}\n`;
    salidaB.innerHTML += `Array resultado ->  <span class="texto-acento">${formatearArray(resultado)}</span>\n`;
    salidaB.innerHTML += `Original intacto->  ${formatearArray(nombres)}\n`;
  });
  document.getElementById('btn-reiniciar-b').addEventListener('click', reiniciarB);


  // --- Sub-ejercicio C ---
  // Bloque para presentacion de objetos
  let salidaC = document.getElementById('salida-c');
  
  // Estado default de precios pre-IVA
  function reiniciarC() {
    salidaC.innerHTML = `Precios base    ->  ${formatearArray(precios)}\n`;
  }
  reiniciarC();

  // Render en formato tabla tras mutar los datos en logica pura
  document.getElementById('btn-ejecutar-c').addEventListener('click', () => {
    // Obtenemos la matriz convertida en calculo de negocio
    let resultado = calcularIVA();
    
    // Adaptamos visualmente un sub-arreglo a 2 decimales para la UI
    let preciosFinales = resultado.map(item => item.final.toFixed(2));
    
    // Salida HTML
    salidaC.innerHTML = `Array original  ->  ${formatearArray(precios)}\n`;
    salidaC.innerHTML += `Array con IVA   ->  <span class="texto-acento">[ ${preciosFinales.join(", ")} ]</span>\n\n`;
    
    // Cabecera formato listado/tabla
    salidaC.innerHTML += `Precio base | IVA (21%) | Precio final\n`;
    salidaC.innerHTML += `--------------------------------------\n`;
    // Loop de inyeccion fila a fila
    resultado.forEach(item => {
      salidaC.innerHTML += `$${item.base.toFixed(2).padEnd(9)} | $${item.iva.toFixed(2).padEnd(9)} | $${item.final.toFixed(2)}\n`;
    });
  });
  document.getElementById('btn-reiniciar-c').addEventListener('click', reiniciarC);
});
