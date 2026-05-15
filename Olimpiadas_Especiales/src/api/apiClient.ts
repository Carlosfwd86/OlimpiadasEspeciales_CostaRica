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
    if (error.response && error.response.status === 401) {
      const excludeUrls = ['/auth/me', '/auth/login'];
      const isExcluded = excludeUrls.some(url => error.config.url?.includes(url));

      if (!isExcluded) {
        console.warn('Sesión expirada o no autorizada. Redirigiendo al login...');
        // Solo limpiamos datos de UI — el token httpOnly lo borra el backend en /auth/logout
        localStorage.removeItem('usuarioSesion');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
