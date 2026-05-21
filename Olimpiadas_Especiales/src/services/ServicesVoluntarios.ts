import apiClient from '../api/apiClient';
import type { Voluntario } from '../types';

export const getVoluntarios = async (): Promise<Voluntario[]> => {
    try {
        const response = await apiClient.get<{ data: Voluntario[] }>('/voluntarios');
        return response.data.data;
    } catch (error) {
        console.error("Error en getVoluntarios:", error);
        throw error;
    }
};

export const getVoluntarioById = async (id: string): Promise<Voluntario> => {
    try {
        const response = await apiClient.get<{ data: Voluntario }>(`/voluntarios/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Error en getVoluntarioById:", error);
        throw error;
    }
};

export const createVoluntario = async (voluntario: Omit<Voluntario, 'id'>): Promise<Voluntario> => {
    try {
        const response = await apiClient.post<{ data: Voluntario }>('/voluntarios', voluntario);
        return response.data.data;
    } catch (error) {
        console.error("Error en createVoluntario:", error);
        throw error;
    }
};

export const updateVoluntario = async (id: string, voluntario: Partial<Voluntario>): Promise<Voluntario> => {
    try {
        const response = await apiClient.put<{ data: Voluntario }>(`/voluntarios/${id}`, voluntario);
        return response.data.data;
    } catch (error) {
        console.error("Error en updateVoluntario:", error);
        throw error;
    }
};

export const deleteVoluntario = async (id: string): Promise<void> => {
    try {
        await apiClient.delete(`/voluntarios/${id}`);
    } catch (error) {
        console.error("Error en deleteVoluntario:", error);
        throw error;
    }
};

// TAREA 1: Nuevos endpoints de aprobación y rechazo
export const aprobarVoluntario = async (id: string): Promise<void> => {
    try {
        await apiClient.put(`/voluntarios/${id}/aprobar`);
    } catch (error) {
        console.error("Error en aprobarVoluntario:", error);
        throw error;
    }
};

export const rechazarVoluntario = async (id: string): Promise<void> => {
    try {
        await apiClient.put(`/voluntarios/${id}/rechazar`);
    } catch (error) {
        console.error("Error en rechazarVoluntario:", error);
        throw error;
    }
};
