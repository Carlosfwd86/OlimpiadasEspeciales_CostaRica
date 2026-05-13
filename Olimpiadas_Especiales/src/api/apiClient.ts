import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir el token JWT en cada petición si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores globales (ej: 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const excludeUrls = ['/auth/me', '/auth/login'];
      const isExcluded = excludeUrls.some(url => error.config.url?.includes(url));
      
      if (!isExcluded) {
        console.warn('Sesión expirada o no autorizada. Redirigiendo al login...');
        // Opcional: localStorage.removeItem('token'); window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
