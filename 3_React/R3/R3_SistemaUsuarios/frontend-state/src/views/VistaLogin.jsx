// Vista de inicio de sesion para la arquitectura basada en useState
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';

export function VistaLogin({ cambiarVista }) {
  const { login } = useAuth();
  const [errorLogin, setErrorLogin] = useState(null);
  const [cargando, setCargando] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setErrorLogin(null);
    setCargando(true);
    const resultado = await login(data.email, data.contraseña);
    setCargando(false);

    if (resultado.exito) {
      cambiarVista('panel');
    } else {
      setErrorLogin(resultado.mensaje);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="custom-card p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="d-inline-flex p-3 rounded-circle bg-info bg-opacity-10 text-info mb-3">
                <i className="bi bi-shield-lock-fill fs-2"></i>
              </div>
              <h2 className="fw-bold">Iniciar Sesion</h2>
              <p className="text-muted small">
                Arquitectura de navegacion controlada por <code>useState</code>
              </p>
            </div>

            {errorLogin && (
              <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{errorLogin}</div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="mb-3">
                <label htmlFor="state-login-email" className="form-label fw-semibold">
                  Correo Electronico
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    id="state-login-email"
                    type="email"
                    className={`form-control form-control-custom ${
                      errors.email ? 'is-invalid' : ''
                    }`}
                    placeholder="ejemplo@correo.com"
                    {...register('email', {
                      required: 'El correo electronico es obligatorio.',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'El formato de correo es invalido.'
                      }
                    })}
                  />
                </div>
                {errors.email && (
                  <span className="validation-feedback">{errors.email.message}</span>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="state-login-contrasenia" className="form-label fw-semibold">
                  Contrasenia
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-key"></i>
                  </span>
                  <input
                    id="state-login-contrasenia"
                    type="password"
                    className={`form-control form-control-custom ${
                      errors.contraseña ? 'is-invalid' : ''
                    }`}
                    placeholder="••••••••"
                    {...register('contraseña', {
                      required: 'La contrasenia es obligatoria.'
                    })}
                  />
                </div>
                {errors.contraseña && (
                  <span className="validation-feedback">
                    {errors.contraseña.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary-custom w-100 py-2 mb-3"
                disabled={cargando}
              >
                {cargando ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Ingresando...
                  </>
                ) : (
                  'Ingresar al Sistema'
                )}
              </button>
            </form>

            <div className="text-center mt-3 pt-3 border-top">
              <p className="small text-muted mb-0">
                ¿No tiene una cuenta?{' '}
                <button
                  onClick={() => cambiarVista('registro')}
                  className="btn btn-link p-0 fw-semibold text-decoration-none text-primary"
                >
                  Registrese aqui
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VistaLogin;
