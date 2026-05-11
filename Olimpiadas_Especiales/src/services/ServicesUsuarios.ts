import type { Usuario } from '../types';

const API_URL = "http://localhost:3001/usuarios";

export const getUsuarios = async (): Promise<Usuario[]> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener los usuarios");
        return await response.json() as Usuario[];
    } catch (error) {
        console.error("Error en getUsuarios:", error);
        throw error;
    }
};

export const getUsuarioById = async (id: string): Promise<Usuario> => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Error al obtener el usuario");
        return await response.json() as Usuario;
    } catch (error) {
        console.error("Error en getUsuarioById:", error);
        throw error;
    }
};

export const createUsuario = async (usuario: Omit<Usuario, 'id'>): Promise<Usuario> => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...usuario,
                rol: 'usuario',
                fechaRegistro: new Date().toISOString()
            }),
        });
        if (!response.ok) throw new Error("Error al registrar el usuario");
        return await response.json() as Usuario;
    } catch (error) {
        console.error("Error en createUsuario:", error);
        throw error;
    }
};

export const updateUsuario = async (id: string, usuario: Partial<Usuario>): Promise<Usuario> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(usuario),
        });
        if (!response.ok) throw new Error("Error al actualizar el usuario");
        return await response.json() as Usuario;
    } catch (error) {
        console.error("Error en updateUsuario:", error);
        throw error;
    }
};
