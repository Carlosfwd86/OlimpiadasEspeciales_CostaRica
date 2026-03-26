import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Componente para proteger rutas privadas.
 * Verifica si existe una sesión activa en localStorage.
 */
const PrivateRoute = ({ children }) => {
  const usuarioSesion = localStorage.getItem('usuarioSesion');

  // Si no hay sesión, redirigir al login
  if (!usuarioSesion) {
    return <Navigate to="/login" replace />;
  }

  // Si hay sesión, permitir el acceso al componente hijo
  return children;
};

export default PrivateRoute;
