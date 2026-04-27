let numeros = [40, 3, 100, 7, 25, 1, 88];
let frutas = ["Uva", "Manzana", "Banana", "Pera", "Cereza", "Anana"];
let personas = [
  { nombre: "Lucia",   edad: 34 },
  { nombre: "Marcos",  edad: 19 },
  { nombre: "Valeria", edad: 27 },
  { nombre: "Tomas",   edad: 45 },
  { nombre: "Sofia",   edad: 22 }
];

function formatearArray(arr) {
  let elementos = arr.map(el => typeof el === 'string' ? `"${el}"` : el).join(", ");
  return `[ ${elementos} ]`;
}

// Ordena copia de numeros de menor a mayor
function ordenarNumerosAsc() {
  return [...numeros].sort((a, b) => a - b);
}

// Ordena copia de numeros de mayor a menor
function ordenarNumerosDesc() {
  return [...numeros].sort((a, b) => b - a);
}

// Ordena copia de frutas A-Z
function ordenarFrutasAZ() {
  return [...frutas].sort((a, b) => a.localeCompare(b));
}

// Ordena copia de frutas Z-A
function ordenarFrutasZA() {
  return [...frutas].sort((a, b) => b.localeCompare(a));
}

// Ordena copia de personas por edad (asc)
function ordenarPersonasAsc() {
  return [...personas].sort((a, b) => a.edad - b.edad);
}

// Ordena copia de personas por edad (desc)
function ordenarPersonasDesc() {
  return [...personas].sort((a, b) => b.edad - a.edad);
}

// Esperar a que el DOM este completamente cargado antes de interactuar con el HTML
document.addEventListener('DOMContentLoaded', () => {

  // --- Sub-ejercicio A ---
  // Obtenemos el contenedor donde se mostrara la salida visual
  let salidaA = document.getElementById('salida-a');
  
  // Limpiador visual
  function reiniciarA() {
    salidaA.innerHTML = `Array original   ->  ${formatearArray(numeros)}\n`;
  }
  reiniciarA();

  // Sort ascendente en array numerico
  document.getElementById('btn-ejecutar-a').addEventListener('click', () => {
    // Solicitamos a logica el array parseado numericamente (a-b)
    let ord = ordenarNumerosAsc();
    // Render
    salidaA.innerHTML = `Array original   ->  ${formatearArray(numeros)}\n`;
    salidaA.innerHTML += `Menor a mayor    ->  <span class="texto-acento">${formatearArray(ord)}</span>\n`;
    salidaA.innerHTML += `<span class="texto-advertencia">sort() modifica el array original. Se uso [...array] para preservarlo.</span>\n`;
  });

  // Sort descendente
  document.getElementById('btn-ejecutar-a2').addEventListener('click', () => {
    let ord = ordenarNumerosDesc();
    salidaA.innerHTML = `Array original   ->  ${formatearArray(numeros)}\n`;
    salidaA.innerHTML += `Mayor a menor    ->  <span class="texto-acento">${formatearArray(ord)}</span>\n`;
    salidaA.innerHTML += `<span class="texto-advertencia">sort() modifica el array original. Se uso [...array] para preservarlo.</span>\n`;
  });
  document.getElementById('btn-reiniciar-a').addEventListener('click', reiniciarA);


  // --- Sub-ejercicio B ---
  // Container B
  let salidaB = document.getElementById('salida-b');
  
  // Restaurar display textual
  function reiniciarB() {
    salidaB.innerHTML = `Array original   ->  ${formatearArray(frutas)}\n`;
  }
  reiniciarB();

  // Escuchador ascendente A-Z
  document.getElementById('btn-ejecutar-b').addEventListener('click', () => {
    // localeCompare asegura comportamiento estandar en JS con acentos y mayusculas
    let ord = ordenarFrutasAZ();
    salidaB.innerHTML = `Array original   ->  ${formatearArray(frutas)}\n`;
    salidaB.innerHTML += `A-Z              ->  <span class="texto-acento">${formatearArray(ord)}</span>\n`;
  });
  
  // Escuchador descendente Z-A
  document.getElementById('btn-ejecutar-b2').addEventListener('click', () => {
    let ord = ordenarFrutasZA();
    salidaB.innerHTML = `Array original   ->  ${formatearArray(frutas)}\n`;
    salidaB.innerHTML += `Z-A              ->  <span class="texto-acento">${formatearArray(ord)}</span>\n`;
  });
  document.getElementById('btn-reiniciar-b').addEventListener('click', reiniciarB);


  // --- Sub-ejercicio C ---
  // Container C para object properties
  let salidaC = document.getElementById('salida-c');
  
  // Limpia el visor
  function reiniciarC() {
    salidaC.innerHTML = `Presiona ordenar...\n`;
  }
  reiniciarC();

  // Escuchador que itera sort() evaluando property "edad" ascendentemente
  document.getElementById('btn-ejecutar-c').addEventListener('click', () => {
    let ord = ordenarPersonasAsc();
    salidaC.innerHTML = `Personas (Menor a mayor edad):\n`;
    ord.forEach((p, i) => {
      salidaC.innerHTML += `${i+1}. <span class="texto-acento">${p.nombre}</span> (${p.edad} anos)\n`;
    });
  });

  // Iteracion analoga descendente
  document.getElementById('btn-ejecutar-c2').addEventListener('click', () => {
    let ord = ordenarPersonasDesc();
    salidaC.innerHTML = `Personas (Mayor a menor edad):\n`;
    ord.forEach((p, i) => {
      salidaC.innerHTML += `${i+1}. <span class="texto-acento">${p.nombre}</span> (${p.edad} anos)\n`;
    });
  });
  document.getElementById('btn-reiniciar-c').addEventListener('click', reiniciarC);
});
