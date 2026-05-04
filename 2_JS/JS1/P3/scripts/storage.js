const STORAGE_KEY = 'JS1_personas';

// LOCALSTORAGE METHOD: localStorage.setItem()
// USE: Serializes the full array to JSON and saves it under the key.
const guardarTodos = (array) => {
  try {
    const jsonStr = JSON.stringify(array);
    localStorage.setItem(STORAGE_KEY, jsonStr);
  } catch (error) {
    console.error("Error al guardar en LocalStorage:", error);
  }
};

// LOCALSTORAGE METHOD: localStorage.getItem() + JSON.parse()
// USE: Retrieves and deserializes the stored array. Returns [] if empty or null.
const obtenerTodos = () => {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) return [];
    return JSON.parse(item);
  } catch (error) {
    console.error("Error al leer de LocalStorage:", error);
    return [];
  }
};

// LOCALSTORAGE METHOD: Read → modify → setItem() (Read-Modify-Write pattern)
// USE: Adds a new person to the existing array without overwriting previous records.
const agregarPersona = (persona) => {
  const currentData = obtenerTodos();
  
  const nuevaPersona = {
    ...persona,
    id: Date.now(),
    fechaRegistro: new Date().toISOString()
  };
  
  currentData.push(nuevaPersona);
  guardarTodos(currentData);
};

// LOCALSTORAGE METHOD: Read → filter → setItem()
// USE: Removes a person by their Documento field and re-saves the filtered array.
const eliminarPersona = (documento) => {
  const currentData = obtenerTodos();
  const newData = currentData.filter(p => p.documento !== documento);
  guardarTodos(newData);
};

// LOCALSTORAGE METHOD: localStorage.removeItem()
// USE: Completely clears all stored people data for this app.
const limpiarTodo = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// LOCALSTORAGE METHOD: Read → find()
// USE: Checks if a Documento already exists to prevent duplicate entries.
const existeDocumento = (documento) => {
  const currentData = obtenerTodos();
  return currentData.some(p => p.documento === documento);
};

// LOCALSTORAGE METHOD: Read → calculate
// USE: Returns total count of stored records.
const obtenerConteo = () => {
  const currentData = obtenerTodos();
  return currentData.length;
};

// Export to global scope
window.Storage = {
  guardarTodos,
  obtenerTodos,
  agregarPersona,
  eliminarPersona,
  limpiarTodo,
  existeDocumento,
  obtenerConteo
};
