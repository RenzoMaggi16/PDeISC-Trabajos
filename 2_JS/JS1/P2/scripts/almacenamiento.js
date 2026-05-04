let almacen = [];        
let historial = [];      
let arrayOrdenado =  [];  

// Agrega un nuevo ítem a los tres arrays utilizando métodos distintos.
const agregarElemento = (item) => {
  // Asegurarnos de que tenga un ID único para poder eliminarlo luego de forma segura
  const itemConId = { ...item, id: Date.now() + Math.random().toString(36).substr(2, 9) };

  // MÉTODO: push()
  // Agrega uno o más elementos al final de un array.
  // USO: Almacenamiento secuencial estándar. Mantiene el orden de ingreso.
  almacen.push(itemConId);

  // MÉTODO: unshift() — Agrega el elemento al inicio del array
  // USO: Ideal para historiales o "Feed", donde quieres mostrar lo más reciente primer sin tener que usar .reverse() o reordenar el array en tiempo de ejecución.
  historial.unshift(itemConId);

  // MÉTODO: splice() — Inserción en posición específica
  // USO: Mantiene un array ordenado (ej: por precio de menor a mayor) insertando el elemento exactamente donde corresponde. Evita usar sort() en todo el array.
  const precioNuevo = parseFloat(itemConId.precio);
  // Buscar el índice donde debemos insertar (primer elemento que sea mayor al nuevo)
  let indexInsercion = arrayOrdenado.findIndex(elem => parseFloat(elem.precio) > precioNuevo);
  
  // Si findIndex devuelve -1, significa que es el mayor de todos o el array está vacío
  if (indexInsercion === -1) {
    indexInsercion = arrayOrdenado.length;
  }
  
  // Insertar en ese índice sin borrar nada (0)
  arrayOrdenado.splice(indexInsercion, 0, itemConId);
};

// Elimina un ítem de los tres arrays basándose en su ID.
const eliminarElemento = (id) => {
  almacen = almacen.filter(item => item.id !== id);
  historial = historial.filter(item => item.id !== id);
  arrayOrdenado = arrayOrdenado.filter(item => item.id !== id);
};

// Retorna todos los elementos en orden de ingreso original.
const obtenerTodos = () => almacen;

// Retorna todos los elementos, el más reciente primero.
const obtenerHistorial = () => historial;

// Retorna todos los elementos ordenados por precio ascendente.
const obtenerOrdenado = () => arrayOrdenado;

// Reinicia todos los arrays borrando su contenido.
const limpiarTodo = () => {
  almacen = [];
  historial = [];
  arrayOrdenado = [];
};

// Obtiene la cantidad total de herramientas registradas.
const obtenerConteo = () => almacen.length;

//filter()
// QUÉ HACE: Crea un nuevo array con los elementos que cumplen la condición dada. No muta el original.
// USO: Filtra ítems por categoría.
const filtrarPorCategoria = (categoria) => {
  return almacen.filter(item => item.categoria === categoria);
};

//map()
// QUÉ HACE: Crea un nuevo array con los resultados de la llamada a una función en cada elemento.
// USO: Extrae un campo específico de todos los ítems.
const extraerCampo = (campo) => {
  return almacen.map(item => item[campo]);
};

//reduce()
// QUÉ HACE: Ejecuta una función reductora sobre cada elemento, devolviendo un único valor.
// USO: Calcula el valor total sumando todos los precios.
const calcularTotal = () => {
  return almacen.reduce((acumulador, item) => acumulador + parseFloat(item.precio), 0);
};

// Export for browser environment
window.Almacenamiento = {
  agregarElemento,
  eliminarElemento,
  obtenerTodos,
  obtenerHistorial,
  obtenerOrdenado,
  limpiarTodo,
  obtenerConteo,
  filtrarPorCategoria,
  extraerCampo,
  calcularTotal
};
