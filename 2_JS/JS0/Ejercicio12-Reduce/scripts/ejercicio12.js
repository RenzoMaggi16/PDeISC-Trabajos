let numeros = [4, 8, 15, 16, 23, 42];
let enteros = [1, 2, 3, 4, 5];
let productos = [
  { nombre: "Notebook",    precio: 1200 },
  { nombre: "Mouse",       precio: 35   },
  { nombre: "Teclado",     precio: 85   },
  { nombre: "Monitor",     precio: 450  },
  { nombre: "Auriculares", precio: 120  }
];

function formatearArray(arr) {
  let elementos = arr.map(el => typeof el === 'string' ? `"${el}"` : el).join(", ");
  return `[ ${elementos} ]`;
}

// Devuelve un array de objetos detallando cada paso de la suma
function simularSuma() {
  let pasos = [];
  numeros.reduce((acc, curr) => {
    pasos.push({ acc, curr, suma: acc + curr });
    return acc + curr;
  }, 0);
  return pasos;
}

// Devuelve el total sumado de numeros
function calcularSuma() {
  return numeros.reduce((acc, curr) => acc + curr, 0);
}

// Devuelve los pasos de multiplicacion
function simularProducto() {
  let pasos = [];
  enteros.reduce((acc, curr) => {
    pasos.push({ acc, curr, mult: acc * curr });
    return acc * curr;
  }, 1);
  return pasos;
}

// Devuelve el total multiplicado
function calcularProducto() {
  return enteros.reduce((acc, curr) => acc * curr, 1);
}

// Devuelve la suma de todos los precios de los productos
function calcularTotalPrecios() {
  return productos.reduce((acc, p) => acc + p.precio, 0);
}

// Esperar a que el DOM este completamente cargado antes de interactuar con el HTML
document.addEventListener('DOMContentLoaded', () => {

  // --- Sub-ejercicio A ---
  // Obtenemos el contenedor donde se mostrara la salida visual
  let salidaA = document.getElementById('salida-a');
  
  // Funcion local de reseteo DOM
  function reiniciarA() {
    salidaA.innerHTML = `Array a sumar: ${formatearArray(numeros)}\n`;
  }
  reiniciarA();

  // Escuchador que simula y muestra proceso reduce a traves del bloque HTML
  document.getElementById('btn-ejecutar-a').addEventListener('click', () => {
    salidaA.innerHTML = "";
    // Requerimos array de interacciones completadas
    let pasos = simularSuma();
    
    // Imprimimos el ciclo log temporal en base a interacciones
    pasos.forEach(p => {
      salidaA.innerHTML += `acc=${p.acc}  +  ${p.curr}   ->  acc=${p.suma}\n`;
    });
    
    // Extraemos el valor final calculado globalmente y lo enlazamos al DOM
    let total = calcularSuma();
    salidaA.innerHTML += `\nResultado final: <span class="texto-exito">${total}</span>\n`;
  });
  document.getElementById('btn-reiniciar-a').addEventListener('click', reiniciarA);


  // --- Sub-ejercicio B ---
  // Referencia a segundo output screen
  let salidaB = document.getElementById('salida-b');
  
  // Helper reset block
  function reiniciarB() {
    salidaB.innerHTML = `Array a multiplicar: ${formatearArray(enteros)}\n`;
  }
  reiniciarB();

  // Disparo del modulo matematico Reduce para productos
  document.getElementById('btn-ejecutar-b').addEventListener('click', () => {
    salidaB.innerHTML = "";
    // Iteraciones y acumulados internos
    let pasos = simularProducto();
    
    // Pintamos historial transaccional
    pasos.forEach(p => {
      salidaB.innerHTML += `acc=${p.acc}  x  ${p.curr}   ->  acc=${p.mult}\n`;
    });
    
    // Valor total devuelto y mostrado
    let total = calcularProducto();
    salidaB.innerHTML += `\nResultado final: <span class="texto-exito">${total}</span>\n`;
    salidaB.innerHTML += `<span class="texto-advertencia">El valor inicial es 1 para multiplicacion, no 0.</span>\n`;
  });
  document.getElementById('btn-reiniciar-b').addEventListener('click', reiniciarB);


  // --- Sub-ejercicio C ---
  // Tercer buffer DOM
  let salidaC = document.getElementById('salida-c');
  
  // UI Placeholder
  function reiniciarC() {
    salidaC.innerHTML = `Presiona calcular...\n`;
  }
  reiniciarC();

  // Ejecucion sobre matriz de objetos
  document.getElementById('btn-ejecutar-c').addEventListener('click', () => {
    salidaC.innerHTML = "";
    // Volcamos primero listado detallado sin acumular (estetico)
    productos.forEach(p => {
      salidaC.innerHTML += `${p.nombre.padEnd(15)} -> $${p.precio}\n`;
    });
    
    // Solicitamos a la funcion pura que extraiga y nos devuelva la suma iterada
    let total = calcularTotalPrecios();
    // Mostramos total a nivel visual
    salidaC.innerHTML += `\nTOTAL -> <span class="texto-exito h3">$${total}</span>\n`;
  });
  document.getElementById('btn-reiniciar-c').addEventListener('click', reiniciarC);
});
