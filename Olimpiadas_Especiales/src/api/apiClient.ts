import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de solicitud para depuración en desarrollo
if (import.meta.env.DEV) {
  apiClient.interceptors.request.use((config) => {
    console.log(`[apiClient] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// AUTENTICACIÓN POR COOKIE HTTPONLY (apta para producción)
// El token JWT NO se almacena en localStorage (protección contra XSS).
// El backend setea la cookie en login y la limpia en logout.
// withCredentials: true se encarga de enviarla automáticamente.
// ──────────────────────────────────────────────────────────────────────────────

// Interceptor para manejar errores globales (ej: 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;

    if (status === 401) {
      const excludeUrls = ['/auth/me', '/auth/login'];
      const isExcluded = excludeUrls.some(url => error.config.url?.includes(url));

      if (!isExcluded) {
        console.warn('Sesión expirada o no autorizada. Redirigiendo al login...');
        localStorage.removeItem('usuarioSesion');
        window.location.href = '/login';
      }
    } else if (status === 403) {
      console.error('Acceso prohibido: No tienes permisos suficientes para esta acción.');
    } else if (status === 500) {
      console.error('Error interno del servidor. Por favor, contacta al soporte.');
    }

    // Retornamos un error más descriptivo
    return Promise.reject({
      ...error,
      message: errorMsg,
      status: status
    });
  }
);

export default apiClient;
