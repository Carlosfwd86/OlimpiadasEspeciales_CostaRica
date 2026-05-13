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

export const createUsuario = async (usuario: any): Promise<Usuario> => {
    try {
        // Separar nombre y apellido del nombre completo
        const nombres = (usuario.nombre || '').trim().split(' ');
        const nombre = nombres[0] || 'Usuario';
        const apellido = nombres.slice(1).join(' ') || '.';

        const payload = {
            nombre: nombre,
            apellido: apellido,
            cedula: usuario.cedula,
            correo_electronico: usuario.correoElectronico || usuario.correo_electronico,
            telefono: usuario.telefono,
            password: usuario.password,
            fecha_nacimiento: usuario.fechaNacimiento,
            genero: usuario.genero === 'NoDecir' ? 'Otro' : usuario.genero,
            rol_id: 2, // ID del rol Atleta/Usuario básico
        };

        const response = await fetch(`${BACKEND_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Detalles del error:', errorData);
            
            // Extraer el primer error de los detalles si existe
            const firstError = errorData.details?.[0] ? Object.values(errorData.details[0])[0] : null;
            const errorMsg = (firstError as string) || errorData.error || 'Error al registrar el usuario';
            
            throw new Error(errorMsg);
        }
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
