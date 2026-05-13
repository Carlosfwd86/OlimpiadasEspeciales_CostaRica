import apiClient from '../api/apiClient';
import type { Usuario } from '../types';

export const getUsuarios = async (): Promise<Usuario[]> => {
    try {
        const response = await apiClient.get<Usuario[]>('/usuarios');
        return response.data;
    } catch (error) {
        console.error('Error en getUsuarios:', error);
        throw error;
    }
};

export const getUsuarioById = async (id: string): Promise<Usuario> => {
    try {
        const response = await apiClient.get<Usuario>(`/usuarios/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error en getUsuarioById:', error);
        throw error;
    }
};

export const createUsuario = async (usuario: any): Promise<Usuario> => {
    try {
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
            rol_id: 2,
        };

        const response = await apiClient.post<Usuario>('/auth/register', payload);
        return response.data;
    } catch (error: any) {
        console.error('Error en createUsuario:', error);
        const errorMsg = error.response?.data?.error || error.message || 'Error al registrar el usuario';
        throw new Error(errorMsg);
    }
};

export const updateUsuario = async (id: string, usuario: Partial<Usuario>): Promise<Usuario> => {
    try {
        const response = await apiClient.patch<Usuario>(`/usuarios/${id}`, usuario);
        return response.data;
    } catch (error) {
        console.error('Error en updateUsuario:', error);
        throw error;
    }
};
