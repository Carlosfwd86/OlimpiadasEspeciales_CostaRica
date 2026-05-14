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
        // Mapeo inteligente de campos para coincidir con el backend
        const fullNombre = (usuario.nombre || '').trim();
        const nombres = fullNombre.split(' ');
        const nombre = nombres[0] || 'Usuario';
        const apellido = nombres.slice(1).join(' ') || 'General'; // Evitamos el "."

        const payload: any = {
            nombre: nombre,
            apellido: apellido,
            cedula: usuario.cedula || null,
            correo_electronico: (usuario.correoElectronico || usuario.correo_electronico || '').toLowerCase(),
            password: usuario.password,
            rol_id: usuario.rol_id || 6, // 6 = Usuario General
        };

        // Solo enviamos campos opcionales si tienen contenido para evitar fallos de validación (isNumeric, etc)
        if (usuario.telefono && usuario.telefono.trim() !== '') {
            payload.telefono = usuario.telefono;
        }
        if (usuario.pais && usuario.pais.trim() !== '') {
            payload.pais = usuario.pais;
        }
        if (usuario.fechaNacimiento) {
            payload.fecha_nacimiento = usuario.fechaNacimiento;
        }
        if (usuario.genero && usuario.genero !== '') {
            payload.genero = usuario.genero === 'NoDecir' ? 'Otro' : usuario.genero;
        }

        const response = await apiClient.post<{ usuario: Usuario }>('/auth/register', payload);
        return response.data.usuario;
    },


    updateUsuario: async (id: string | number, usuario: any): Promise<Usuario> => {
        const payload: any = { ...usuario };
        
        if (usuario.correoElectronico) payload.correo_electronico = usuario.correoElectronico;
        if (usuario.fechaNacimiento) payload.fecha_nacimiento = usuario.fechaNacimiento;
        if (usuario.avatarUrl) payload.avatar_url = usuario.avatarUrl;
        
        const response = await apiClient.patch<Usuario>(`/usuarios/${id}`, payload);
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

