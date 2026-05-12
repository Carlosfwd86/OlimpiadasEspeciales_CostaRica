import type { Usuario } from '../types';

const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
const ENDPOINT = `${BACKEND_URL}/usuarios`;

// Helper: headers con JWT
const authHeaders = (): HeadersInit => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`
});

// Helpers para desenvuelve respuestas
const unwrapList = <T>(json: unknown): T[] => {
    if (Array.isArray(json)) return json as T[];
    const j = json as Record<string, unknown>;
    const d = j?.data as Record<string, unknown> | T[] | undefined;
    if (Array.isArray(d)) return d as T[];
    if (d && Array.isArray((d as Record<string, unknown>).items)) return (d as { items: T[] }).items;
    return [];
};

const unwrapOne = <T>(json: unknown): T => {
    const j = json as Record<string, unknown>;
    return (j?.data ?? json) as T;
};

export const getUsuarios = async (): Promise<Usuario[]> => {
    try {
        const response = await fetch(ENDPOINT, { headers: authHeaders() });
        if (!response.ok) throw new Error('Error al obtener los usuarios');
        return unwrapList<Usuario>(await response.json());
    } catch (error) {
        console.error('Error en getUsuarios:', error);
        throw error;
    }
};

export const getUsuarioById = async (id: string): Promise<Usuario> => {
    try {
        const response = await fetch(`${ENDPOINT}/${id}`, { headers: authHeaders() });
        if (!response.ok) throw new Error('Error al obtener el usuario');
        return unwrapOne<Usuario>(await response.json());
    } catch (error) {
        console.error('Error en getUsuarioById:', error);
        throw error;
    }
};

export const createUsuario = async (usuario: Omit<Usuario, 'id'>): Promise<Usuario> => {
    try {
        const response = await fetch(`${BACKEND_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...usuario,
                rol_id: 2, // rol usuario por defecto
                fechaRegistro: new Date().toISOString()
            }),
        });
        if (!response.ok) throw new Error('Error al registrar el usuario');
        return unwrapOne<Usuario>(await response.json());
    } catch (error) {
        console.error('Error en createUsuario:', error);
        throw error;
    }
};

export const updateUsuario = async (id: string, usuario: Partial<Usuario>): Promise<Usuario> => {
    try {
        const response = await fetch(`${ENDPOINT}/${id}`, {
            method: 'PATCH',
            headers: authHeaders(),
            body: JSON.stringify(usuario),
        });
        if (!response.ok) throw new Error('Error al actualizar el usuario');
        return unwrapOne<Usuario>(await response.json());
    } catch (error) {
        console.error('Error en updateUsuario:', error);
        throw error;
    }
};
