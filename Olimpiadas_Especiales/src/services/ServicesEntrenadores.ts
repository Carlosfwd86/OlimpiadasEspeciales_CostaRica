import apiClient from '../api/apiClient';
import type { Entrenador } from '../types';

/* [verde] Servicio para la gestión de entrenadores conectado al Backend real */
export const ServicesEntrenadores = {
    
    getEntrenadores: async (): Promise<Entrenador[]> => {
        const response = await apiClient.get<{ data: Entrenador[] }>('/entrenadores');
        return response.data.data;
    },

    getEntrenadorById: async (id: string | number): Promise<Entrenador> => {
        const response = await apiClient.get<{ data: Entrenador }>(`/entrenadores/${id}`);
        return response.data.data;
    },

    createEntrenador: async (entrenador: Omit<Entrenador, 'id'>): Promise<Entrenador> => {
        const response = await apiClient.post<{ data: Entrenador }>('/entrenadores', entrenador);
        return response.data.data;
    },

    updateEntrenador: async (id: string | number, entrenador: Partial<Entrenador>): Promise<Entrenador> => {
        const response = await apiClient.patch<{ data: Entrenador }>(`/entrenadores/${id}`, entrenador);
        return response.data.data;
    },

    deleteEntrenador: async (id: string | number): Promise<void> => {
        await apiClient.delete(`/entrenadores/${id}`);
    }
};

// Exportaciones individuales para mantener compatibilidad
export const getEntrenadores = ServicesEntrenadores.getEntrenadores;
export const getEntrenadorById = ServicesEntrenadores.getEntrenadorById;
export const createEntrenador = ServicesEntrenadores.createEntrenador;
export const updateEntrenador = ServicesEntrenadores.updateEntrenador;
export const deleteEntrenador = ServicesEntrenadores.deleteEntrenador;

