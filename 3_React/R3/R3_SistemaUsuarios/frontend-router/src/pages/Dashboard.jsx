// Panel principal (Dashboard) para React Router con visualizacion de perfil y CRUD de usuarios
import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import httpClient from '../api/httpClient';
import FormularioUsuario from '../components/FormularioUsuario';

export function Dashboard() {
  const { usuario, actualizarUsuarioEnEstado } = useAuth();
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [mensajeAlerta, setMensajeAlerta] = useState(null);
  const [tipoAlerta, setTipoAlerta] = useState('info');

  // Estado para el modal de edicion
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);

  // Obtiene la lista completa de usuarios desde el backend
  const fetchUsuarios = useCallback(async () => {
    setCargandoLista(true);
    try {
      const res = await httpClient.get('/usuarios');
      setListaUsuarios(res.data);
    } catch (err) {
      setMensajeAlerta(
        err.response?.data?.mensaje || 'Error al cargar la lista de usuarios.'
      );
      setTipoAlerta('danger');
    } finally {
      setCargandoLista(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  // Manejador para abrir el modal de edicion
  const handleAbrirEdicion = (usr) => {
    setUsuarioAEditar({
      id: usr.id,
      nombre: usr.nombre,
      email: usr.email,
      telefono: usr.telefono || '',
      direccion: usr.direccion || '',
      fechaNacimiento: usr.fechaNacimiento
        ? usr.fechaNacimiento.split('T')[0]
        : ''
    });
    setMostrarModal(true);
  };

  // Manejador para enviar cambios de edicion
  const handleGuardarEdicion = async (datos) => {
    if (!usuarioAEditar) return;
    setGuardandoEdicion(true);
    setMensajeAlerta(null);

    try {
      const res = await httpClient.put(`/usuarios/${usuarioAEditar.id}`, {
        nombre: datos.nombre,
        telefono: datos.telefono || null,
        direccion: datos.direccion || null,
        fechaNacimiento: datos.fechaNacimiento || null
      });

      setMensajeAlerta(res.data.mensaje || 'Usuario actualizado correctamente.');
      setTipoAlerta('success');
      setMostrarModal(false);

      // Si el usuario editado es el mismo que esta en sesion, actualizamos el contexto
      if (usuario && usuario.id === usuarioAEditar.id) {
        actualizarUsuarioEnEstado(res.data.usuario);
      }

      // Recargar lista actualizada
      fetchUsuarios();
    } catch (err) {
      setMensajeAlerta(
        err.response?.data?.mensaje || 'Error al actualizar el usuario.'
      );
      setTipoAlerta('danger');
    } finally {
      setGuardandoEdicion(false);
    }
  };

  // Manejador para eliminar un usuario
  const handleEliminarUsuario = async (id, nombre) => {
    const confirmacion = window.confirm(
      `¿Esta seguro de que desea eliminar al usuario "${nombre}"? Esta accion no se puede deshacer.`
    );
    if (!confirmacion) return;

    try {
      const res = await httpClient.delete(`/usuarios/${id}`);
      setMensajeAlerta(res.data.mensaje || 'Usuario eliminado exitosamente.');
      setTipoAlerta('success');

      // Si se elimino a si mismo, refrescar pagina para forzar rehidratacion/salida
      if (usuario && usuario.id === id) {
        window.location.reload();
      } else {
        fetchUsuarios();
      }
    } catch (err) {
      setMensajeAlerta(
        err.response?.data?.mensaje || 'Error al intentar eliminar el usuario.'
      );
      setTipoAlerta('danger');
    }
  };

  const esAdmin = usuario?.rol === 'administrador';

  return (
    <div className="container py-4">
      {/* Alerta de notificacion */}
      {mensajeAlerta && (
        <div
          className={`alert alert-${tipoAlerta} alert-dismissible fade show d-flex align-items-center mb-4`}
          role="alert"
        >
          <i
            className={`bi ${
              tipoAlerta === 'success'
                ? 'bi-check-circle-fill'
                : 'bi-exclamation-circle-fill'
            } me-2`}
          ></i>
          <div>{mensajeAlerta}</div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setMensajeAlerta(null)}
            aria-label="Cerrar"
          ></button>
        </div>
      )}

      {/* Fila superior: Perfil actual y resumen */}
      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className="custom-card h-100">
            <div className="card-header-custom d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold text-dark">
                <i className="bi bi-person-badge me-2 text-primary"></i>Mi Perfil
              </h5>
              <button
                onClick={() => handleAbrirEdicion(usuario)}
                className="btn btn-sm btn-outline-primary"
              >
                <i className="bi bi-pencil-square me-1"></i>Editar
              </button>
            </div>
            <div className="p-4">
              <div className="text-center mb-3">
                <div className="d-inline-flex p-3 rounded-circle bg-primary bg-opacity-10 text-primary mb-2">
                  <i className="bi bi-person-fill fs-1"></i>
                </div>
                <h5 className="fw-bold mb-1">{usuario?.nombre}</h5>
                <p className="text-muted small mb-2">{usuario?.email}</p>
                <span
                  className={
                    usuario?.rol === 'administrador'
                      ? 'badge-role-admin'
                      : 'badge-role-user'
                  }
                >
                  {usuario?.rol}
                </span>
              </div>

              <hr />

              <div className="small">
                <div className="d-flex justify-content-between py-1">
                  <span className="text-muted">Telefono:</span>
                  <span className="fw-medium">{usuario?.telefono || 'No registrado'}</span>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="text-muted">Direccion:</span>
                  <span className="fw-medium">{usuario?.direccion || 'No registrada'}</span>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="text-muted">Nacimiento:</span>
                  <span className="fw-medium">
                    {usuario?.fechaNacimiento
                      ? usuario.fechaNacimiento.split('T')[0]
                      : 'No especificada'}
                  </span>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="text-muted">Registrado:</span>
                  <span className="fw-medium">
                    {usuario?.fechaRegistro
                      ? new Date(usuario.fechaRegistro).toLocaleDateString('es-ES')
                      : 'Reciente'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informacion de la arquitectura compartida */}
        <div className="col-lg-8">
          <div className="custom-card h-100 p-4 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center mb-3">
                <span className="badge bg-primary me-2">Arquitectura R3</span>
                <span className="badge bg-dark">React Router v6</span>
              </div>
              <h4 className="fw-bold">Panel de Administracion y Gestion</h4>
              <p className="text-secondary">
                Esta interfaz utiliza <strong>React Router</strong> para la navegacion mediante rutas declarativas
                protegidas con el guard <code>RutaProtegida</code>. Consume la API unificada de Express y persiste
                los datos en MySQL bajo formas normales (1NF, 2NF, 3NF).
              </p>
              <div className="row g-2 mt-2">
                <div className="col-sm-6">
                  <div className="p-3 bg-light rounded border">
                    <div className="text-muted small">Total de Usuarios</div>
                    <div className="fs-4 fw-bold text-primary">{listaUsuarios.length}</div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-3 bg-light rounded border">
                    <div className="text-muted small">Nivel de Acceso</div>
                    <div className="fs-4 fw-bold text-secondary text-capitalize">
                      {usuario?.rol || 'Usuario'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 small text-muted">
              <i className="bi bi-info-circle me-1"></i>
              {esAdmin
                ? 'Como administrador, tiene permisos completos para editar y eliminar cualquier usuario.'
                : 'Como usuario estandar, puede editar su propio perfil y consultar la lista general.'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios registrados */}
      <div className="custom-card">
        <div className="card-header-custom d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0 fw-bold text-dark">
              <i className="bi bi-table me-2 text-primary"></i>Usuarios Registrados
            </h5>
            <span className="text-muted small">Base de datos compartida: usuarios_db</span>
          </div>
          <button
            onClick={fetchUsuarios}
            className="btn btn-outline-secondary btn-sm"
            disabled={cargandoLista}
          >
            <i className={`bi bi-arrow-clockwise me-1 ${cargandoLista ? 'spin' : ''}`}></i>
            Actualizar
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-custom table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Contacto</th>
                <th>Direccion</th>
                <th>Fecha Registro</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargandoLista ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                    Cargando listado de usuarios...
                  </td>
                </tr>
              ) : listaUsuarios.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No se encontraron usuarios registrados.
                  </td>
                </tr>
              ) : (
                listaUsuarios.map((usr) => {
                  const puedeEditar = esAdmin || usuario?.id === usr.id;
                  const puedeEliminar = esAdmin || usuario?.id === usr.id;

                  return (
                    <tr key={usr.id}>
                      <td className="fw-bold text-muted">#{usr.id}</td>
                      <td>
                        <div className="fw-semibold text-dark">{usr.nombre}</div>
                        <div className="text-muted small">{usr.email}</div>
                      </td>
                      <td>
                        <span
                          className={
                            usr.rol === 'administrador'
                              ? 'badge-role-admin'
                              : 'badge-role-user'
                          }
                        >
                          {usr.rol}
                        </span>
                      </td>
                      <td>
                        <div className="small">{usr.telefono || 'Sin telefono'}</div>
                      </td>
                      <td>
                        <div className="small text-truncate-cell text-truncate">
                          {usr.direccion || 'Sin direccion'}
                        </div>
                      </td>
                      <td>
                        <div className="small text-muted">
                          {usr.fechaRegistro
                            ? new Date(usr.fechaRegistro).toLocaleDateString('es-ES')
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          {puedeEditar && (
                            <button
                              onClick={() => handleAbrirEdicion(usr)}
                              className="btn btn-outline-primary"
                              title="Editar usuario"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                          )}
                          {puedeEliminar && (
                            <button
                              onClick={() => handleEliminarUsuario(usr.id, usr.nombre)}
                              className="btn btn-outline-danger"
                              title="Eliminar usuario"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de edicion de usuario */}
      {mostrarModal && (
        <div
          className="modal fade show d-block modal-backdrop-custom"
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content custom-card border-0">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-pencil-square me-2 text-primary"></i>
                  Editar Usuario: {usuarioAEditar?.nombre}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMostrarModal(false)}
                  aria-label="Cerrar"
                ></button>
              </div>
              <div className="modal-body p-4">
                <FormularioUsuario
                  modo="edicion"
                  valoresIniciales={usuarioAEditar}
                  onSubmit={handleGuardarEdicion}
                  onCancelar={() => setMostrarModal(false)}
                  cargando={guardandoEdicion}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
