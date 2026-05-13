import apiClient from '../api/apiClient';
import type { Registro, Activity, Competicion, Stats, AdminProfile, SystemSettings, Graficos, Atleta, Consulta } from '../types';

export const ServicesAdmin = {
    // Registros Pendientes
    getRegistrations: async (): Promise<Registro[]> => {
        const res = await apiClient.get<Registro[]>('/registros-pendientes');
        return res.data;
    },

    saveRegistro: async (data: Partial<Registro>, id: string | null = null): Promise<Registro> => {
        if (id) {
            const res = await apiClient.patch<Registro>(`/registros-pendientes/${id}`, data);
            return res.data;
        } else {
            const res = await apiClient.post<Registro>('/registros-pendientes', data);
            return res.data;
        }
    },

    deleteRegistro: async (id: string): Promise<void> => {
        await apiClient.delete(`/registros-pendientes/${id}`);
    },

    // Lógica de Aprobación Dinámica
    aprobarRegistro: async (registro: Registro): Promise<boolean> => {
        const role = registro.rol || 'atleta';

        // Aprobación específica para voluntarios
        if (role === 'voluntario') {
            await apiClient.put(`/voluntarios/${registro.id}/aprobar`);
            await apiClient.delete(`/registros-pendientes/${registro.id}`);
            return true;
        }

        const targetEndpoint: Record<string, string> = {
            'atleta': 'atletas',
            'entrenador': 'entrenadores',
            'voluntario': 'voluntarios',
            'tutor': 'tutores'
        };
        const endpoint = targetEndpoint[role] || 'atletas';

        const userEmail = registro.email?.toLowerCase();
        let userId = registro.usuario_id;

        if (!userId && userEmail) {
            try {
                const resU = await apiClient.get<Array<{ id: string }>>(`/usuarios?correo_electronico=${userEmail}`);
                if (resU.data.length > 0) userId = resU.data[0].id;
            } catch (e) { console.error("Error buscando usuario:", e); }
        }

        if (userId) {
            try {
                await apiClient.patch(`/usuarios/${userId}`, {
                    rol: role,
                    status: 'ACTIVO'
                });
            } catch (e) { console.error("Error actualizando usuario base:", e); }
        }

        const officialData = {
            ...registro,
            id: userId ? `${role}_${userId}` : registro.id,
            usuario_id: userId || null,
            status: 'ACTIVO',
            fecha_aprobacion: new Date().toISOString()
        };

        const fieldsToDelete = ['statusColor', 'bgColor', 'time', 'initials'];
        fieldsToDelete.forEach(f => delete (officialData as any)[f]);

        await apiClient.post(`/${endpoint}`, officialData);
        await apiClient.delete(`/registros-pendientes/${registro.id}`);

        return true;
    },

    rechazarRegistro: async (id: string, role: string = 'atleta'): Promise<void> => {
        if (role === 'voluntario') {
            await apiClient.put(`/voluntarios/${id}/rechazar`);
        } else {
            await apiClient.patch(`/registros-pendientes/${id}`, { 
                status: 'RECHAZADO'
            });
        }
    },

    // Atletas Oficiales
    getAtletas: async (): Promise<Atleta[]> => {
        const res = await apiClient.get<Atleta[]>('/atletas');
        return res.data;
    },

    // Actividad del Sistema
    getActivities: async (): Promise<Activity[]> => {
        try {
            const res = await apiClient.get<Activity[]>('/actividad-sistema');
            return res.data;
        } catch (error) {
            console.warn("Actividad del sistema no disponible");
            return [];
        }
    },

    getProfile: async (id: number | string = 1): Promise<AdminProfile> => {
        const res = await apiClient.get<AdminProfile>(`/Admin/${id}`);
        return res.data;
    },

    updateProfile: async (id: number | string, data: Partial<AdminProfile>): Promise<AdminProfile> => {
        const res = await apiClient.put<AdminProfile>(`/Admin/${id}`, data);
        return res.data;
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
    getUsers: async (): Promise<Record<string, unknown>[]> => {
        const res = await apiClient.get<Record<string, unknown>[]>('/usuarios');
        return res.data;
    },

    deleteUser: async (id: string): Promise<boolean> => {
        await apiClient.delete(`/usuarios/${id}`);
        return true;
    },

    logActivity: async (
        title: string,
        details: string,
        icon: string = "fa-solid fa-circle-info",
        iconColor: string = "blue"
    ): Promise<void> => {
        try {
            const activity = { title, details, icon, iconColor, time: new Date().toISOString() };
            await apiClient.post('/actividad-sistema', activity);
        } catch (e) { /* silent fail */ }
    },

    // Gráficos
    getCharts: async (): Promise<Graficos> => {
        const res = await apiClient.get<Graficos>('/stats/charts');
        return res.data;
    },

    // Estadísticas
    getStats: async (): Promise<Stats> => {
        const res = await apiClient.get<Stats>('/stats/summary');
        return res.data;
    },

    // Competiciones
    getCompeticiones: async (): Promise<Competicion[]> => {
        const res = await apiClient.get<Competicion[]>('/competiciones');
        return res.data;
    },

    saveCompeticion: async (data: Partial<Competicion>, id: string | null = null): Promise<Competicion> => {
        if (id) {
            const res = await apiClient.patch<Competicion>(`/competiciones/${id}`, data);
            return res.data;
        } else {
            const res = await apiClient.post<Competicion>('/competiciones', data);
            return res.data;
        }
    },

    deleteCompeticion: async (id: string): Promise<boolean> => {
        await apiClient.delete(`/competiciones/${id}`);
        return true;
    },

    // Consultas
    getConsultas: async (): Promise<Consulta[]> => {
        const res = await apiClient.get<Consulta[]>('/consultas');
        return res.data;
    },

    deleteConsulta: async (id: string): Promise<boolean> => {
        await apiClient.delete(`/consultas/${id}`);
        return true;
    }
};
