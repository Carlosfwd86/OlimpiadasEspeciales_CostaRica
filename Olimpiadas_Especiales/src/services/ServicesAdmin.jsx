const BASE_URL = "http://localhost:3001";

export const ServicesAdmin = {
    // Registros Pendientes
    getRegistrations: async () => {
        const res = await fetch(`${BASE_URL}/registros_pendientes`);
        if (!res.ok) throw new Error("Error al obtener registros");
        return res.json();
    },

    saveRegistro: async (data, id = null, table = 'registros_pendientes') => {
        const method = id ? 'PATCH' : 'POST';
        const url = id ? `${BASE_URL}/${table}/${id}` : `${BASE_URL}/${table}`;
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Error al guardar el registro");
        return res.json();
    },

    deleteRegistro: async (id) => {
        const res = await fetch(`${BASE_URL}/registros_pendientes/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Error al eliminar");
        return res.json();
    },

    // Lógica de Aprobación Dinámica
    aprobarRegistro: async (registro) => {
        const role = registro.rol || 'atleta';
        const targetEndpoint = {
            'atleta': 'atletas',
            'entrenador': 'entrenadores',
            'voluntario': 'voluntarios',
            'tutor': 'tutores'
        }[role] || 'atletas';

        // 1. Localizar al usuario base
        const userEmail = registro.correoElectronico || registro.email;
        let userId = registro.usuarioId;

        if (!userId && userEmail) {
            try {
                const resU = await fetch(`${BASE_URL}/usuarios?correoElectronico=${userEmail.toLowerCase()}`);
                const users = await resU.json();
                if (users.length > 0) userId = users[0].id;
            } catch (e) { console.error("Error buscando usuario:", e); }
        }

        // 2. Actualizar el usuario base (Rol y datos básicos si vienen en el form)
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

        // 3. Crear registro detallado en la tabla del rol
        const officialData = {
            ...registro,
            id: userId ? `${role}_${userId}` : registro.id, // ID único por rol si existe usuario
            usuarioId: userId || null,
            status: 'ACTIVO',
            fechaAprobacion: new Date().toISOString()
        };

        // Limpiar campos temporales
        const fieldsToDelete = ['statusColor', 'bgColor', 'time', 'initials'];
        fieldsToDelete.forEach(f => delete officialData[f]);

        const resOfficial = await fetch(`${BASE_URL}/${targetEndpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(officialData)
        });
        if (!resOfficial.ok) throw new Error(`Error al crear registro en ${targetEndpoint}`);

        // 4. Eliminar de pendientes
        await fetch(`${BASE_URL}/registros_pendientes/${registro.id}`, { method: 'DELETE' });
        
        return true;
    },

    getAtletas: async () => {
        const res = await fetch(`${BASE_URL}/atletas`);
        if (!res.ok) throw new Error("Error al obtener atletas");
        return res.json();
    },

    deleteAthlete: async (id) => {
        const res = await fetch(`${BASE_URL}/atletas/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Error al eliminar atleta");
        return true;
    },

    getVoluntarios: async () => {
        const res = await fetch(`${BASE_URL}/voluntarios`);
        if (!res.ok) throw new Error("Error al obtener voluntarios");
        return res.json();
    },

    deleteVoluntario: async (id) => {
        const res = await fetch(`${BASE_URL}/voluntarios/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Error al eliminar voluntario");
        return true;
    },

    getEntrenadores: async () => {
        const res = await fetch(`${BASE_URL}/entrenadores`);
        if (!res.ok) throw new Error("Error al obtener entrenadores");
        return res.json();
    },

    deleteEntrenador: async (id) => {
        const res = await fetch(`${BASE_URL}/entrenadores/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Error al eliminar entrenador");
        return true;
    },

    getTutores: async () => {
        const res = await fetch(`${BASE_URL}/tutores`);
        if (!res.ok) throw new Error("Error al obtener tutores");
        return res.json();
    },

    deleteTutor: async (id) => {
        const res = await fetch(`${BASE_URL}/tutores/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Error al eliminar tutor");
        return true;
    },

    // Consultas
    getConsultas: async () => {
        const res = await fetch(`${BASE_URL}/consultas`);
        if (!res.ok) throw new Error("Error al obtener consultas");
        return res.json();
    },

    deleteConsulta: async (id) => {
        const res = await fetch(`${BASE_URL}/consultas/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Error al eliminar consulta");
        return true;
    },

    // Actividad del Sistema
    getActivities: async () => {
        const res = await fetch(`${BASE_URL}/actividad_sistema`);
        if (!res.ok) throw new Error("Error al obtener actividades");
        return res.json();
    },

    getProfile: async (id = 1) => {
        const res = await fetch(`${BASE_URL}/Admin/${id}`);
        if (!res.ok) throw new Error("Error al obtener perfil");
        return res.json();
    },

    updateProfile: async (id, data) => {
        const res = await fetch(`${BASE_URL}/Admin/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Error al actualizar perfil");
        return res.json();
    },

    getSettings: async () => {
        const res = await fetch(`${BASE_URL}/system_settings`);
        if (!res.ok) throw new Error("Error al obtener configuraciones");
        return res.json();
    },

    updateSettings: async (data) => {
        const res = await fetch(`${BASE_URL}/system_settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Error al actualizar configuraciones");
        return res.json();
    },

    getUsers: async () => {
        const res = await fetch(`${BASE_URL}/usuarios`);
        if (!res.ok) throw new Error("Error al obtener usuarios");
        return res.json();
    },

    deleteUser: async (id) => {
        const res = await fetch(`${BASE_URL}/usuarios/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error("Error al eliminar usuario");
        return true;
    },

    saveUser: async (data, id = null) => {
        const method = id ? 'PATCH' : 'POST';
        const url = id ? `${BASE_URL}/usuarios/${id}` : `${BASE_URL}/usuarios`;
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Error al guardar usuario");
        return res.json();
    },

    logActivity: async (title, details, icon = "fa-solid fa-circle-info", iconColor = "blue") => {
        const activity = {
            title,
            details,
            icon,
            iconColor,
            time: "Hace un momento"
        };
        await fetch(`${BASE_URL}/actividad_sistema`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(activity)
        });
    },

    // Gráficos
    getCharts: async () => {
        const res = await fetch(`${BASE_URL}/graficos`);
        if (!res.ok) throw new Error("Error al obtener gráficos");
        return res.json();
    },

    // Estadísticas
    getStats: async () => {
        const [atletas, pendientes, volunt, entren, tutor] = await Promise.all([
            fetch(`${BASE_URL}/atletas`).then(r => r.json()).catch(() => []),
            fetch(`${BASE_URL}/registros_pendientes`).then(r => r.json()).catch(() => []),
            fetch(`${BASE_URL}/voluntarios`).then(r => r.json()).catch(() => []),
            fetch(`${BASE_URL}/entrenadores`).then(r => r.json()).catch(() => []),
            fetch(`${BASE_URL}/tutores`).then(r => r.json()).catch(() => [])
        ]);

        const totalActivos = atletas.length + volunt.length + entren.length + tutor.length;

        return {
            totalRegistros: { valor: totalActivos + pendientes.length, porcentaje: "+12%", tendencia: "up" },
            atletasActivos: { valor: atletas.length, porcentaje: "+5%", tendencia: "up" },
            revisionesPendientes: { valor: pendientes.length, textoExtra: "Requieren acción" },
            voluntarios: { valor: volunt.length, porcentaje: "0%", tendencia: "none" }
        };
    },

    // Competiciones
    getCompeticiones: async () => {
        const res = await fetch(`${BASE_URL}/competiciones`);
        if (!res.ok) throw new Error("Error al obtener competiciones");
        return res.json();
    },

    saveCompeticion: async (data, id = null) => {
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
        return res.json();
    },

    deleteCompeticion: async (id) => {
        const res = await fetch(`${BASE_URL}/competiciones/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Error al eliminar competición");
        return true;
    }
};
