import React, { useState } from 'react';
import Tarea from './Tarea';
import './ListaTareas.css';

// Componente contenedor que maneja la lista de tareas y su lógica
const ListaTareas = () => {
  // Lista inicial de tareas
  const [tareas, setTareas] = useState([
    { id: 1, texto: 'Aprender la estructura de proyectos React + Vite', completada: true,  prioridad: 'alta' },
    { id: 2, texto: 'Comprender el flujo de Props entre componentes',    completada: true,  prioridad: 'alta' },
    { id: 3, texto: 'Practicar la inmutabilidad del estado en React',    completada: false, prioridad: 'media' },
    { id: 4, texto: 'Implementar filtros de visualización',              completada: false, prioridad: 'baja' }
  ]);

  const [nuevoTexto, setNuevoTexto] = useState('');
  const [nuevaPrioridad, setNuevaPrioridad] = useState('media');
  const [filtro, setFiltro] = useState('todas');
  const [errorMsg, setErrorMsg] = useState('');

  // Manejador del cambio en el input
  const handleInputChange = (e) => {
    setNuevoTexto(e.target.value);
    if (errorMsg) setErrorMsg('');
  };

  const handlePrioridadChange = (e) => {
    setNuevaPrioridad(e.target.value);
  };

  // Agrega una tarea de forma inmutable
  const handleAgregarTarea = (e) => {
    e.preventDefault();
    const textoLimpio = nuevoTexto.trim();
    if (!textoLimpio) {
      setErrorMsg('Por favor escribe el contenido de la tarea antes de agregar.');
      return;
    }
    const nuevaTarea = {
      id: Date.now(),
      texto: textoLimpio,
      completada: false,
      prioridad: nuevaPrioridad
    };
    setTareas((prev) => [nuevaTarea, ...prev]);
    setNuevoTexto('');
    setErrorMsg('');
  };

  // Alterna completada sin mutar el estado
  const handleToggleTarea = (id) => {
    setTareas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completada: !t.completada } : t))
    );
  };

  // Elimina una tarea sin mutar el estado
  const handleEliminarTarea = (id) => {
    setTareas((prev) => prev.filter((t) => t.id !== id));
  };

  // ── Filtrar tareas según filtro activo ──
  const tareasFiltradas = tareas.filter((t) => {
    if (filtro === 'pendientes')  return !t.completada;
    if (filtro === 'completadas') return t.completada;
    return true;
  });

  // Contadores para la barra de filtros
  const totalPendientes  = tareas.filter((t) => !t.completada).length;
  const totalCompletadas = tareas.filter((t) => t.completada).length;

  return (
    <div className="card todo-card p-4">
      <div className="card-body">

        {/* Título */}
        <h4 className="mb-4 font-weight-bold" style={{ color: 'var(--text-primary)' }}>
          📋 Gestor de Tareas
        </h4>

        {/* ── Formulario de nueva tarea ── */}
        <form onSubmit={handleAgregarTarea} className="mb-3">
          <div className="row g-2 align-items-end">
            <div className="col-sm-7">
              <div className="input-group task-input-group">
                <input
                  type="text"
                  className={`form-control ${errorMsg ? 'is-invalid' : ''}`}
                  placeholder="Escribe una nueva tarea..."
                  value={nuevoTexto}
                  onChange={handleInputChange}
                />
                <button className="btn px-4" type="submit">
                  + Agregar
                </button>
              </div>
            </div>
            <div className="col-sm-3">
              <select
                className="priority-select w-100"
                value={nuevaPrioridad}
                onChange={handlePrioridadChange}
              >
                <option value="alta">🔴 Alta</option>
                <option value="media">🟡 Media</option>
                <option value="baja">🟢 Baja</option>
              </select>
            </div>
          </div>
          {errorMsg && (
            <div className="text-danger small mt-2">⚠️ {errorMsg}</div>
          )}
        </form>

        {/* ── Barra de filtros ── */}
        <div className="filter-buttons mb-4">
          {[
            { key: 'todas',       label: `Todas (${tareas.length})` },
            { key: 'pendientes',  label: `Pendientes (${totalPendientes})` },
            { key: 'completadas', label: `Completadas (${totalCompletadas})` }
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`btn btn-filter ${filtro === key ? 'active' : ''}`}
              onClick={() => setFiltro(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Lista de tareas o estado vacío ── */}
        {tareasFiltradas.length > 0 ? (
          <div className="task-list">
            {tareasFiltradas.map((tarea) => (
              <Tarea
                key={tarea.id}
                tarea={tarea}
                onToggle={handleToggleTarea}
                onEliminar={handleEliminarTarea}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              {filtro === 'completadas' ? '✅' : filtro === 'pendientes' ? '🎉' : '📝'}
            </div>
            <p className="mb-1">
              {filtro === 'completadas' && '¡No hay tareas completadas todavía!'}
              {filtro === 'pendientes'  && '¡No hay tareas pendientes! Todo está listo.'}
              {filtro === 'todas'       && '¡No hay tareas pendientes!'}
            </p>
            <small style={{ color: 'var(--text-secondary)' }}>
              {filtro === 'todas' && 'Agrega una nueva tarea arriba para comenzar.'}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaTareas;
