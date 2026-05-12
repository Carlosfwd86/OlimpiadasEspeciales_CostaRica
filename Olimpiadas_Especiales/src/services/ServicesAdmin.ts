import type { Registro, Activity, Competicion, Stats, AdminProfile, SystemSettings, Graficos, Atleta } from '../types';

// URL base del backend real (configurable por variable de entorno)
const BACKEND_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";

// Helper: retorna headers con JWT desde localStorage
const authHeaders = (): HeadersInit => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`
});

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

    // Atletas Oficiales — conectado al backend real
    getAtletas: async (): Promise<Atleta[]> => {
        const res = await fetch(`${BACKEND_URL}/atletas?page=1&limit=500`, {
            headers: authHeaders()
        });
        if (!res.ok) throw new Error("Error al obtener atletas");
        const json = await res.json() as { data: { items: Atleta[] } };
        // Normalización de campos: el backend puede usar sport/provincia en lugar de disciplina/region
        return json.data.items.map(a => ({
            ...a,
            disciplina: a.disciplina ?? (a as Record<string, unknown>).sport as string ?? 'Otro',
            region: a.region ?? (a as Record<string, unknown>).provincia as string ?? 'Otro'
        }));
    },

    // Actividad del Sistema
    getActivities: async (): Promise<Activity[]> => {
        const res = await fetch(`${BASE_URL}/actividad_sistema`);
        if (!res.ok) throw new Error("Error al obtener actividades");
        return res.json() as Promise<Activity[]>;
    },

    // Perfil del administrador — conectado al backend real
    getProfile: async (): Promise<AdminProfile> => {
        const res = await fetch(`${BACKEND_URL}/auth/profile`, {
            headers: authHeaders()
        });
        if (!res.ok) throw new Error("Error al obtener perfil");
        const json = await res.json() as { data: AdminProfile };
        return json.data;
    },

    updateProfile: async (data: Partial<AdminProfile>): Promise<AdminProfile> => {
        const res = await fetch(`${BACKEND_URL}/auth/profile`, {
            method: 'PATCH',
            headers: authHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({} as { message?: string })) as { message?: string };
            throw new Error(err.message ?? "Error al actualizar perfil");
        }
        const json = await res.json() as { data: AdminProfile };
        return json.data;
    },

    // Configuración del sistema — conectado al backend real
    getSettings: async (): Promise<SystemSettings> => {
        const res = await fetch(`${BACKEND_URL}/settings`, {
            headers: authHeaders()
        });
        if (!res.ok) throw new Error("Error al obtener configuraciones");
        const json = await res.json() as { data: SystemSettings };
        return json.data;
    },

    updateSettings: async (data: SystemSettings): Promise<SystemSettings> => {
        const res = await fetch(`${BACKEND_URL}/settings`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Error al actualizar configuraciones");
        const json = await res.json() as { data: SystemSettings };
        return json.data;
    },

    // Gestión de usuarios — conectado al backend real
    getUsers: async (): Promise<Record<string, unknown>[]> => {
        const res = await fetch(`${BACKEND_URL}/usuarios`, {
            headers: authHeaders()
        });
        if (!res.ok) throw new Error("Error al obtener usuarios");
        const json = await res.json() as { data: { items: Record<string, unknown>[] } };
        return json.data.items;
    },

    saveUser: async (data: Record<string, unknown>, id: string | null = null): Promise<Record<string, unknown>> => {
        const method = id ? 'PATCH' : 'POST';
        const url = id ? `${BACKEND_URL}/usuarios/${id}` : `${BACKEND_URL}/usuarios`;
        const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(data) });
        if (!res.ok) throw new Error("Error al guardar usuario");
        const json = await res.json() as { data: Record<string, unknown> };
        return json.data;
    },

    deleteUser: async (id: string): Promise<boolean> => {
        const res = await fetch(`${BACKEND_URL}/usuarios/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
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

    // Estadísticas — una sola llamada al backend real
    getStats: async (): Promise<Stats> => {
        const res = await fetch(`${BACKEND_URL}/stats`, {
            headers: authHeaders()
        });
        if (!res.ok) throw new Error("Error al obtener estadísticas");
        const json = await res.json() as { data: Stats };
        return json.data; // shape idéntico al actual, sin cambios en Panel-Administrativo
    },

    // Competiciones
    getCompeticiones: async (): Promise<Competicion[]> => {
        const res = await fetch(`${BASE_URL}/competiciones`);
        if (!res.ok) throw new Error("Error al obtener competiciones");
        return res.json() as Promise<Competicion[]>;
    },

    saveCompeticion: async (data: Partial<Competicion>, id: string | null = null): Promise<Competicion> => {
        const method = id ? 'PATCH' : 'POST';
        const url = id ? `${BASE_URL}/competiciones/${id}` : `${BASE_URL}/competiciones`;
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(id ? data : {
                ...data,
                id: Math.random().toString(36).substr(2, 9),
                status: 'Programado'
            })
        });
        if (!res.ok) throw new Error("Error al guardar competición");
        return res.json() as Promise<Competicion>;
    },

    deleteCompeticion: async (id: string): Promise<boolean> => {
        const res = await fetch(`${BASE_URL}/competiciones/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Error al eliminar competición");
        return true;
    }
};
