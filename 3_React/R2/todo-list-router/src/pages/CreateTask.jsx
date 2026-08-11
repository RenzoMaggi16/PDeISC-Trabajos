// CreateTask — Formulario de creación de tareas (ruta "/crear")
//
// Implementa un formulario controlado con validación en tiempo real.
// La validación es manejada íntegramente por React (sin atributos HTML5
// "required", "minlength", etc.) para tener control total sobre los mensajes
// de error en español y la lógica de habilitación del botón.
//
// Al enviar el formulario correctamente:
//   1. Construye el objeto tarea con crypto.randomUUID() y la fecha actual.
//   2. Llama a agregarTarea() para actualizar el estado en App.
//   3. Redirige al usuario a "/" con useNavigate().

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Función utilitaria: genera un ID único usando la API nativa del navegador
function generateId() {
  return crypto.randomUUID();
}

// Longitud mínima requerida para el título
const TITULO_MIN_LARGO = 3;

// Props:
//   agregarTarea — función del estado de App para agregar una nueva tarea
function CreateTask({ agregarTarea }) {
  // Hook de navegación programática para redirigir tras crear la tarea
  const navegar = useNavigate();

  // --- Estado del formulario ---
  const [titulo,      setTitulo]      = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [completa,    setCompleta]    = useState(false);

  // --- Estado de errores de validación ---
  const [errorTitulo,      setErrorTitulo]      = useState('');
  const [errorDescripcion, setErrorDescripcion] = useState('');

  // --- Estado de interacción (para no mostrar errores antes de que el usuario toque el campo) ---
  const [tituloTocado,      setTituloTocado]      = useState(false);
  const [descripcionTocada, setDescripcionTocada] = useState(false);

  // --- Validadores individuales ---
  // Valida el campo título y retorna el mensaje de error (vacío = sin error)
  function validarTitulo(valor) {
    if (valor.trim().length === 0) {
      return 'El título es obligatorio.';
    }
    if (valor.trim().length < TITULO_MIN_LARGO) {
      return `El título debe tener al menos ${TITULO_MIN_LARGO} caracteres.`;
    }
    return '';
  }

  // Valida el campo descripción y retorna el mensaje de error (vacío = sin error)
  function validarDescripcion(valor) {
    if (valor.trim().length === 0) {
      return 'La descripción es obligatoria.';
    }
    return '';
  }

  // --- Determine si el formulario es válido para habilitar el botón ---
  const formularioValido =
    validarTitulo(titulo) === '' &&
    validarDescripcion(descripcion) === '';

  // --- Manejadores de cambio con validación en tiempo real ---

  function handleCambioTitulo(evento) {
    const nuevoValor = evento.target.value;
    setTitulo(nuevoValor);
    // Solo mostrar error si el usuario ya tocó el campo al menos una vez
    if (tituloTocado) {
      setErrorTitulo(validarTitulo(nuevoValor));
    }
  }

  function handleBlurTitulo() {
    // Marcar el campo como tocado y ejecutar validación al perder el foco
    setTituloTocado(true);
    setErrorTitulo(validarTitulo(titulo));
  }

  function handleCambioDescripcion(evento) {
    const nuevoValor = evento.target.value;
    setDescripcion(nuevoValor);
    if (descripcionTocada) {
      setErrorDescripcion(validarDescripcion(nuevoValor));
    }
  }

  function handleBlurDescripcion() {
    setDescripcionTocada(true);
    setErrorDescripcion(validarDescripcion(descripcion));
  }

  function handleCambioCompleta(evento) {
    setCompleta(evento.target.checked);
  }

  // --- Manejador de envío del formulario ---
  function handleSubmit(evento) {
    // Prevenir el comportamiento nativo del navegador (recarga de página)
    evento.preventDefault();

    // Ejecutar validación final sobre todos los campos antes de procesar
    const errorFinalTitulo      = validarTitulo(titulo);
    const errorFinalDescripcion = validarDescripcion(descripcion);

    // Si hay errores, mostrarlos y abortar el envío
    if (errorFinalTitulo || errorFinalDescripcion) {
      setTituloTocado(true);
      setDescripcionTocada(true);
      setErrorTitulo(errorFinalTitulo);
      setErrorDescripcion(errorFinalDescripcion);
      return;
    }

    // Construir el objeto tarea con todos los campos requeridos por el modelo de datos
    const nuevaTarea = {
      id:             generateId(),
      titulo:         titulo.trim(),
      descripcion:    descripcion.trim(),
      fechaCreacion:  new Date().toISOString(),
      completa,
    };

    // Actualizar el estado global en App — la tarea aparecerá inmediatamente en Home
    agregarTarea(nuevaTarea);

    // Redirigir a la página principal tras la creación exitosa
    navegar('/');
  }

  // Determinar la clase del input de título según su estado de validación
  function claseInputTitulo() {
    if (!tituloTocado) return 'form-control-custom';
    return `form-control-custom ${errorTitulo ? 'error' : 'valido'}`;
  }

  // Determinar la clase del textarea de descripción según su estado de validación
  function claseInputDescripcion() {
    if (!descripcionTocada) return 'form-control-custom';
    return `form-control-custom ${errorDescripcion ? 'error' : 'valido'}`;
  }

  return (
    <div className="container">
      {/* Botón de regreso al inicio — requerido en todas las sub-páginas */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/" className="btn-secundario">
          ⬅ Volver al inicio
        </Link>
      </div>

      {/* Encabezado de página */}
      <header className="encabezado-pagina">
        <h1 className="titulo-pagina">Nueva Tarea</h1>
        <p className="subtitulo-pagina">
          Completa los campos para agregar una tarea a tu lista.
        </p>
      </header>

      {/* Contenedor del formulario */}
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="form-card animar-entrada">
            {/* Formulario controlado — sin atributos de validación HTML5 nativos */}
            <form onSubmit={handleSubmit} noValidate>

              {/* Campo: Título */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="campo-titulo" className="form-label-custom">
                  Título <span style={{ color: 'var(--color-peligro)' }}>*</span>
                </label>
                <input
                  id="campo-titulo"
                  type="text"
                  className={claseInputTitulo()}
                  value={titulo}
                  onChange={handleCambioTitulo}
                  onBlur={handleBlurTitulo}
                  placeholder="Ej: Revisar informe mensual"
                  aria-describedby={errorTitulo ? 'error-titulo' : undefined}
                  aria-invalid={tituloTocado && !!errorTitulo}
                  maxLength={100}
                  autoComplete="off"
                />

                {/* Contador de caracteres y error de validación */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  {/* Mensaje de error inline */}
                  {tituloTocado && errorTitulo ? (
                    <p id="error-titulo" className="mensaje-error" role="alert">
                      ⚠ {errorTitulo}
                    </p>
                  ) : (
                    <span />
                  )}
                  {/* Contador de caracteres */}
                  <span className={`contador-caracteres${titulo.length > 80 ? ' alerta' : ''}`}>
                    {titulo.length}/100
                  </span>
                </div>
              </div>

              {/* Campo: Descripción */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="campo-descripcion" className="form-label-custom">
                  Descripción <span style={{ color: 'var(--color-peligro)' }}>*</span>
                </label>
                <textarea
                  id="campo-descripcion"
                  className={claseInputDescripcion()}
                  value={descripcion}
                  onChange={handleCambioDescripcion}
                  onBlur={handleBlurDescripcion}
                  placeholder="Describe los detalles, pasos o contexto de la tarea..."
                  rows={5}
                  aria-describedby={errorDescripcion ? 'error-descripcion' : undefined}
                  aria-invalid={descripcionTocada && !!errorDescripcion}
                  maxLength={500}
                  style={{ resize: 'vertical' }}
                />

                {/* Contador y error de descripción */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  {descripcionTocada && errorDescripcion ? (
                    <p id="error-descripcion" className="mensaje-error" role="alert">
                      ⚠ {errorDescripcion}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className={`contador-caracteres${descripcion.length > 400 ? ' alerta' : ''}`}>
                    {descripcion.length}/500
                  </span>
                </div>
              </div>

              {/* Campo: Marcar como completa */}
              <div style={{ marginBottom: '2rem' }}>
                <label htmlFor="campo-completa" className="form-check-custom">
                  <input
                    id="campo-completa"
                    type="checkbox"
                    className="form-check-input-custom"
                    checked={completa}
                    onChange={handleCambioCompleta}
                  />
                  <span className="form-check-label-custom">
                    Marcar como completada desde el inicio
                  </span>
                </label>
              </div>

              {/* Separador visual */}
              <div className="divider" />

              {/* Botones de acción */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <Link to="/" className="btn-secundario">
                  Cancelar
                </Link>
                <button
                  id="btn-crear-tarea"
                  type="submit"
                  className="btn-primario"
                  disabled={!formularioValido && (tituloTocado || descripcionTocada)}
                  aria-label="Crear nueva tarea"
                >
                  ✓ Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTask;
