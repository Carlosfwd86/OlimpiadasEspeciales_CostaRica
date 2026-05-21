import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: number[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Validar permisos basados en el rol si se provee allowedRoles
  if (allowedRoles && user && !allowedRoles.includes(user.rol_id)) {
    console.warn(`[PrivateRoute] Acceso denegado para el rol ${user.rol_id}`);
    return <Navigate to="/" replace />; // Redirigir al home en vez de login si ya tiene sesión activa pero no tiene permisos
  }

  return <>{children}</>;
};

export default PrivateRoute;
