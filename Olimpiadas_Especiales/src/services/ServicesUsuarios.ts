import apiClient from '../api/apiClient';
import type { Usuario } from '../types';

/* [verde] Servicio para la gestión de usuarios conectado al Backend real */
export const ServicesUsuarios = {
    
    getUsuarios: async (): Promise<Usuario[]> => {
        const response = await apiClient.get<Usuario[]>('/usuarios');
        return response.data;
    },

    getUsuarioById: async (id: string | number): Promise<Usuario> => {
        const response = await apiClient.get<Usuario>(`/usuarios/${id}`);
        return response.data;
    },

    createUsuario: async (usuario: any): Promise<Usuario> => {
        // Mapeo de campos para coincidir con el validador del backend
        const nombres = (usuario.nombre || '').trim().split(' ');
        const nombre = nombres[0] || 'Usuario';
        const apellido = nombres.slice(1).join(' ') || '.';

        const payload = {
            nombre: nombre,
            apellido: apellido,
            cedula: usuario.cedula,
            correo_electronico: usuario.correoElectronico || usuario.correo_electronico,
            telefono: usuario.telefono,
            password: usuario.password,
            fecha_nacimiento: usuario.fechaNacimiento,
            genero: usuario.genero === 'NoDecir' ? 'Otro' : usuario.genero,
            rol_id: usuario.rol_id || 6, // 6 = Usuario General por defecto
        };

        const response = await apiClient.post<{ usuario: Usuario }>('/auth/register', payload);
        return response.data.usuario;
    },

    updateUsuario: async (id: string | number, usuario: Partial<Usuario>): Promise<Usuario> => {
        const response = await apiClient.patch<Usuario>(`/usuarios/${id}`, usuario);
        return response.data;
    },

    deleteUsuario: async (id: string | number): Promise<void> => {
        await apiClient.delete(`/usuarios/${id}`);
    }
};

// Exportaciones individuales para mantener compatibilidad
export const getUsuarios = ServicesUsuarios.getUsuarios;
export const getUsuarioById = ServicesUsuarios.getUsuarioById;
export const createUsuario = ServicesUsuarios.createUsuario;
export const updateUsuario = ServicesUsuarios.updateUsuario;

