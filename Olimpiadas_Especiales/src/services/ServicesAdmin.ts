import type { Registro, Activity, Competicion, Stats, AdminProfile, SystemSettings, Graficos, Atleta, Consulta } from '../types';
import apiClient from '../api/apiClient';


// URL base del backend real (configurable por variable de entorno)
const BACKEND_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";
const BASE_URL = import.meta.env.VITE_MOCK_URL ?? "http://localhost:3001";

// Helper: retorna headers con JWT desde localStorage
const authHeaders = (): HeadersInit => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`
});

export const ServicesAdmin = {
    // Registros Pendientes
    getRegistrations: async (): Promise<Registro[]> => {
        const res = await apiClient.get<Registro[]>('/registros_pendientes');
        return res.data;
    },

    saveRegistro: async (data: Partial<Registro>, id: string | null = null): Promise<Registro> => {
        if (id) {
            const res = await apiClient.patch<Registro>(`/registros_pendientes/${id}`, data);
            return res.data;
        } else {
            const res = await apiClient.post<Registro>('/registros_pendientes', data);
            return res.data;
        }
    },

    deleteRegistro: async (id: string): Promise<void> => {
        await apiClient.delete(`/registros_pendientes/${id}`);
    },

    // Lógica de Aprobación Dinámica
    aprobarRegistro: async (registro: Registro): Promise<boolean> => {
        const role = registro.rol || 'atleta';

        // Aprobación específica para voluntarios
        if (role === 'voluntario') {
            await apiClient.put(`/voluntarios/${registro.id}/aprobar`);
            await apiClient.delete(`/registros_pendientes/${registro.id}`);
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
                // Buscamos si el usuario ya existe en el sistema central
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

        // Limpiamos campos exclusivos de la tabla de pendientes
        const fieldsToDelete = ['statusColor', 'bgColor', 'time', 'initials'];
        fieldsToDelete.forEach(f => delete (officialData as any)[f]);

        await apiClient.post(`/${endpoint}`, officialData);
        await apiClient.delete(`/registros_pendientes/${registro.id}`);

        return true;
    },

    rechazarRegistro: async (id: string, role: string = 'atleta'): Promise<void> => {
        if (role === 'voluntario') {
            await apiClient.put(`/voluntarios/${id}/rechazar`);
        } else {
            await apiClient.patch(`/registros_pendientes/${id}`, { 
                status: 'RECHAZADO', 
                statusColor: 'red', 
                bgColor: 'bg-light-red' 
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
        const res = await apiClient.get<Activity[]>('/actividad_sistema');
        return res.data;
    },

    getProfile: async (id: number | string = 1): Promise<AdminProfile> => {
        const res = await apiClient.get<AdminProfile>(`/Admin/${id}`);
        return res.data;
    },

    updateProfile: async (id: number | string, data: Partial<AdminProfile>): Promise<AdminProfile> => {
        const res = await apiClient.put<AdminProfile>(`/Admin/${id}`, data);
        return res.data;
    },

    // Configuración del sistema — conectado al backend real
    getSettings: async (): Promise<SystemSettings> => {
        const res = await apiClient.get<SystemSettings>('/system_settings');
        return res.data;
    },

    updateSettings: async (data: SystemSettings): Promise<SystemSettings> => {
        const res = await apiClient.put<SystemSettings>('/system_settings', data);
        return res.data;
    },

    // Gestión de usuarios — conectado al backend real
    getUsers: async (): Promise<Record<string, unknown>[]> => {
        const res = await apiClient.get<Record<string, unknown>[]>('/usuarios/all');
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
        const activity: Omit<Activity, 'id'> = { title, details, icon, iconColor, time: "Hace un momento" };
        await apiClient.post('/actividad_sistema', activity);
    },

    // Gráficos
    getCharts: async (): Promise<Graficos> => {
        const res = await apiClient.get<Graficos>('/graficos');
        return res.data;
    },

    // Estadísticas — una sola llamada al backend real
    getStats: async (): Promise<Stats> => {
        const [atletas, pendientes, volunt] = await Promise.all([
            apiClient.get<unknown[]>('/atletas'),
            apiClient.get<unknown[]>('/registros_pendientes'),
            apiClient.get<unknown[]>('/voluntarios')
        ]);

        return {
            totalRegistros: { valor: atletas.data.length + pendientes.data.length, porcentaje: "+12%", tendencia: 'up' },
            atletasActivos: { valor: atletas.data.length, porcentaje: "+5%", tendencia: 'up' },
            revisionesPendientes: { valor: pendientes.data.length, textoExtra: "Requieren acción" },
            voluntarios: { valor: volunt.data.length, porcentaje: "0%", tendencia: 'none' }
        };
    },

    // Competiciones
    /**
     * Obtiene la lista de competiciones desde el backend usando apiClient.
     */
    getCompeticiones: async (): Promise<Competicion[]> => {
        const res = await apiClient.get<Competicion[]>('/competiciones');
        return res.data;
    },

    /**
     * Guarda una nueva competición o actualiza una existente usando apiClient.
     * @param data Datos parciales de la competición.
     * @param id ID opcional. Si se provee, se actualiza la competición.
     */
    saveCompeticion: async (data: Partial<Competicion>, id: string | null = null): Promise<Competicion> => {
        if (id) {
            const res = await apiClient.patch<Competicion>(`/competiciones/${id}`, data);
            return res.data;
        } else {
            const res = await apiClient.post<Competicion>('/competiciones', {
                ...data,
                status: data.status || 'Programado'
            });
            return res.data;
        }
    },

    /**
     * Elimina una competición por su ID usando apiClient.
     * @param id ID de la competición a eliminar.
     */
    deleteCompeticion: async (id: string): Promise<boolean> => {
        await apiClient.delete(`/competiciones/${id}`);
        return true;
    },

    // Consultas — conectado al backend real

    getConsultas: async (): Promise<Consulta[]> => {
        const res = await fetch(`${BACKEND_URL}/consultas`, {
            headers: authHeaders()
        });
        if (!res.ok) throw new Error("Error al obtener consultas");
        return res.json();
    },

    deleteConsulta: async (id: string): Promise<boolean> => {
        const res = await fetch(`${BACKEND_URL}/consultas/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        if (!res.ok) throw new Error("Error al eliminar consulta");
        return true;

    }
};
