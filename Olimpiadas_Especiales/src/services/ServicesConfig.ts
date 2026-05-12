import type { ConfigItem, ConfigData } from '../types';

// URL base del backend real (configurable por variable de entorno)
const BACKEND_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// Helper: header con JWT desde localStorage
const authHeaders = (): HeadersInit => ({
    Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`
});

// Mapa de clave de config a ruta real del backend
const ENDPOINT_MAP: Record<string, string> = {
    disciplinas:      'disciplinas',
    programas:        'programas',
    niveles_habilidad: 'niveles-habilidad'   // app.js registra /api/niveles-habilidad
};

export const getConfig = async (key: string): Promise<ConfigItem[]> => {
    try {
        const path = ENDPOINT_MAP[key] ?? key;
        const response = await fetch(`${BACKEND_URL}/${path}`, {
            headers: authHeaders()
        });
        if (!response.ok) throw new Error(`Error al obtener ${key}`);
        const json = await response.json() as { data: ConfigItem[] } | ConfigItem[];
        // Soporta tanto respuesta envuelta { data: [...] } como array directo
        return Array.isArray(json) ? json : (json as { data: ConfigItem[] }).data;
    } catch (error) {
        console.error(`Error en getConfig(${key}):`, error);
        return [];
    }
};

export const getFullConfig = async (): Promise<ConfigData> => {
    try {
        const [disciplinas, programas, niveles] = await Promise.all([
            getConfig('disciplinas'),
            getConfig('programas'),
            getConfig('niveles_habilidad')
        ]);
        return { disciplinas, programas, niveles_habilidad: niveles };
    } catch (error) {
        console.error("Error en getFullConfig:", error);
        return { disciplinas: [], programas: [], niveles_habilidad: [] };
    }
};
