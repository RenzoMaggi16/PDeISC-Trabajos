// Contexto global de autenticacion y persistencia de sesion
import React, { createContext, useState, useEffect, useCallback } from 'react';
import httpClient from '../api/httpClient';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('r3_token') || null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Rehidratacion de sesion al cargar la aplicacion
  const rehydrateSession = useCallback(async () => {
    const savedToken = localStorage.getItem('r3_token');
    if (!savedToken) {
      setCargando(false);
      setUsuario(null);
      setToken(null);
      return;
    }

    try {
      const response = await httpClient.get('/auth/perfil');
      setUsuario(response.data);
      setToken(savedToken);
      setError(null);
    } catch (err) {
      // Si el token es invalido o expiro, se limpia el almacenamiento
      console.warn('Sesion expirada o no valida. Limpiando almacenamiento.');
      localStorage.removeItem('r3_token');
      setUsuario(null);
      setToken(null);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    rehydrateSession();
  }, [rehydrateSession]);

  // Inicio de sesion contra la API
  const login = async (email, contraseña) => {
    setError(null);
    try {
      const response = await httpClient.post('/auth/login', {
        email,
        contraseña
      });

      const { token: nuevoToken, usuario: datosUsuario } = response.data;
      localStorage.setItem('r3_token', nuevoToken);
      setToken(nuevoToken);

      // Obtenemos los datos completos del perfil
      const perfilRes = await httpClient.get('/auth/perfil', {
        headers: { Authorization: `Bearer ${nuevoToken}` }
      });
      setUsuario(perfilRes.data);

      return { exito: true };
    } catch (err) {
      const mensajeError =
        err.response?.data?.mensaje ||
        'Error de conexion al intentar iniciar sesion.';
      setError(mensajeError);
      return { exito: false, mensaje: mensajeError };
    }
  };

  // Cierre de sesion
  const logout = () => {
    localStorage.removeItem('r3_token');
    setToken(null);
    setUsuario(null);
    setError(null);
  };

  // Actualiza los datos del usuario en la memoria del contexto
  const actualizarUsuarioEnEstado = (datosActualizados) => {
    setUsuario((prev) => ({ ...prev, ...datosActualizados }));
  };

  const valor = {
    usuario,
    token,
    cargando,
    error,
    login,
    logout,
    rehydrateSession,
    actualizarUsuarioEnEstado
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
