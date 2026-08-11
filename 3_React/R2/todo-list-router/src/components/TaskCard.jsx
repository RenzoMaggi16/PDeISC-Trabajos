// TaskCard — Tarjeta individual de tarea
//
// Estrategia de interactividad:
//   Toda la card es clicable (navega a detalle) via useNavigate + onClick.
//   Los botones Editar/Eliminar usan e.stopPropagation() para interceptar
//   el click antes de que llegue al handler de la card, evitando la navegación
//   involuntaria al hacer clic en una acción.
//   Esto también resuelve el problema de elementos interactivos anidados (<a> o
//   <button> dentro de un <a>) que genera HTML inválido.

import { useNavigate } from 'react-router-dom';

// Función utilitaria: recorta el texto a un máximo de caracteres con "..."
function truncateText(texto, maxChars = 110) {
  if (texto.length <= maxChars) return texto;
  return texto.slice(0, maxChars).trimEnd() + '…';
}

// Props:
//   tarea     — objeto con { id, titulo, descripcion, fechaCreacion, completa }
//   onEliminar — función para eliminar la tarea del estado global
function TaskCard({ tarea, onEliminar }) {
  const navegar = useNavigate();

  // Navega al detalle de la tarea al hacer clic en la card
  function handleClickCard() {
    navegar(`/tarea/${tarea.id}`);
  }

  // Navega al formulario de edición sin propagar el click a la card
  function handleEditar(e) {
    e.stopPropagation();
    navegar(`/editar/${tarea.id}`);
  }

  // Llama al handler de eliminación sin propagar el click a la card
  function handleEliminar(e) {
    e.stopPropagation();
    onEliminar(tarea.id);
  }

  // Clase condicional para el estilo de la card según el estado de la tarea
  const claseCard = `task-card animar-entrada${tarea.completa ? ' completa' : ''}`;

  return (
    // article es el elemento raíz clicable — role="button" para accesibilidad
    <article
      className={claseCard}
      onClick={handleClickCard}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalle de tarea: ${tarea.titulo}`}
      onKeyDown={(e) => e.key === 'Enter' && handleClickCard()}
    >
      {/* Badge de estado en la parte superior */}
      <div>
        {tarea.completa ? (
          <span className="badge-completa">✓ Completa</span>
        ) : (
          <span className="badge-incompleta">⏳ Pendiente</span>
        )}
      </div>

      {/* Título de la tarea */}
      <h2 className="task-card-titulo">{tarea.titulo}</h2>

      {/* Descripción truncada para mantener la grilla uniforme */}
      <p className="task-card-descripcion">
        {truncateText(tarea.descripcion)}
      </p>

      {/* Pie de la card: botones de acción */}
      <footer className="task-card-footer">
        {/* Botones de acción — stopPropagation evita navegar al detalle */}
        <div className="acciones-card">
          <button
            className="btn-accion btn-accion-editar"
            onClick={handleEditar}
            aria-label={`Editar tarea: ${tarea.titulo}`}
            title="Editar tarea"
          >
            ✏️ Editar
          </button>
          <button
            className="btn-accion btn-accion-eliminar"
            onClick={handleEliminar}
            aria-label={`Eliminar tarea: ${tarea.titulo}`}
            title="Eliminar tarea"
          >
            🗑 Eliminar
          </button>
        </div>

        <span className="task-card-flecha" aria-hidden="true">→</span>
      </footer>
    </article>
  );
}

export default TaskCard;
