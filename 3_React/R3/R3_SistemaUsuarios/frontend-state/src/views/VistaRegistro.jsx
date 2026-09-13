// Vista de registro para la arquitectura basada en useState
import React, { useState } from 'react';
import FormularioUsuario from '../components/FormularioUsuario';
import httpClient from '../api/httpClient';
import useAuth from '../hooks/useAuth';

export function VistaRegistro({ cambiarVista }) {
  const { login } = useAuth();
  const [errorRegistro, setErrorRegistro] = useState(null);
  const [exitoMensaje, setExitoMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmitRegistro = async (datos) => {
    setErrorRegistro(null);
    setExitoMensaje(null);
    setCargando(true);

    try {
      const response = await httpClient.post('/auth/registrar', {
        nombre: datos.nombre,
        email: datos.email,
        contraseña: datos.contraseña,
        telefono: datos.telefono || null,
        direccion: datos.direccion || null,
        fechaNacimiento: datos.fechaNacimiento || null
      });

      setExitoMensaje(response.data.mensaje || 'Registro completado exitosamente.');

      // Iniciar sesion y cambiar la vista a panel
      const loginRes = await login(datos.email, datos.contraseña);
      if (loginRes.exito) {
        setTimeout(() => {
          cambiarVista('panel');
        }, 1200);
      } else {
        setTimeout(() => {
          cambiarVista('login');
        }, 1500);
      }
    } catch (err) {
      const mensaje =
        err.response?.data?.mensaje ||
        'Error al procesar el registro. Intente nuevamente.';
      setErrorRegistro(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9">
          <div className="custom-card p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="d-inline-flex p-3 rounded-circle bg-info bg-opacity-10 text-info mb-3">
                <i className="bi bi-person-check-fill fs-2"></i>
              </div>
              <h2 className="fw-bold">Crear Nueva Cuenta</h2>
              <p className="text-muted small">
                Registro asistido en arquitectura <code>useState</code>
              </p>
            </div>

            {errorRegistro && (
              <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{errorRegistro}</div>
              </div>
            )}

            {exitoMensaje && (
              <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
                <i className="bi bi-check-circle-fill me-2"></i>
                <div>{exitoMensaje} Redirigiendo al panel...</div>
              </div>
            )}

            <FormularioUsuario
              modo="registro"
              onSubmit={handleSubmitRegistro}
              cargando={cargando}
            />

            <div className="text-center mt-4 pt-3 border-top">
              <p className="small text-muted mb-0">
                ¿Ya posee una cuenta registrada?{' '}
                <button
                  onClick={() => cambiarVista('login')}
                  className="btn btn-link p-0 fw-semibold text-decoration-none text-primary"
                >
                  Inicie sesion aqui
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VistaRegistro;
