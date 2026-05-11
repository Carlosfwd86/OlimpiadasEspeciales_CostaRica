import type { Entrenador } from '../types';

const API_URL = "http://localhost:3001/entrenadores";

// Obtener todos los entrenadores (Read)
export const getEntrenadores = async (): Promise<Entrenador[]> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener los entrenadores");
        return await response.json() as Entrenador[];
    } catch (error) {
        console.error("Error en getEntrenadores:", error);
        throw error;
    }
};

// Obtener un entrenador por su ID (Read)
export const getEntrenadorById = async (id: string): Promise<Entrenador> => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Error al obtener el entrenador");
        return await response.json() as Entrenador;
    } catch (error) {
        console.error("Error en getEntrenadorById:", error);
        throw error;
    }
};

// Crear un nuevo entrenador (Create)
export const createEntrenador = async (entrenador: Omit<Entrenador, 'id'>): Promise<Entrenador> => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(entrenador),
        });
        if (!response.ok) throw new Error("Error al crear el entrenador");
        return await response.json() as Entrenador;
    } catch (error) {
        console.error("Error en createEntrenador:", error);
        throw error;
    }
};

// Actualizar un entrenador existente (Update)
export const updateEntrenador = async (id: string, entrenador: Partial<Entrenador>): Promise<Entrenador> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(entrenador),
        });
        if (!response.ok) throw new Error("Error al actualizar el entrenador");
        return await response.json() as Entrenador;
    } catch (error) {
        console.error("Error en updateEntrenador:", error);
        throw error;
    }
};

// Eliminar un entrenador (Delete)
export const deleteEntrenador = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Error al eliminar el entrenador");
    } catch (error) {
        console.error("Error en deleteEntrenador:", error);
        throw error;
    }
};
