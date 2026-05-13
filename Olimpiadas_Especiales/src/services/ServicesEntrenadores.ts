import apiClient from '../api/apiClient';
import type { Entrenador } from '../types';

// Obtener todos los entrenadores (Read)
export const getEntrenadores = async (): Promise<Entrenador[]> => {
    try {
        const response = await apiClient.get<Entrenador[]>('/entrenadores');
        return response.data;
    } catch (error) {
        console.error('Error en getEntrenadores:', error);
        throw error;
    }
};

// Obtener un entrenador por su ID (Read)
export const getEntrenadorById = async (id: string): Promise<Entrenador> => {
    try {
        const response = await apiClient.get<Entrenador>(`/entrenadores/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error en getEntrenadorById:', error);
        throw error;
    }
};

// Crear un nuevo entrenador (Create)
export const createEntrenador = async (entrenador: Omit<Entrenador, 'id'>): Promise<Entrenador> => {
    try {
        const response = await apiClient.post<Entrenador>('/entrenadores', entrenador);
        return response.data;
    } catch (error) {
        console.error('Error en createEntrenador:', error);
        throw error;
    }
};

// Actualizar un entrenador existente (Update)
export const updateEntrenador = async (id: string, entrenador: Partial<Entrenador>): Promise<Entrenador> => {
    try {
        const response = await apiClient.patch<Entrenador>(`/entrenadores/${id}`, entrenador);
        return response.data;
    } catch (error) {
        console.error('Error en updateEntrenador:', error);
        throw error;
    }
};

// Eliminar un entrenador (Delete)
export const deleteEntrenador = async (id: string): Promise<void> => {
    try {
        await apiClient.delete(`/entrenadores/${id}`);
    } catch (error) {
        console.error('Error en deleteEntrenador:', error);
        throw error;
    }
};
