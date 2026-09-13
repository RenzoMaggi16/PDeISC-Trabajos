// Cliente HTTP centralizado con Axios e interceptor para JWT
import axios from 'axios';

export const API_BASE_URL = 'http://localhost:4000/api';

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de solicitudes: adjunta el token JWT guardado en localStorage
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('r3_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas para deteccion centralizada de errores
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el servidor retorna 401 y habia un token expirado, puede limpiarse opcionalmente
    if (error.response && error.response.status === 401) {
      const currentToken = localStorage.getItem('r3_token');
      if (currentToken && error.config.url !== '/auth/login') {
        localStorage.removeItem('r3_token');
      }
    }
    return Promise.reject(error);
  }
);

export default httpClient;
