import type { Registro, Activity, Competicion, Stats, AdminProfile, SystemSettings, Graficos, Atleta } from '../types';
import apiClient from '../api/apiClient';

const BASE_URL = "http://localhost:3001";

export const ServicesAdmin = {
    // Registros Pendientes
    getRegistrations: async (): Promise<Registro[]> => {
        const res = await fetch(`${BASE_URL}/registros_pendientes`);
        if (!res.ok) throw new Error("Error al obtener registros");
        return res.json() as Promise<Registro[]>;
    },

    saveRegistro: async (data: Partial<Registro>, id: string | null = null): Promise<Registro> => {
        const method = id ? 'PATCH' : 'POST';
        const url = id ? `${BASE_URL}/registros_pendientes/${id}` : `${BASE_URL}/registros_pendientes`;
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Error al guardar el registro");
        return res.json() as Promise<Registro>;
    },

    deleteRegistro: async (id: string): Promise<void> => {
        const res = await fetch(`${BASE_URL}/registros_pendientes/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Error al eliminar");
    },

    // Lógica de Aprobación Dinámica
    aprobarRegistro: async (registro: Registro): Promise<boolean> => {
        const role = registro.rol || 'atleta';
        const targetEndpoint: Record<string, string> = {
            'atleta': 'atletas',
            'entrenador': 'entrenadores',
            'voluntario': 'voluntarios',
            'tutor': 'tutores'
        };
        const endpoint = targetEndpoint[role] || 'atletas';

        const userEmail = registro.correoElectronico || registro.email as string | undefined;
        let userId = registro.usuarioId;

        if (!userId && userEmail) {
            try {
                const resU = await fetch(`${BASE_URL}/usuarios?correoElectronico=${(userEmail as string).toLowerCase()}`);
                const users = await resU.json() as Array<{ id: string }>;
                if (users.length > 0) userId = users[0].id;
            } catch (e) { console.error("Error buscando usuario:", e); }
        }

        if (userId) {
            try {
                await fetch(`${BASE_URL}/usuarios/${userId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        rol: role,
                        pais: registro.pais || undefined,
                        direccion: registro.direccion || undefined,
                        telefono: registro.telefono || undefined
                    })
                });
            } catch (e) { console.error("Error actualizando usuario base:", e); }
        }

        const officialData: Registro = {
            ...registro,
            id: userId ? `${role}_${userId}` : registro.id,
            usuarioId: userId || null,
            status: 'ACTIVO',
            fechaAprobacion: new Date().toISOString()
        };

        const fieldsToDelete: (keyof Registro)[] = ['statusColor', 'bgColor', 'time', 'initials'];
        fieldsToDelete.forEach(f => delete officialData[f]);

        const resOfficial = await fetch(`${BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(officialData)
        });
        if (!resOfficial.ok) throw new Error(`Error al crear registro en ${endpoint}`);

        await fetch(`${BASE_URL}/registros_pendientes/${registro.id}`, { method: 'DELETE' });

        return true;
    },

    // Atletas Oficiales
    getAtletas: async (): Promise<Atleta[]> => {
        const res = await fetch(`${BASE_URL}/atletas`);
        if (!res.ok) throw new Error("Error al obtener atletas");
        return res.json() as Promise<Atleta[]>;
    },

    // Actividad del Sistema
    getActivities: async (): Promise<Activity[]> => {
        const res = await fetch(`${BASE_URL}/actividad_sistema`);
        if (!res.ok) throw new Error("Error al obtener actividades");
        return res.json() as Promise<Activity[]>;
    },

    getProfile: async (id: number | string = 1): Promise<AdminProfile> => {
        const res = await fetch(`${BASE_URL}/Admin/${id}`);
        if (!res.ok) throw new Error("Error al obtener perfil");
        return res.json() as Promise<AdminProfile>;
    },

    updateProfile: async (id: number | string, data: Partial<AdminProfile>): Promise<AdminProfile> => {
        const res = await fetch(`${BASE_URL}/Admin/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Error al actualizar perfil");
        return res.json() as Promise<AdminProfile>;
    },

    getSettings: async (): Promise<SystemSettings> => {
        const res = await fetch(`${BASE_URL}/system_settings`);
        if (!res.ok) throw new Error("Error al obtener configuraciones");
        return res.json() as Promise<SystemSettings>;
    },

    updateSettings: async (data: SystemSettings): Promise<SystemSettings> => {
        const res = await fetch(`${BASE_URL}/system_settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Error al actualizar configuraciones");
        return res.json() as Promise<SystemSettings>;
    },

    getUsers: async (): Promise<Record<string, unknown>[]> => {
        const res = await fetch(`${BASE_URL}/usuarios_sistema`);
        if (!res.ok) throw new Error("Error al obtener usuarios");
        return res.json() as Promise<Record<string, unknown>[]>;
    },

    deleteUser: async (id: string): Promise<boolean> => {
        const res = await fetch(`${BASE_URL}/usuarios_sistema/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Error al eliminar usuario");
        return true;
    },

    logActivity: async (
        title: string,
        details: string,
        icon: string = "fa-solid fa-circle-info",
        iconColor: string = "blue"
    ): Promise<void> => {
        const activity: Omit<Activity, 'id'> = { title, details, icon, iconColor, time: "Hace un momento" };
        await fetch(`${BASE_URL}/actividad_sistema`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(activity)
        });
    },

    // Gráficos
    getCharts: async (): Promise<Graficos> => {
        const res = await fetch(`${BASE_URL}/graficos`);
        if (!res.ok) throw new Error("Error al obtener gráficos");
        return res.json() as Promise<Graficos>;
    },

    // Estadísticas
    getStats: async (): Promise<Stats> => {
        const [atletas, pendientes, volunt] = await Promise.all([
            fetch(`${BASE_URL}/atletas`).then(r => r.json()) as Promise<unknown[]>,
            fetch(`${BASE_URL}/registros_pendientes`).then(r => r.json()) as Promise<unknown[]>,
            fetch(`${BASE_URL}/voluntarios`).then(r => r.json()) as Promise<unknown[]>
        ]);

        return {
            totalRegistros: { valor: atletas.length + pendientes.length, porcentaje: "+12%", tendencia: "up" },
            atletasActivos: { valor: atletas.length, porcentaje: "+5%", tendencia: "up" },
            revisionesPendientes: { valor: pendientes.length, textoExtra: "Requieren acción" },
            voluntarios: { valor: volunt.length, porcentaje: "0%", tendencia: "none" }
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

    /**
     * Inscribe un atleta en una competición específica.
     * Endpoint esperado: POST /api/competiciones/inscribir-atleta
     * Payload: { atletaId: string | number; competicionId: string | number }
     * Posibles respuestas:
     * - 200/201: Creado/Éxito
     * - 409: Conflicto (El atleta ya está inscrito en esta competición)
     */
    inscribirAtleta: async (payload: { atletaId: string | number; competicionId: string | number }): Promise<void> => {
        await apiClient.post('/competiciones/inscribir-atleta', payload);
    }
};
