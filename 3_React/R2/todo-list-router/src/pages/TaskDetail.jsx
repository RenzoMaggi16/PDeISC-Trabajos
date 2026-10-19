// TaskDetail — Página de detalle completo de una tarea (ruta "/tarea/:id")
//
// Usa useParams() para leer el id de la URL y encuentra la tarea
// correspondiente en la lista recibida por props.
// Si el id no coincide con ninguna tarea, muestra un estado de error amigable.
//
// Eliminación con confirmación en dos pasos:
//   Primer clic en "Eliminar" muestra un paso de confirmación en lugar de
//   eliminar inmediatamente. El segundo clic confirma la acción. Esto evita
//   eliminaciones accidentales sin necesidad de un modal externo.

import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

// Función utilitaria: formatea una fecha ISO 8601 a "dd/mm/aaaa"
function formatDate(fechaISO) {
  const fecha = new Date(fechaISO);
  const dia   = String(fecha.getDate()).padStart(2, '0');
  const mes   = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio  = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

// Props:
//   listaDeTareas — array de objetos tarea proveniente del estado de App
//   onEliminar    — función para eliminar la tarea del estado global
function TaskDetail({ listaDeTareas, onEliminar }) {
  // Obtener el parámetro dinámico :id desde la URL
  const { id } = useParams();
  const navegar = useNavigate();

  // Estado de confirmación: si es true se muestra el panel de confirmación de eliminación
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false);

  // Buscar la tarea que coincida con el id de la URL
  const tarea = listaDeTareas.find((t) => t.id === id);

  // Activa el modo de confirmación de eliminación
  function handleSolicitarEliminar() {
    setConfirmandoEliminar(true);
  }

  // Cancela el modo de confirmación
  function handleCancelarEliminar() {
    setConfirmandoEliminar(false);
  }

  // Confirma la eliminación: llama al handler global y redirige al inicio
  function handleConfirmarEliminar() {
    onEliminar(id);
    navegar('/');
  }

  // Navega al formulario de edición de esta tarea
  function handleEditar() {
    navegar(`/editar/${id}`);
  }

  // --- Estado de error: tarea no encontrada ---
  if (!tarea) {
    return (
      <div className="container">
        <div className="no-encontrada">
          <p className="no-encontrada-codigo">404</p>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Tarea no encontrada
          </h1>
          <p style={{ color: 'var(--color-texto-suave)', marginBottom: '2rem', maxWidth: '380px', margin: '0 auto 2rem' }}>
            El identificador de esta tarea no existe o la tarea fue eliminada.
            Vuelve al inicio para ver tu lista actualizada.
          </p>
          <Link to="/" className="btn-primario">
            ⬅ Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  // --- Vista de detalle: tarea encontrada ---
  return (
    <div className="container">
      {/* Botón de regreso al inicio */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/" className="btn-secundario">
          ⬅ Volver al inicio
        </Link>
      </div>

      {/* Tarjeta principal del detalle */}
      <article className="detalle-card animar-entrada" aria-label={`Detalle de tarea: ${tarea.titulo}`}>

        {/* Cabecera: badge + título + botones de acción */}
        <div className="detalle-cabecera">
          <div className="detalle-cabecera-izq">
            {tarea.completa ? (
              <span className="badge-completa">✓ Tarea completa</span>
            ) : (
              <span className="badge-incompleta">⏳ Tarea pendiente</span>
            )}
            <h1 className={`detalle-titulo${tarea.completa ? ' text-decoration-line-through' : ''}`}>
              {tarea.titulo}
            </h1>
          </div>

          {/* Botones de acción principales según el estado */}
          <div className="detalle-acciones">
            {!tarea.completa && (
              <button
                id="btn-editar-detalle"
                className="btn-accion-detalle btn-accion-detalle-editar"
                onClick={handleEditar}
                aria-label="Editar esta tarea"
              >
                ✏️ Editar
              </button>
            )}
            {tarea.completa && (
              <button
                id="btn-eliminar-detalle"
                className="btn-accion-detalle btn-accion-detalle-eliminar"
                onClick={handleSolicitarEliminar}
                aria-label="Eliminar esta tarea"
              >
                🗑 Eliminar
              </button>
            )}
          </div>
        </div>

        {/* Panel de confirmación de eliminación (dos pasos) */}
        {confirmandoEliminar && (
          <div className="panel-confirmacion" role="alert" aria-live="polite">
            <p className="panel-confirmacion-texto">
              ⚠️ ¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.
            </p>
            <div className="panel-confirmacion-botones">
              <button
                id="btn-confirmar-eliminar"
                className="btn-peligro"
                onClick={handleConfirmarEliminar}
              >
                Sí, eliminar
              </button>
              <button
                id="btn-cancelar-eliminar"
                className="btn-secundario"
                onClick={handleCancelarEliminar}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Metadatos: fecha de creación y estado */}
        <div className="detalle-meta">
          <div className="detalle-meta-item">
            <span>📅</span>
            <span>
              Creada el <strong>{formatDate(tarea.fechaCreacion)}</strong>
            </span>
          </div>
          <div className="detalle-meta-item">
            <span>🆔</span>
            <span>
              ID: <strong style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{tarea.id}</strong>
            </span>
          </div>
          <div className="detalle-meta-item">
            <span>📌</span>
            <span>
              Estado: <strong>{tarea.completa ? 'Completa' : 'Pendiente'}</strong>
            </span>
          </div>
        </div>

        {/* Descripción completa de la tarea */}
        <section aria-label="Descripción completa">
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-texto-suave)', marginBottom: '0.75rem' }}>
            Descripción
          </h2>
          <p className="detalle-descripcion">{tarea.descripcion}</p>
        </section>
      </article>
    </div>
  );
}

export default TaskDetail;
