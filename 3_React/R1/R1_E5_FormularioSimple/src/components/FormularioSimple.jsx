import React, { useState } from 'react';
import './FormularioSimple.css';

// Componente de Formulario con múltiples campos y validación estricta
const FormularioSimple = () => {
  // Estados para los campos del formulario
  const [nombre,   setNombre]   = useState('');
  const [apellido, setApellido] = useState('');
  const [edad,     setEdad]     = useState('');
  const [email,    setEmail]    = useState('');

  // Estado para capturar los mensajes de error
  const [errors, setErrors] = useState({
    nombre:   '',
    apellido: '',
    edad:     '',
    email:    ''
  });

  // Datos del formulario enviado con éxito
  const [submittedData, setSubmittedData] = useState(null);

  // Expresiones regulares para validación de datos
  const SOLO_LETRAS  = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  const CHAR_LETRA   = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]$/;
  const REGEX_EMAIL  = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const TECLAS_CTRL  = ['Backspace','Delete','Tab','Enter','ArrowLeft','ArrowRight','Home','End'];

  // Evita caracteres que no sean letras en campos de texto
  const handleKeyDownTexto = (e) => {
    if (TECLAS_CTRL.includes(e.key)) return;
    if (!CHAR_LETRA.test(e.key)) {
      e.preventDefault();
    }
  };

  // Evita caracteres no numéricos en edad
  const handleKeyDownNumero = (e) => {
    if (TECLAS_CTRL.includes(e.key)) return;
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Cambia el valor del input y limpia el error asociado
  const handleChange = (setter, field) => (e) => {
    setter(e.target.value);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Realiza validaciones del lado del cliente
  const validar = () => {
    const nuevosErrores = { nombre: '', apellido: '', edad: '', email: '' };
    let valido = true;

    const nombreLimpio   = nombre.trim();
    const apellidoLimpio = apellido.trim();
    const edadLimpia     = edad.trim();
    const emailLimpio    = email.trim();

    if (!nombreLimpio) {
      nuevosErrores.nombre = 'El nombre es obligatorio.';
      valido = false;
    } else if (!SOLO_LETRAS.test(nombreLimpio)) {
      nuevosErrores.nombre = 'El nombre solo puede contener letras y espacios.';
      valido = false;
    }

    if (!apellidoLimpio) {
      nuevosErrores.apellido = 'El apellido es obligatorio.';
      valido = false;
    } else if (!SOLO_LETRAS.test(apellidoLimpio)) {
      nuevosErrores.apellido = 'El apellido solo puede contener letras y espacios.';
      valido = false;
    }

    if (!edadLimpia) {
      nuevosErrores.edad = 'La edad es obligatoria.';
      valido = false;
    } else {
      const edadNum = parseInt(edadLimpia, 10);
      if (isNaN(edadNum) || edadNum < 1 || edadNum > 120) {
        nuevosErrores.edad = 'Ingresa una edad válida entre 1 y 120 años.';
        valido = false;
      }
    }

    if (!emailLimpio) {
      nuevosErrores.email = 'El correo electrónico es obligatorio.';
      valido = false;
    } else if (!REGEX_EMAIL.test(emailLimpio)) {
      nuevosErrores.email = 'Ingresa un correo electrónico válido (ej. usuario@dominio.com).';
      valido = false;
    }

    setErrors(nuevosErrores);
    return valido;
  };

  // Procesa el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validar()) return;

    setSubmittedData({
      nombre:   nombre.trim(),
      apellido: apellido.trim(),
      edad:     edad.trim(),
      email:    email.trim()
    });

    // Limpia los campos del formulario tras envío exitoso
    setNombre('');
    setApellido('');
    setEdad('');
    setEmail('');
  };

  return (
    <div className="row g-4">
      {/* ── Columna del formulario ── */}
      <div className="col-lg-6">
        <div className="card form-card p-4 h-100">
          <div className="card-body">
            <h4 className="mb-1" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              📝 Registro de Usuario
            </h4>
            <p className="mb-4" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Completa todos los campos para continuar.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {/* ── Nombre y Apellido en fila ── */}
              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label htmlFor="nombreInput" className="form-field-label">
                    Nombre *
                  </label>
                  <input
                    id="nombreInput"
                    type="text"
                    className={`custom-input ${errors.nombre ? 'is-invalid' : nombre.trim() ? 'is-valid' : ''}`}
                    placeholder="Ej. María"
                    value={nombre}
                    onChange={handleChange(setNombre, 'nombre')}
                    onKeyDown={handleKeyDownTexto}
                    autoComplete="given-name"
                  />
                  {errors.nombre
                    ? <div className="field-error">⚠️ {errors.nombre}</div>
                    : <div className="field-hint">Solo letras y espacios</div>
                  }
                </div>

                <div className="col-sm-6">
                  <label htmlFor="apellidoInput" className="form-field-label">
                    Apellido *
                  </label>
                  <input
                    id="apellidoInput"
                    type="text"
                    className={`custom-input ${errors.apellido ? 'is-invalid' : apellido.trim() ? 'is-valid' : ''}`}
                    placeholder="Ej. González"
                    value={apellido}
                    onChange={handleChange(setApellido, 'apellido')}
                    onKeyDown={handleKeyDownTexto}
                    autoComplete="family-name"
                  />
                  {errors.apellido
                    ? <div className="field-error">⚠️ {errors.apellido}</div>
                    : <div className="field-hint">Solo letras y espacios</div>
                  }
                </div>
              </div>

              {/* ── Edad ── */}
              <div className="mb-3">
                <label htmlFor="edadInput" className="form-field-label">
                  Edad *
                </label>
                <input
                  id="edadInput"
                  type="text"
                  inputMode="numeric"
                  className={`custom-input ${errors.edad ? 'is-invalid' : edad.trim() ? 'is-valid' : ''}`}
                  placeholder="Ej. 25"
                  value={edad}
                  onChange={handleChange(setEdad, 'edad')}
                  onKeyDown={handleKeyDownNumero}
                  maxLength={3}
                  autoComplete="age"
                />
                {errors.edad
                  ? <div className="field-error">⚠️ {errors.edad}</div>
                  : <div className="field-hint">Solo números, entre 1 y 120</div>
                }
              </div>

              {/* ── Email ── */}
              <div className="mb-4">
                <label htmlFor="emailInput" className="form-field-label">
                  Correo Electrónico *
                </label>
                <input
                  id="emailInput"
                  type="email"
                  className={`custom-input ${errors.email ? 'is-invalid' : email.trim() ? 'is-valid' : ''}`}
                  placeholder="Ej. usuario@dominio.com"
                  value={email}
                  onChange={handleChange(setEmail, 'email')}
                  autoComplete="email"
                />
                {errors.email
                  ? <div className="field-error">⚠️ {errors.email}</div>
                  : <div className="field-hint">Formato: usuario@dominio.com</div>
                }
              </div>

              <button type="submit" className="btn btn-form-submit w-100">
                Registrar y Continuar →
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Columna de la tarjeta de bienvenida / placeholder ── */}
      <div className="col-lg-6">
        {submittedData ? (
          <div className="card welcome-card p-4 h-100">
            <div className="card-body d-flex flex-column justify-content-center text-center">
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
              <h3 className="mb-2" style={{ color: 'var(--text-primary)', fontWeight: 800 }}>
                ¡Bienvenido/a,{' '}
                <span className="welcome-name">
                  {submittedData.nombre} {submittedData.apellido}
                </span>
                !
              </h3>
              <p className="mb-4" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Tu registro fue procesado con éxito.
              </p>

              <hr className="section-divider" />

              <div className="text-start mt-3">
                {[
                  { label: '👤 Nombre completo', value: `${submittedData.nombre} ${submittedData.apellido}` },
                  { label: '🎂 Edad',             value: `${submittedData.edad} años` },
                  { label: '✉️ Correo',           value: submittedData.email }
                ].map(({ label, value }) => (
                  <div key={label} className="mb-3">
                    <div className="field-hint mb-1">{label}</div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{value}</div>
                  </div>
                ))}
              </div>

              <button
                className="btn btn-outline-secondary mt-3"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', borderRadius: '0.65rem' }}
                onClick={() => setSubmittedData(null)}
              >
                Registrar otro usuario
              </button>
            </div>
          </div>
        ) : (
          <div className="card form-card p-4 h-100 d-flex align-items-center justify-content-center text-center">
            <div style={{ opacity: 0.4 }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👤</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Completa el formulario para ver la tarjeta de bienvenida.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioSimple;
