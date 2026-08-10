import React from 'react';

// Componente presentacional para renderizar una tarea individual
const Tarea = ({ tarea, onToggle, onEliminar }) => {
  const handleToggleClick = () => {
    onToggle(tarea.id);
  };

  const handleEliminarClick = (e) => {
    e.stopPropagation();
    onEliminar(tarea.id);
  };

  // Retorna clase CSS según prioridad
  const getPriorityClass = () => {
    if (tarea.prioridad === 'alta')  return 'priority-badge priority-alta';
    if (tarea.prioridad === 'baja')  return 'priority-badge priority-baja';
    return 'priority-badge priority-media';
  };

  const getPriorityLabel = () => {
    if (tarea.prioridad === 'alta')  return '🔴 Alta';
    if (tarea.prioridad === 'baja')  return '🟢 Baja';
    return '🟡 Media';
  };

  return (
    <div className={`task-item d-flex align-items-center justify-content-between mb-2 ${tarea.completada ? 'completed' : ''}`}>
      <div
        className="d-flex align-items-center gap-3 flex-grow-1"
        style={{ cursor: 'pointer' }}
        onClick={handleToggleClick}
      >
        <input
          type="checkbox"
          className="form-check-input mt-0"
          checked={tarea.completada}
          onChange={handleToggleClick}
          aria-label={`Marcar "${tarea.texto}" como ${tarea.completada ? 'pendiente' : 'completada'}`}
        />
        <span className="task-text text-break">{tarea.texto}</span>
      </div>

      <div className="d-flex align-items-center gap-2 ms-2 flex-shrink-0">
        <span className={getPriorityClass()}>{getPriorityLabel()}</span>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={handleEliminarClick}
          title="Eliminar tarea"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default Tarea;
