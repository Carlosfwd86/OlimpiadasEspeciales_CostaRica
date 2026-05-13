import apiClient from '../api/apiClient';
import type { Registro, Activity, Competicion, Stats, AdminProfile, SystemSettings, Graficos, Atleta } from '../types';

/* [verde] Servicio administrativo centralizado conectado al Backend real */
export const ServicesAdmin = {
    
    // Registros Pendientes (Inscripciones)
    getRegistrations: async (): Promise<Registro[]> => {
        // El backend devuelve { data: [...] }
        const res = await apiClient.get<{ data: Registro[] }>('/registros-pendientes');
        return res.data.data;
    },

    saveRegistro: async (data: Partial<Registro>, id: string | null = null): Promise<Registro> => {
        const res = id 
            ? await apiClient.patch<Registro>(`/registros-pendientes/${id}`, data)
            : await apiClient.post<Registro>('/registros-pendientes', data);
        return res.data;
    },

    deleteRegistro: async (id: string): Promise<void> => {
        await apiClient.delete(`/registros-pendientes/${id}`);
    },

    // Lógica de Aprobación
    aprobarRegistro: async (registro: Registro): Promise<boolean> => {
        // En el backend real, esto se maneja vía /api/inscripciones/:id/aprobar o similar
        // Por ahora mantenemos la lógica pero apuntando a los endpoints correctos
        const role = registro.rol || 'atleta';
        const endpoint = role === 'atleta' ? 'atletas' : `${role}s`; 
        
        await apiClient.post(`/atletas`, { ...registro, status: 'ACTIVO' });
        await apiClient.delete(`/registros-pendientes/${registro.id}`);
        return true;
    },

    // Atletas Oficiales
    getAtletas: async (): Promise<Atleta[]> => {
        const res = await apiClient.get<Atleta[]>('/atletas');
        return res.data;
    },

    // Actividad del Sistema (Mockeado si no hay endpoint real)
    getActivities: async (): Promise<Activity[]> => {
        try {
            const res = await apiClient.get<Activity[]>('/stats/activities');
            return res.data;
        } catch {
            return []; // Fallback seguro
        }
    },

    // Perfil Administrativo
    getProfile: async (): Promise<AdminProfile> => {
        const res = await apiClient.get<{ data: AdminProfile }>('/auth/profile');
        return res.data.data;
    },

    // Configuración del sistema
    getSettings: async (): Promise<SystemSettings> => {
        const res = await apiClient.get<SystemSettings>('/settings');
        return res.data;
    },

    updateSettings: async (data: SystemSettings): Promise<SystemSettings> => {
        const res = await apiClient.put<SystemSettings>('/settings', data);
        return res.data;
    },

    // Gestión de usuarios
    getUsers: async (): Promise<any[]> => {
        const res = await apiClient.get<any[]>('/usuarios');
        return res.data;
    },

    // Gráficos
    getCharts: async (): Promise<Graficos> => {
        try {
            const res = await apiClient.get<Graficos>('/stats/charts');
            return res.data;
        } catch {
            return { crecimiento: [], distribucion: [] };
        }
    },

    // Estadísticas — Llamada unificada al endpoint profesional del backend
    getStats: async (): Promise<Stats> => {
        const res = await apiClient.get<{ data: Stats }>('/stats');
        return res.data.data;
    },

    // Competiciones
    getCompeticiones: async (): Promise<Competicion[]> => {
        const res = await apiClient.get<Competicion[]>('/competiciones');
        return res.data;
    },

    saveCompeticion: async (data: Partial<Competicion>, id: string | null = null): Promise<Competicion> => {
        const res = id 
            ? await apiClient.put<Competicion>(`/competiciones/${id}`, data)
            : await apiClient.post<Competicion>('/competiciones', data);
        return res.data;
    },

    deleteCompeticion: async (id: number | string): Promise<boolean> => {
        await apiClient.delete(`/competiciones/${id}`);
        return true;
    },

    logActivity: async (title: string, details: string, icon: string = "fa-solid fa-circle-info", iconColor: string = "blue"): Promise<void> => {
        // Enviar log al backend si existe el endpoint
        console.log(`Log: ${title} - ${details}`);
    }
};

