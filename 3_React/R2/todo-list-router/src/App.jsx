// Componente raíz de la aplicación
// Responsabilidades:
//   1. Envolver toda la app en BrowserRouter para habilitar React Router
//   2. Mantener el estado global de la lista de tareas (listaDeTareas) persistido en localStorage
//   3. Proveer agregarTarea, eliminarTarea y editarTarea a los componentes que los necesitan
//   4. Declarar las rutas principales con <Routes> y <Route>

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Componentes de navegación y páginas
import Navbar     from './components/Navbar.jsx';
import Home       from './pages/Home.jsx';
import TaskDetail from './pages/TaskDetail.jsx';
import CreateTask from './pages/CreateTask.jsx';
import EditTask   from './pages/EditTask.jsx';

// Datos semilla que pueblan la lista al iniciar la app por primera vez
import { tareasIniciales } from './data/tareasIniciales.js';

// Clave utilizada para guardar en localStorage
const LOCAL_STORAGE_KEY = 'tareaflow_lista_tareas';

// Componente App: raíz del árbol de componentes
function App() {
  // Estado global de la lista de tareas con inicialización perezosa leyendo de localStorage
  const [listaDeTareas, setListaDeTareas] = useState(() => {
    try {
      const guardadas = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (guardadas !== null) {
        return JSON.parse(guardadas);
      }
    } catch (error) {
      console.error('Error al leer de localStorage:', error);
    }
    return tareasIniciales;
  });

  // Guardar en localStorage cada vez que la lista de tareas cambia
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(listaDeTareas));
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }, [listaDeTareas]);

  // Agrega una nueva tarea al principio de la lista
  function agregarTarea(nuevaTarea) {
    setListaDeTareas((tareasActuales) => [nuevaTarea, ...tareasActuales]);
  }

  // Elimina la tarea con el id dado de la lista
  function eliminarTarea(id) {
    setListaDeTareas((tareasActuales) =>
      tareasActuales.filter((tarea) => tarea.id !== id)
    );
  }

  // Reemplaza la tarea existente con la versión actualizada (mismo id)
  function editarTarea(tareaActualizada) {
    setListaDeTareas((tareasActuales) =>
      tareasActuales.map((tarea) =>
        tarea.id === tareaActualizada.id ? tareaActualizada : tarea
      )
    );
  }

  return (
    // BrowserRouter habilita la navegación sin recargar la página
    <BrowserRouter>
      {/* Navbar se renderiza fuera de Routes para estar presente en todas las rutas */}
      <Navbar />

      <main className="contenido-principal">
        <Routes>
          {/* Ruta raíz: lista de todas las tareas */}
          <Route
            path="/"
            element={
              <Home
                listaDeTareas={listaDeTareas}
                onEliminar={eliminarTarea}
              />
            }
          />

          {/* Ruta dinámica: detalle de una tarea por su id */}
          <Route
            path="/tarea/:id"
            element={
              <TaskDetail
                listaDeTareas={listaDeTareas}
                onEliminar={eliminarTarea}
              />
            }
          />

          {/* Ruta de creación: formulario para agregar una nueva tarea */}
          <Route
            path="/crear"
            element={<CreateTask agregarTarea={agregarTarea} />}
          />

          {/* Ruta de edición: formulario pre-cargado con los datos de la tarea */}
          <Route
            path="/editar/:id"
            element={
              <EditTask
                listaDeTareas={listaDeTareas}
                editarTarea={editarTarea}
              />
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
