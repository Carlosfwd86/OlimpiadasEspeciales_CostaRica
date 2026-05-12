import type { Atleta } from '../types';

const API_URL = "http://localhost:3001/atletas";

// Obtener todos los atletas (Read)
export const getAtletas = async (): Promise<Atleta[]> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener los atletas");
        return await response.json() as Atleta[];
    } catch (error) {
        console.error("Error en getAtletas:", error);
        throw error;
    }
};

// Obtener un atleta por su ID (Read)
export const getAtletaById = async (id: string): Promise<Atleta> => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Error al obtener el atleta");
        return await response.json() as Atleta;
    } catch (error) {
        console.error("Error en getAtletaById:", error);
        throw error;
    }
};

// Crear un nuevo atleta (Create)
export const createAtleta = async (atleta: Omit<Atleta, 'id'>): Promise<Atleta> => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(atleta),
        });
        if (!response.ok) throw new Error("Error al crear el atleta");
        return await response.json() as Atleta;
    } catch (error) {
        console.error("Error en createAtleta:", error);
        throw error;
    }
};

// Actualizar un atleta existente (Update)
export const updateAtleta = async (id: string, atleta: Partial<Atleta>): Promise<Atleta> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(atleta),
        });
        if (!response.ok) throw new Error("Error al actualizar el atleta");
        return await response.json() as Atleta;
    } catch (error) {
        console.error("Error en updateAtleta:", error);
        throw error;
    }
};

// Eliminar un atleta (Delete)
export const deleteAtleta = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Error al eliminar el atleta");
    } catch (error) {
        console.error("Error en deleteAtleta:", error);
        throw error;
    }
};
