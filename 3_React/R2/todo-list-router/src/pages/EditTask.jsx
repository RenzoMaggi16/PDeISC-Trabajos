// EditTask — Formulario de edición de una tarea existente (ruta "/editar/:id")
//
// Carga los datos actuales de la tarea en los campos del formulario.
// La lógica de validación es idéntica a CreateTask (mismas reglas, mensajes en español).
// Al guardar, llama a editarTarea() con el objeto actualizado y redirige al detalle.

import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// Longitud mínima requerida para el título
const TITULO_MIN_LARGO = 3;

// Función utilitaria: valida el campo título y retorna mensaje de error (vacío = sin error)
function validarTitulo(valor) {
  if (valor.trim().length === 0) return 'El título es obligatorio.';
  if (valor.trim().length < TITULO_MIN_LARGO) {
    return `El título debe tener al menos ${TITULO_MIN_LARGO} caracteres.`;
  }
  return '';
}

// Función utilitaria: valida el campo descripción y retorna mensaje de error (vacío = sin error)
function validarDescripcion(valor) {
  if (valor.trim().length === 0) return 'La descripción es obligatoria.';
  return '';
}

// Props:
//   listaDeTareas — array de objetos tarea proveniente del estado de App
//   editarTarea   — función para actualizar la tarea en el estado global
function EditTask({ listaDeTareas, editarTarea }) {
  const { id }  = useParams();
  const navegar = useNavigate();

  // Buscar la tarea a editar por su id
  const tareaOriginal = listaDeTareas.find((t) => t.id === id);

  // --- Estado del formulario: inicializado con los datos existentes de la tarea ---
  const [titulo,      setTitulo]      = useState(tareaOriginal ? tareaOriginal.titulo      : '');
  const [descripcion, setDescripcion] = useState(tareaOriginal ? tareaOriginal.descripcion : '');
  const [completa,    setCompleta]    = useState(tareaOriginal ? tareaOriginal.completa    : false);

  // --- Estado de errores de validación ---
  const [errorTitulo,      setErrorTitulo]      = useState('');
  const [errorDescripcion, setErrorDescripcion] = useState('');

  // --- Estado de interacción (para no mostrar errores antes de que el usuario toque el campo) ---
  const [tituloTocado,      setTituloTocado]      = useState(false);
  const [descripcionTocada, setDescripcionTocada] = useState(false);

  // Si la tarea no existe en la lista, mostrar estado de error
  if (!tareaOriginal) {
    return (
      <div className="container">
        <div className="no-encontrada">
          <p className="no-encontrada-codigo">404</p>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Tarea no encontrada
          </h1>
          <p style={{ color: 'var(--color-texto-suave)', marginBottom: '2rem' }}>
            No se puede editar una tarea que no existe.
          </p>
          <Link to="/" className="btn-primario">⬅ Volver al inicio</Link>
        </div>
      </div>
    );
  }

  // Determinar si el formulario está en estado válido
  const formularioValido =
    validarTitulo(titulo) === '' && validarDescripcion(descripcion) === '';

  // --- Manejadores de cambio con validación en tiempo real ---
  function handleCambioTitulo(e) {
    const v = e.target.value;
    setTitulo(v);
    if (tituloTocado) setErrorTitulo(validarTitulo(v));
  }

  function handleBlurTitulo() {
    setTituloTocado(true);
    setErrorTitulo(validarTitulo(titulo));
  }

  function handleCambioDescripcion(e) {
    const v = e.target.value;
    setDescripcion(v);
    if (descripcionTocada) setErrorDescripcion(validarDescripcion(v));
  }

  function handleBlurDescripcion() {
    setDescripcionTocada(true);
    setErrorDescripcion(validarDescripcion(descripcion));
  }

  function handleCambioCompleta(e) {
    setCompleta(e.target.checked);
  }

  // --- Manejador de envío: actualiza la tarea y redirige al detalle ---
  function handleSubmit(e) {
    e.preventDefault();

    // Validación final antes de procesar
    const errT = validarTitulo(titulo);
    const errD = validarDescripcion(descripcion);
    if (errT || errD) {
      setTituloTocado(true);
      setDescripcionTocada(true);
      setErrorTitulo(errT);
      setErrorDescripcion(errD);
      return;
    }

    // Construir objeto tarea actualizado, preservando id y fecha de creación original
    const tareaActualizada = {
      ...tareaOriginal,
      titulo:      titulo.trim(),
      descripcion: descripcion.trim(),
      completa,
    };

    // Actualizar en el estado global
    editarTarea(tareaActualizada);

    // Redirigir al detalle de la tarea editada
    navegar(`/tarea/${id}`);
  }

  // Clases de input según estado de validación
  function claseInputTitulo() {
    if (!tituloTocado) return 'form-control-custom';
    return `form-control-custom ${errorTitulo ? 'error' : 'valido'}`;
  }

  function claseInputDescripcion() {
    if (!descripcionTocada) return 'form-control-custom';
    return `form-control-custom ${errorDescripcion ? 'error' : 'valido'}`;
  }

  return (
    <div className="container">
      {/* Botón de regreso — siempre presente en sub-páginas */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to={`/tarea/${id}`} className="btn-secundario">
          ⬅ Volver al detalle
        </Link>
      </div>

      {/* Encabezado de página */}
      <header className="encabezado-pagina">
        <h1 className="titulo-pagina">Editar Tarea</h1>
        <p className="subtitulo-pagina">
          Modifica los campos que desees y guarda los cambios.
        </p>
      </header>

      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="form-card animar-entrada">
            {/* Indicador visual de la tarea que se está editando */}
            <div className="edit-indicador">
              <span className="edit-indicador-icono">✏️</span>
              <span className="edit-indicador-texto">Editando: <strong>{tareaOriginal.titulo}</strong></span>
            </div>

            {/* Formulario controlado — sin atributos de validación HTML5 nativos */}
            <form onSubmit={handleSubmit} noValidate>

              {/* Campo: Título */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="edit-titulo" className="form-label-custom">
                  Título <span style={{ color: 'var(--color-peligro)' }}>*</span>
                </label>
                <input
                  id="edit-titulo"
                  type="text"
                  className={claseInputTitulo()}
                  value={titulo}
                  onChange={handleCambioTitulo}
                  onBlur={handleBlurTitulo}
                  placeholder="Ej: Revisar informe mensual"
                  aria-describedby={errorTitulo ? 'error-edit-titulo' : undefined}
                  aria-invalid={tituloTocado && !!errorTitulo}
                  maxLength={100}
                  autoComplete="off"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  {tituloTocado && errorTitulo ? (
                    <p id="error-edit-titulo" className="mensaje-error" role="alert">
                      ⚠ {errorTitulo}
                    </p>
                  ) : <span />}
                  <span className={`contador-caracteres${titulo.length > 80 ? ' alerta' : ''}`}>
                    {titulo.length}/100
                  </span>
                </div>
              </div>

              {/* Campo: Descripción */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="edit-descripcion" className="form-label-custom">
                  Descripción <span style={{ color: 'var(--color-peligro)' }}>*</span>
                </label>
                <textarea
                  id="edit-descripcion"
                  className={claseInputDescripcion()}
                  value={descripcion}
                  onChange={handleCambioDescripcion}
                  onBlur={handleBlurDescripcion}
                  placeholder="Describe los detalles, pasos o contexto de la tarea..."
                  rows={5}
                  aria-describedby={errorDescripcion ? 'error-edit-descripcion' : undefined}
                  aria-invalid={descripcionTocada && !!errorDescripcion}
                  maxLength={500}
                  style={{ resize: 'vertical' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  {descripcionTocada && errorDescripcion ? (
                    <p id="error-edit-descripcion" className="mensaje-error" role="alert">
                      ⚠ {errorDescripcion}
                    </p>
                  ) : <span />}
                  <span className={`contador-caracteres${descripcion.length > 400 ? ' alerta' : ''}`}>
                    {descripcion.length}/500
                  </span>
                </div>
              </div>

              {/* Campo: Estado de completitud */}
              <div style={{ marginBottom: '2rem' }}>
                <label htmlFor="edit-completa" className="form-check-custom">
                  <input
                    id="edit-completa"
                    type="checkbox"
                    className="form-check-input-custom"
                    checked={completa}
                    onChange={handleCambioCompleta}
                  />
                  <span className="form-check-label-custom">
                    Marcar como completada
                  </span>
                </label>
              </div>

              <div className="divider" />

              {/* Botones de acción */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <Link to={`/tarea/${id}`} className="btn-secundario">
                  Cancelar
                </Link>
                <button
                  id="btn-guardar-edicion"
                  type="submit"
                  className="btn-primario"
                  disabled={!formularioValido && (tituloTocado || descripcionTocada)}
                  aria-label="Guardar cambios de la tarea"
                >
                  💾 Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTask;
