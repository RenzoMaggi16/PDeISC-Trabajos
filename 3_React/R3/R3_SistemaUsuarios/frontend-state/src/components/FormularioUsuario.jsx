// Formulario reutilizable para registro y edicion de usuario utilizando React Hook Form (Frontend State)
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export function FormularioUsuario({
  modo = 'registro',
  valoresIniciales = {},
  onSubmit,
  onCancelar,
  cargando = false
}) {
  const esModoEdicion = modo === 'edicion';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: valoresIniciales
  });

  useEffect(() => {
    reset(valoresIniciales);
  }, [valoresIniciales, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Campo: Nombre completo */}
      <div className="mb-3">
        <label htmlFor="state-campo-nombre" className="form-label fw-semibold">
          Nombre Completo
        </label>
        <input
          id="state-campo-nombre"
          type="text"
          className={`form-control form-control-custom ${
            errors.nombre ? 'is-invalid' : ''
          }`}
          placeholder="Ej. Juan Perez"
          {...register('nombre', {
            required: 'El nombre es obligatorio.',
            minLength: {
              value: 2,
              message: 'El nombre debe contener al menos 2 caracteres.'
            }
          })}
        />
        {errors.nombre && (
          <span className="validation-feedback">{errors.nombre.message}</span>
        )}
      </div>

      {/* Campo: Correo electronico */}
      <div className="mb-3">
        <label htmlFor="state-campo-email" className="form-label fw-semibold">
          Correo Electronico
        </label>
        <input
          id="state-campo-email"
          type="email"
          disabled={esModoEdicion}
          className={`form-control form-control-custom ${
            errors.email ? 'is-invalid' : ''
          }`}
          placeholder="correo@ejemplo.com"
          {...register('email', {
            required: 'El correo electronico es obligatorio.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'El formato de correo electronico es invalido.'
            }
          })}
        />
        {errors.email && (
          <span className="validation-feedback">{errors.email.message}</span>
        )}
      </div>

      {/* Campo: Contrasenia (solamente en modo registro) */}
      {!esModoEdicion && (
        <div className="mb-3">
          <label htmlFor="state-campo-contrasenia" className="form-label fw-semibold">
            Contrasenia
          </label>
          <input
            id="state-campo-contrasenia"
            type="password"
            className={`form-control form-control-custom ${
              errors.contraseña ? 'is-invalid' : ''
            }`}
            placeholder="Minimo 6 caracteres (letras y numeros)"
            {...register('contraseña', {
              required: 'La contrasenia es obligatoria.',
              minLength: {
                value: 6,
                message: 'La contrasenia debe tener minimo 6 caracteres.'
              },
              validate: {
                tieneLetraYNumero: (valor) => {
                  const tieneLetra = /[a-zA-Z]/.test(valor);
                  const tieneNumero = /[0-9]/.test(valor);
                  return (
                    (tieneLetra && tieneNumero) ||
                    'La contrasenia debe incluir al menos una letra y un numero.'
                  );
                }
              }
            })}
          />
          {errors.contraseña && (
            <span className="validation-feedback">
              {errors.contraseña.message}
            </span>
          )}
        </div>
      )}

      {/* Seccion Perfil: Telefono y Fecha de Nacimiento */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="state-campo-telefono" className="form-label fw-semibold">
            Telefono (opcional)
          </label>
          <input
            id="state-campo-telefono"
            type="text"
            className="form-control form-control-custom"
            placeholder="+54 11 1234-5678"
            {...register('telefono')}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label
            htmlFor="state-campo-fecha-nacimiento"
            className="form-label fw-semibold"
          >
            Fecha de Nacimiento (opcional)
          </label>
          <input
            id="state-campo-fecha-nacimiento"
            type="date"
            className="form-control form-control-custom"
            {...register('fechaNacimiento')}
          />
        </div>
      </div>

      {/* Campo: Direccion */}
      <div className="mb-4">
        <label htmlFor="state-campo-direccion" className="form-label fw-semibold">
          Direccion (opcional)
        </label>
        <input
          id="state-campo-direccion"
          type="text"
          className="form-control form-control-custom"
          placeholder="Calle, numero, ciudad"
          {...register('direccion')}
        />
      </div>

      {/* Botones de accion */}
      <div className="d-flex justify-content-end gap-2">
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            className="btn btn-outline-secondary"
            disabled={cargando}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary-custom"
          disabled={cargando}
        >
          {cargando ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Procesando...
            </>
          ) : esModoEdicion ? (
            'Guardar Cambios'
          ) : (
            'Crear Cuenta'
          )}
        </button>
      </div>
    </form>
  );
}

export default FormularioUsuario;
