import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // Crucial para enviar/recibir cookies de JWT
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globales (ej: 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Evitar mensaje de alerta si es la verificación inicial o un intento de login fallido
      const excludeUrls = ['/auth/me', '/auth/login'];
      if (error.config && !excludeUrls.some(url => error.config.url.includes(url))) {
        console.warn('Sesión expirada o no autorizada. Redirigiendo al login...');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
