let almacen = [];        
let historial = [];      
let arrayOrdenado =  [];  

// Agrega un nuevo ítem a los tres arrays utilizando métodos distintos.
const agregarElemento = (item) => {
  // Asegurarnos de que tenga un ID único para poder eliminarlo luego de forma segura
  const itemConId = { ...item, id: Date.now() + Math.random().toString(36).substr(2, 9) };

  // MÉTODO: push()
  // Agrega uno o más elementos al final de un array.
  almacen.push(itemConId);

  // MÉTODO: unshift()
  // USO: Ideal para historiales - reordenar el array
  historial.unshift(itemConId);

  // MÉTODO: splice()
  // USO: Mantiene un array ordenado
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
// USO: Filtra ítems por categoría.
const filtrarPorCategoria = (categoria) => {
  return almacen.filter(item => item.categoria === categoria);
};

//map()
// USO: Extrae un campo específico de todos los ítems.
const extraerCampo = (campo) => {
  return almacen.map(item => item[campo]);
};

//reduce()
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
