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
      console.warn('Sesión expirada o no autorizada. Redirigiendo al login...');
      // Aquí se podría forzar un logout en el estado global si fuera necesario
    }
    return Promise.reject(error);
  }
);

export default apiClient;
