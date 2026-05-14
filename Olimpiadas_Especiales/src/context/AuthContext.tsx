import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

interface User {
  id: number;
  nombre: string;
  rol_id: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar la app
    const checkAuth = async () => {
      try {
        const res = await apiClient.get('/auth/me'); // Necesitaremos este endpoint en el backend
        setUser(res.data.usuario);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials: any) => {
    const res = await apiClient.post('/auth/login', credentials);
    const { usuario } = res.data;
    // El token JWT viaja como httpOnly cookie — no se almacena en localStorage
    // por seguridad (XSS protection). El backend ya setea la cookie en login.
    if (usuario) localStorage.setItem('usuarioSesion', JSON.stringify(usuario));
    setUser(usuario);
  };

  const logout = async () => {
    try { await apiClient.post('/auth/logout'); } catch { /* cookie se limpia igual */ }
    // El backend limpia la cookie httpOnly; aquí limpiamos solo los datos de UI
    localStorage.removeItem('usuarioSesion');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};
