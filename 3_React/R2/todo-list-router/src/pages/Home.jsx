// Home — Página principal de la aplicación (ruta "/")
//
// Recibe la lista de tareas desde App vía props y las muestra en una
// cuadrícula Bootstrap responsive. Si la lista está vacía, presenta un
// estado vacío con mensaje amigable y botón de llamada a la acción.

import { Link } from 'react-router-dom';
import TaskCard from '../components/TaskCard.jsx';

// Props:
//   listaDeTareas — array de objetos tarea proveniente del estado de App
//   onEliminar    — función para eliminar una tarea del estado global
function Home({ listaDeTareas, onEliminar }) {
  // Calcular estadísticas para el encabezado
  const totalTareas      = listaDeTareas.length;
  const tareasCompletas  = listaDeTareas.filter((t) => t.completa).length;
  const tareasPendientes = totalTareas - tareasCompletas;

  return (
    <div className="container">
      {/* Encabezado de página con estadísticas */}
      <header className="encabezado-pagina">
        <div className="row align-items-center g-3">
          <div className="col">
            <h1 className="titulo-pagina">Mis Tareas</h1>
            {totalTareas > 0 && (
              <p className="subtitulo-pagina">
                {tareasPendientes} pendiente{tareasPendientes !== 1 ? 's' : ''}
                &nbsp;·&nbsp;
                {tareasCompletas} completa{tareasCompletas !== 1 ? 's' : ''}
                &nbsp;·&nbsp;
                {totalTareas} en total
              </p>
            )}
          </div>

          {/* Botón de acción principal para crear una nueva tarea */}
          {totalTareas > 0 && (
            <div className="col-auto">
              <Link to="/crear" className="btn-primario">
                ＋ Nueva Tarea
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Estado vacío: se muestra cuando no hay tareas en la lista */}
      {totalTareas === 0 && (
        <section className="estado-vacio" aria-label="Sin tareas disponibles">
          <span className="estado-vacio-icono" role="img" aria-label="Cuaderno vacío">
            📋
          </span>
          <h2 className="estado-vacio-titulo">¡Todavía no hay tareas!</h2>
          <p className="estado-vacio-mensaje">
            Parece que tu lista está vacía. Crea tu primera tarea y empieza
            a organizar tu día con TareaFlow.
          </p>
          <Link to="/crear" className="btn-primario">
            ＋ Crear mi primera tarea
          </Link>
        </section>
      )}

      {/* Cuadrícula de tarjetas de tareas */}
      {totalTareas > 0 && (
        <section aria-label="Lista de tareas">
          <div className="row g-4">
            {listaDeTareas.map((tarea) => (
              // col-card se usa para los estilos de animación escalonada en App.css
              <div
                key={tarea.id}
                className="col-12 col-sm-6 col-lg-4 col-card"
              >
                <TaskCard tarea={tarea} onEliminar={onEliminar} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
