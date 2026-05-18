import apiClient from '../api/apiClient';
import { AREAS_VOLUNTARIADO, ENDPOINT_MAP } from '../api/apiConstants';
import type { ConfigItem, ConfigData } from '../types';

export const getConfig = async (key: string): Promise<ConfigItem[]> => {
    // Interceptar areas_voluntariado para retornar opciones estáticas
    if (key === 'areas_voluntariado') return AREAS_VOLUNTARIADO;

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
