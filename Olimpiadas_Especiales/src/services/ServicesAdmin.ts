import type { Registro, Activity, Competicion, Stats, AdminProfile, SystemSettings, Graficos, Atleta, Consulta, PaginatedResponse } from '../types';
import apiClient from '../api/apiClient';

const ROL_ID_MAP: Record<string, number> = {
    admin: 1,
    atleta: 2,
    entrenador: 3,
    voluntario: 4,
    tutor: 5
};

const formatActivityTime = (time: string | Date | undefined): string => {
    if (!time) return 'Ahora';
    if (typeof time === 'string' && time.toLowerCase() === 'ahora') return 'Ahora';
    const date = new Date(time);
    if (Number.isNaN(date.getTime())) return String(time);
    return date.toLocaleString('es-CR', { dateStyle: 'short', timeStyle: 'short' });
};

const mapActivityRow = (item: Record<string, unknown>): Activity => ({
    id: String(item.id ?? ''),
    title: String(item.title ?? ''),
    details: String(item.details ?? ''),
    time: formatActivityTime(item.time as string | Date | undefined),
    icon: String(item.icon ?? 'fa-solid fa-circle-info'),
    iconColor: String(item.icon_color ?? item.iconColor ?? 'blue')
});

type ChartsApiPayload = {
    registrosPorMes?: Array<{ name: string; value: number }>;
    distribucionAtletas?: Array<{ name: string; value: number }>;
    crecimiento?: Graficos['crecimiento'];
    distribucion?: Graficos['distribucion'];
};

const mapChartsResponse = (raw: ChartsApiPayload): Graficos => ({
    crecimiento: raw.crecimiento ?? (raw.registrosPorMes ?? []).map(p => ({
        mes: p.name,
        valor: p.value
    })),
    distribucion: raw.distribucion ?? (raw.distribucionAtletas ?? []).map(p => ({
        label: p.name,
        valor: p.value
    }))
});

/* Servicio administrativo centralizado conectado al Backend real */
export const ServicesAdmin = {

    // Registros Pendientes (Inscripciones)
    getRegistrations: async (page = 1, limit = 10, search = ''): Promise<PaginatedResponse<Registro>> => {
        const res = await apiClient.get<PaginatedResponse<Registro>>(`/registros-pendientes?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
        return res.data;
    },

    saveRegistro: async (data: Partial<Registro>, id: string | null = null): Promise<Registro> => {
        const res = id
            ? await apiClient.patch<Registro>(`/registros-pendientes/${id}`, data)
            : await apiClient.post<Registro>('/registros-pendientes', data);
        return res.data;
    },

    /** Registro público con archivos cifrados (multipart/form-data). */
    saveRegistroConDocumentos: async (
        data: Partial<Registro>,
        archivos: Record<string, File | null>
    ): Promise<Registro> => {
        const formData = new FormData();
        formData.append('datos', JSON.stringify(data));
        Object.entries(archivos).forEach(([campo, file]) => {
            if (file) formData.append(campo, file);
        });
        const res = await apiClient.post<{ data: Registro }>('/registros-pendientes', formData);
        return res.data.data ?? (res.data as unknown as Registro);
    },

    getDocumentosRegistro: async (registroId: string | number) => {
        const res = await apiClient.get<{ data: Array<{
            id: number;
            categoria: string;
            nombre_original: string;
            mime_type: string;
            tamano_bytes: number;
        }> }>(`/registros-pendientes/${registroId}/documentos`);
        return res.data.data ?? [];
    },

    descargarDocumentoRegistro: async (registroId: string | number, docId: number, nombre: string) => {
        const res = await apiClient.get(`/registros-pendientes/${registroId}/documentos/${docId}/download`, {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(res.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombre;
        a.click();
        window.URL.revokeObjectURL(url);
    },

    deleteRegistro: async (id: string): Promise<void> => {
        await apiClient.delete(`/registros-pendientes/${id}`);
    },

    // Lógica de Aprobación
    aprobarRegistro: async (registro: Registro): Promise<boolean> => {
        const role = registro.rol || 'atleta';
        const targetEndpoint: Record<string, string> = {
            atleta: 'atletas',
            entrenador: 'entrenadores',
            voluntario: 'voluntarios',
            tutor: 'tutores'
        };
        const endpoint = targetEndpoint[role] || 'atletas';

        const userEmail = registro.email?.toLowerCase();
        let userId = registro.usuario_id;

        if (!userId && userEmail) {
            try {
                const resU = await apiClient.get<{ data: Array<{ id: string | number }> }>(
                    `/usuarios?correo_electronico=${encodeURIComponent(userEmail)}`
                );
                const users = resU.data.data ?? [];
                if (users.length > 0) userId = users[0].id;
            } catch (e) {
                console.error('Error buscando usuario:', e);
            }
        }

        if (userId) {
            try {
                await apiClient.patch(`/usuarios/${userId}`, {
                    rol_id: ROL_ID_MAP[role] ?? 2,
                    status: 'ACTIVO'
                });
            } catch (e) {
                console.error('Error actualizando usuario base:', e);
            }
        }

        const payloadDatos = (registro as Registro & { datos?: Record<string, unknown> }).datos ?? registro;
        const officialData: Record<string, unknown> = {
            ...(typeof payloadDatos === 'object' ? payloadDatos : {}),
            usuario_id: userId || null,
            status: 'ACTIVO',
            fecha_aprobacion: new Date().toISOString(),
            correo_electronico: registro.email,
            correoElectronico: registro.email,
        };

        if (role === 'atleta' && registro.id) {
            officialData.registro_pendiente_id = registro.id;
            officialData.registroPendienteId = registro.id;
        }

        await apiClient.post(`/${endpoint}`, officialData);
        // Marcar aprobado sin borrar: conserva documentos cifrados (todos los roles).
        await apiClient.patch(`/registros-pendientes/${registro.id}`, { estado: 'APROBADA' });

        return true;
    },

    rechazarRegistro: async (id: string, _role: string = 'atleta'): Promise<void> => {
        await apiClient.patch(`/registros-pendientes/${id}`, {
            estado: 'RECHAZADA'
        });
    },

    // Atletas Oficiales
    getAtletas: async (): Promise<Atleta[]> => {
        const res = await apiClient.get<{ data: Atleta[] }>('/atletas');
        return res.data.data;
    },

    getActivities: async (): Promise<Activity[]> => {
        try {
            const res = await apiClient.get<Record<string, unknown>[] | { data: Record<string, unknown>[] }>('/actividades-sistema');
            const rows = Array.isArray(res.data) ? res.data : (res.data.data ?? []);
            return rows.map(mapActivityRow);
        } catch {
            return [];
        }
    },

    getProfile: async (): Promise<AdminProfile> => {
        const res = await apiClient.get<{ data: AdminProfile & { correoElectronico?: string } }>('/auth/profile');
        const data = res.data.data;
        return {
            ...data,
            email: data.email ?? data.correoElectronico ?? ''
        };
    },

    updateProfile: async (
        data: Partial<AdminProfile> & {
            correoElectronico?: string;
            passwordActual?: string;
            passwordNuevo?: string;
        }
    ): Promise<AdminProfile> => {
        const payload = {
            nombre: data.nombre,
            correoElectronico: data.correoElectronico ?? data.email,
            passwordActual: data.passwordActual,
            passwordNuevo: data.passwordNuevo
        };
        const res = await apiClient.patch<{ data: AdminProfile & { correoElectronico?: string } }>('/auth/profile', payload);
        const updated = res.data.data;
        return {
            ...updated,
            email: updated.email ?? updated.correoElectronico ?? ''
        };
    },

    getSettings: async (): Promise<SystemSettings> => {
        const res = await apiClient.get<{ data: SystemSettings }>('/settings');
        return res.data.data;
    },

    updateSettings: async (data: SystemSettings): Promise<SystemSettings> => {
        const res = await apiClient.put<{ data: SystemSettings }>('/settings', data);
        return res.data.data;
    },

    getUsers: async (): Promise<any[]> => {
        const res = await apiClient.get<{ data: any[] }>('/usuarios/all');
        return res.data.data ?? [];
    },

    deleteUser: async (id: string | number): Promise<void> => {
        await apiClient.delete(`/usuarios/${id}`);
    },

    getCharts: async (): Promise<Graficos> => {
        try {
            const res = await apiClient.get<{ data: ChartsApiPayload }>('/stats/charts');
            return mapChartsResponse(res.data.data ?? {});
        } catch {
            return { crecimiento: [], distribucion: [] };
        }
    },

    getStats: async (): Promise<Stats> => {
        const res = await apiClient.get<{ data: Stats }>('/stats');
        return res.data.data;
    },

    getCompeticiones: async (): Promise<Competicion[]> => {
        const res = await apiClient.get<{ data: Competicion[] }>('/competiciones');
        return res.data.data;
    },

    saveCompeticion: async (data: Partial<Competicion>, id: string | null = null): Promise<Competicion> => {
        if (id) {
            const res = await apiClient.put<{ data: Competicion }>(`/competiciones/${id}`, data);
            return res.data.data;
        }
        const res = await apiClient.post<{ data: Competicion }>('/competiciones', {
            ...data,
            status: data.status || 'Programado'
        });
        return res.data.data;
    },

    deleteCompeticion: async (id: string): Promise<boolean> => {
        await apiClient.delete(`/competiciones/${id}`);
        return true;
    },

    getConsultas: async (): Promise<Consulta[]> => {
        const res = await apiClient.get<{ data: Consulta[] }>('/consultas');
        return res.data.data || (res.data as unknown as Consulta[]);
    },

    deleteConsulta: async (id: string | number): Promise<boolean> => {
        await apiClient.delete(`/consultas/${id}`);
        return true;
    },

    sugerirRespuesta: async (id: string | number): Promise<{ borrador: string }> => {
        const res = await apiClient.post<{ borrador: string }>(`/consultas/${id}/sugerirRespuesta`);
        return res.data;
    },

    responderConsulta: async (id: string | number, mensajeRespuesta: string): Promise<{ success: boolean; message: string; simulado?: boolean }> => {
        const res = await apiClient.post<{ success: boolean; message: string; simulado?: boolean }>(`/consultas/${id}/responder`, { mensajeRespuesta });
        return res.data;
    },

    responderAutomatico: async (id: string | number): Promise<{
        success: boolean;
        borrador: string;
        message: string;
        simulado?: boolean;
        destinatario?: string;
    }> => {
        const res = await apiClient.post(`/consultas/${id}/responder-automatico`);
        return res.data;
    },

    responderTodasPendientes: async (): Promise<{
        success: boolean;
        total: number;
        enviados: number;
        fallidos: number;
        simulados: number;
        message: string;
        detalles?: Array<{ id: number | string; nombre: string; ok: boolean; error?: string; message?: string }>;
    }> => {
        const res = await apiClient.post('/consultas/responder-pendientes');
        return res.data;
    },

    responderMasivo: async (
        correos: string[],
        asunto: string,
        mensajeRespuesta: string,
        consultaIds?: (number | string)[]
    ): Promise<{ success: boolean; message: string }> => {
        const res = await apiClient.post<{ success: boolean; message: string }>('/consultas/responder-masivo', {
            correos,
            asunto,
            mensajeRespuesta,
            consultaIds
        });
        return res.data;
    },

    logActivity: async (title: string, details: string, icon: string, iconColor: string): Promise<void> => {
        try {
            await apiClient.post('/actividades-sistema', {
                title,
                details,
                icon,
                iconColor,
                time: 'Ahora'
            });
        } catch (e) {
            console.error('Error registrando actividad:', e);
        }
    }
};
