import type { Entrenador } from '../types';

const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
const ENDPOINT = `${BACKEND_URL}/entrenadores`;

// Helper: headers con JWT
const authHeaders = (): HeadersInit => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`
});

// Extraer data de la respuesta envuelta { data: [...] } o array directo
const unwrap = <T>(json: unknown): T => {
    if (json && typeof json === 'object' && 'data' in (json as object))
        return (json as { data: T }).data;
    return json as T;
};

// Obtener todos los entrenadores (Read)
export const getEntrenadores = async (): Promise<Entrenador[]> => {
    try {
        const response = await fetch(ENDPOINT, { headers: authHeaders() });
        if (!response.ok) throw new Error('Error al obtener los entrenadores');
        return unwrap<Entrenador[]>(await response.json());
    } catch (error) {
        console.error('Error en getEntrenadores:', error);
        throw error;
    }
};

// Obtener un entrenador por su ID (Read)
export const getEntrenadorById = async (id: string): Promise<Entrenador> => {
    try {
        const response = await fetch(`${ENDPOINT}/${id}`, { headers: authHeaders() });
        if (!response.ok) throw new Error('Error al obtener el entrenador');
        return unwrap<Entrenador>(await response.json());
    } catch (error) {
        console.error('Error en getEntrenadorById:', error);
        throw error;
    }
};

// Crear un nuevo entrenador (Create)
export const createEntrenador = async (entrenador: Omit<Entrenador, 'id'>): Promise<Entrenador> => {
    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(entrenador),
        });
        if (!response.ok) throw new Error('Error al crear el entrenador');
        return unwrap<Entrenador>(await response.json());
    } catch (error) {
        console.error('Error en createEntrenador:', error);
        throw error;
    }
};

// Actualizar un entrenador existente (Update)
export const updateEntrenador = async (id: string, entrenador: Partial<Entrenador>): Promise<Entrenador> => {
    try {
        const response = await fetch(`${ENDPOINT}/${id}`, {
            method: 'PATCH',
            headers: authHeaders(),
            body: JSON.stringify(entrenador),
        });
        if (!response.ok) throw new Error('Error al actualizar el entrenador');
        return unwrap<Entrenador>(await response.json());
    } catch (error) {
        console.error('Error en updateEntrenador:', error);
        throw error;
    }
};

// Eliminar un entrenador (Delete)
export const deleteEntrenador = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${ENDPOINT}/${id}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        if (!response.ok) throw new Error('Error al eliminar el entrenador');
    } catch (error) {
        console.error('Error en deleteEntrenador:', error);
        throw error;
    }
};
