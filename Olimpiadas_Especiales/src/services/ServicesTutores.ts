import apiClient from '../api/apiClient';
import type { Tutor } from '../types';

// Obtener todos los tutores (Read)
export const getTutores = async (): Promise<Tutor[]> => {
    try {
        const response = await apiClient.get<{ data: Tutor[] }>('/tutores');
        return response.data.data;
    } catch (error) {
        console.error("Error en getTutores:", error);
        throw error;
    }
};

// Obtener un tutor por su ID (Read)
export const getTutorById = async (id: string): Promise<Tutor> => {
    try {
        const response = await apiClient.get<{ data: Tutor }>(`/tutores/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Error en getTutorById:", error);
        throw error;
    }
};

// Crear un nuevo tutor (Create)
export const createTutor = async (tutor: Omit<Tutor, 'id'>): Promise<Tutor> => {
    try {
        const response = await apiClient.post<{ data: Tutor }>('/tutores', tutor);
        return response.data.data;
    } catch (error) {
        console.error("Error en createTutor:", error);
        throw error;
    }
};

// Actualizar un tutor existente (Update)
export const updateTutor = async (id: string, tutor: Partial<Tutor>): Promise<Tutor> => {
    try {
        const response = await apiClient.put<{ data: Tutor }>(`/tutores/${id}`, tutor);
        return response.data.data;
    } catch (error) {
        console.error("Error en updateTutor:", error);
        throw error;
    }
};

// Eliminar un tutor (Delete)
export const deleteTutor = async (id: string): Promise<void> => {
    try {
        await apiClient.delete(`/tutores/${id}`);
    } catch (error) {
        console.error("Error en deleteTutor:", error);
        throw error;
    }
};
