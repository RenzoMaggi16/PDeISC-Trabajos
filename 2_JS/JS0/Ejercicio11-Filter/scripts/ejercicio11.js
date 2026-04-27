let numeros = [3, 15, 7, 22, 8, 40, 1, 11];
let palabras = ["sol", "computadora", "mar", "elefante", "rio", "programar", "luz"];
let usuarios = [
  { nombre: "Ana",   activo: true  },
  { nombre: "Bruno", activo: false },
  { nombre: "Carla", activo: true  },
  { nombre: "Diego", activo: false },
  { nombre: "Elena", activo: true  }
];

function formatearArray(arr) {
  let elementos = arr.map(el => typeof el === 'string' ? `"${el}"` : el).join(", ");
  return `[ ${elementos} ]`;
}

// Retorna un nuevo array con numeros mayores a 10
function filtrarMayoresADiez() {
  return numeros.filter(num => num > 10);
}

// Retorna los numeros que fueron excluidos
function filtrarExcluidos() {
  return numeros.filter(num => num <= 10);
}

// Retorna palabras con longitud mayor a 5
function filtrarPalabrasLargas() {
  return palabras.filter(p => p.length > 5);
}

// Retorna palabras excluidas
function filtrarPalabrasCortas() {
  return palabras.filter(p => p.length <= 5);
}

// Retorna usuarios con activo === true
function filtrarUsuariosActivos() {
  return usuarios.filter(u => u.activo);
}

// Esperar a que el DOM este completamente cargado antes de interactuar con el HTML
document.addEventListener('DOMContentLoaded', () => {

  // --- Sub-ejercicio A ---
  // Obtenemos el contenedor donde se mostrara la salida visual
  let salidaA = document.getElementById('salida-a');
  
  // Vuelve los datos al estado de string limpio
  function reiniciarA() {
    salidaA.innerHTML = `Array original  ->  ${formatearArray(numeros)}\n`;
  }
  reiniciarA();

  // Accion principal de filtrado de enteros
  document.getElementById('btn-ejecutar-a').addEventListener('click', () => {
    // Consultamos la logica por los arrays divididos
    let filtrados = filtrarMayoresADiez();
    let excluidos = filtrarExcluidos();
    
    // Mostramos la particion en DOM
    salidaA.innerHTML = `Array original  ->  ${formatearArray(numeros)}\n`;
    salidaA.innerHTML += `Filtrado        ->  <span class="texto-acento">${formatearArray(filtrados)}</span>\n`;
    salidaA.innerHTML += `Excluidos       ->  <span class="texto-error">${formatearArray(excluidos)}</span>\n`;
    salidaA.innerHTML += `Original sin cambios ->  ${formatearArray(numeros)}\n`;
  });
  document.getElementById('btn-reiniciar-a').addEventListener('click', reiniciarA);


  // --- Sub-ejercicio B ---
  // Selector DOM para UI
  let salidaB = document.getElementById('salida-b');
  
  // Limpieza local
  function reiniciarB() {
    salidaB.innerHTML = `Array original  ->  ${formatearArray(palabras)}\n`;
  }
  reiniciarB();

  // Evaluacion por length del array string
  document.getElementById('btn-ejecutar-b').addEventListener('click', () => {
    // Pedimos a la logica pura los elementos filtrados
    let filtrados = filtrarPalabrasLargas();
    let excluidos = filtrarPalabrasCortas();
    
    // Inyectamos resultados en HTML de manera customizada
    salidaB.innerHTML = `Filtradas:\n`;
    filtrados.forEach(p => {
      salidaB.innerHTML += `<span class="texto-acento">"${p}"</span> (${p.length}) | `;
    });
    salidaB.innerHTML += `\n\nExcluidas: <span class="texto-error">${formatearArray(excluidos)}</span>\n`;
  });
  document.getElementById('btn-reiniciar-b').addEventListener('click', reiniciarB);


  // --- Sub-ejercicio C ---
  // Nodo de salida HTML
  let salidaC = document.getElementById('salida-c');
  
  // Vacia contenedor de listado completo y lo regenera
  function reiniciarC() {
    salidaC.innerHTML = "Usuarios:\n";
    usuarios.forEach(u => {
      let icon = u.activo ? "Activo" : "Inactivo";
      let cl = u.activo ? "texto-exito" : "texto-error";
      salidaC.innerHTML += `<span class="${cl}">${u.nombre} - ${icon}</span>\n`;
    });
  }
  reiniciarC();

  // Filtrar base de datos simulada y redibujar DOM
  document.getElementById('btn-ejecutar-c').addEventListener('click', () => {
    // Obtenemos coleccion reducida de base local
    let activos = filtrarUsuariosActivos();
    
    // Sobrescribimos interfaz con lista depurada
    salidaC.innerHTML = "Usuarios Activos:\n";
    activos.forEach(u => {
      salidaC.innerHTML += `<span class="texto-exito">${u.nombre}</span>\n`;
    });
    // Agregamos footer de status
    salidaC.innerHTML += `\n<span class="texto-acento">Total activos: ${activos.length} de ${usuarios.length}</span>\n`;
  });
  document.getElementById('btn-reiniciar-c').addEventListener('click', reiniciarC);
});
