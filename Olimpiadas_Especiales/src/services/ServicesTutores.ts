import type { Tutor } from '../types';

const API_URL = "http://localhost:3001/tutores";

// Obtener todos los tutores (Read)
export const getTutores = async (): Promise<Tutor[]> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener los tutores");
        return await response.json() as Tutor[];
    } catch (error) {
        console.error("Error en getTutores:", error);
        throw error;
    }
};

// Obtener un tutor por su ID (Read)
export const getTutorById = async (id: string): Promise<Tutor> => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Error al obtener el tutor");
        return await response.json() as Tutor;
    } catch (error) {
        console.error("Error en getTutorById:", error);
        throw error;
    }
};

// Crear un nuevo tutor (Create)
export const createTutor = async (tutor: Omit<Tutor, 'id'>): Promise<Tutor> => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tutor),
        });
        if (!response.ok) throw new Error("Error al crear el tutor");
        return await response.json() as Tutor;
    } catch (error) {
        console.error("Error en createTutor:", error);
        throw error;
    }
};

// Actualizar un tutor existente (Update)
export const updateTutor = async (id: string, tutor: Partial<Tutor>): Promise<Tutor> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tutor),
        });
        if (!response.ok) throw new Error("Error al actualizar el tutor");
        return await response.json() as Tutor;
    } catch (error) {
        console.error("Error en updateTutor:", error);
        throw error;
    }
};

// Eliminar un tutor (Delete)
export const deleteTutor = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Error al eliminar el tutor");
    } catch (error) {
        console.error("Error en deleteTutor:", error);
        throw error;
    }
};
