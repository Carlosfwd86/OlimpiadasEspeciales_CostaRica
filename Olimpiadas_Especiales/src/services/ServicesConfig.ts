import apiClient from '../api/apiClient';
import type { ConfigItem, ConfigData } from '../types';

// Mapa de clave de config a ruta real del backend
const ENDPOINT_MAP: Record<string, string> = {
    disciplinas:      'disciplinas',
    programas:        'programas',
    niveles_habilidad: 'niveles-habilidad',
    areas_voluntariado: 'voluntario-area'
};

export const getConfig = async (key: string): Promise<ConfigItem[]> => {
    try {
        const path = ENDPOINT_MAP[key] ?? key;
        const response = await apiClient.get<ConfigItem[]>(`/${path}`);
        return response.data;
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
