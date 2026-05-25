import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

interface User {
  id: number;
  nombre: string;
  apellido?: string;
  rol_id: number;
  avatar_url?: string;
  cedula?: string;
  correo_electronico?: string;
  correoElectronico?: string;
  telefono?: string;
  direccion?: string;
  pais?: string;
  fecha_nacimiento?: string;
  fechaNacimiento?: string;
  genero?: string;
}

const normalizarUsuarioSesion = (usuario: Record<string, unknown>): User => ({
  ...(usuario as User),
  correoElectronico: (usuario.correo_electronico ?? usuario.correoElectronico) as string | undefined,
  fechaNacimiento: (usuario.fecha_nacimiento ?? usuario.fechaNacimiento) as string | undefined
});

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<any>;
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
        console.log('[AuthContext] Verificando sesión...');
        const res = await apiClient.get('/auth/me');
        const raw = res.data.usuario as Record<string, unknown> | null;
        console.log('[AuthContext] Resultado /me:', raw);
        if (raw) {
          const sesion = normalizarUsuarioSesion(raw);
          setUser(sesion);
          localStorage.setItem('usuarioSesion', JSON.stringify(sesion));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('[AuthContext] Error en checkAuth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials: any) => {
    const res = await apiClient.post('/auth/login', credentials);
    const usuario = res.data.data?.usuario || res.data.usuario;
    // El token JWT viaja como httpOnly cookie — no se almacena en localStorage
    // por seguridad (XSS protection). El backend ya setea la cookie en login.
    if (usuario) {
      const sesion = normalizarUsuarioSesion(usuario as Record<string, unknown>);
      localStorage.setItem('usuarioSesion', JSON.stringify(sesion));
      setUser(sesion);
      return sesion;
    }
    setUser(usuario);
    return usuario;
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
