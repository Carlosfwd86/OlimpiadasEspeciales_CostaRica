import type { Voluntario } from '../types';

const API_URL = "http://localhost:3001/voluntarios";

export const getVoluntarios = async (): Promise<Voluntario[]> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener los voluntarios");
        return await response.json() as Voluntario[];
    } catch (error) {
        console.error("Error en getVoluntarios:", error);
        throw error;
    }
};

export const getVoluntarioById = async (id: string): Promise<Voluntario> => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Error al obtener el voluntario");
        return await response.json() as Voluntario;
    } catch (error) {
        console.error("Error en getVoluntarioById:", error);
        throw error;
    }
};

export const createVoluntario = async (voluntario: Omit<Voluntario, 'id'>): Promise<Voluntario> => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(voluntario),
        });
        if (!response.ok) throw new Error("Error al crear el voluntario");
        return await response.json() as Voluntario;
    } catch (error) {
        console.error("Error en createVoluntario:", error);
        throw error;
    }
};

export const updateVoluntario = async (id: string, voluntario: Partial<Voluntario>): Promise<Voluntario> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(voluntario),
        });
        if (!response.ok) throw new Error("Error al actualizar el voluntario");
        return await response.json() as Voluntario;
    } catch (error) {
        console.error("Error en updateVoluntario:", error);
        throw error;
    }
};

export const deleteVoluntario = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Error al eliminar el voluntario");
    } catch (error) {
        console.error("Error en deleteVoluntario:", error);
        throw error;
    }
};
