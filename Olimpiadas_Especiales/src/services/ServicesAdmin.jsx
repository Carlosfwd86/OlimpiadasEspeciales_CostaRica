const BASE_URL = "http://localhost:3001";

export const ServicesAdmin = {
    // Registros Pendientes
    getRegistrations: async () => {
        const res = await fetch(`${BASE_URL}/registros_pendientes`);
        if (!res.ok) throw new Error("Error al obtener registros");
        return res.json();
    },

    saveRegistro: async (data, id = null) => {
        const method = id ? 'PATCH' : 'POST';
        const url = id ? `${BASE_URL}/registros_pendientes/${id}` : `${BASE_URL}/registros_pendientes`;
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

    // Lógica de Aprobación (Mover a Atletas)
    aprobarRegistro: async (registro) => {
        // Mapear campos de Pendientes a Atletas oficiales
        const atletaData = {
            nombre: registro.name,
            correoElectronico: registro.email,
            telefono: registro.phone,
            disciplina: registro.sport,
            programa: registro.region,
            status: 'ACTIVO',
            rol: 'atleta',
            fechaRegistro: new Date().toISOString()
        };
        
        const resAtleta = await fetch(`${BASE_URL}/atletas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(atletaData)
        });
        if (!resAtleta.ok) throw new Error("Error al crear atleta oficial");

        // 2. Eliminar de pendientes
        await fetch(`${BASE_URL}/registros_pendientes/${registro.id}`, { method: 'DELETE' });
        
        return true;
    },

    // Atletas Oficiales
    getAtletas: async () => {
        const res = await fetch(`${BASE_URL}/atletas`);
        if (!res.ok) throw new Error("Error al obtener atletas");
        return res.json();
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
            method: 'PUT',
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
        const res = await fetch(`${BASE_URL}/usuarios_sistema`);
        if (!res.ok) throw new Error("Error al obtener usuarios");
        return res.json();
    },

    deleteUser: async (id) => {
        const res = await fetch(`${BASE_URL}/usuarios_sistema/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error("Error al eliminar usuario");
        return true;
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
        const [atletas, pendientes, volunt] = await Promise.all([
            fetch(`${BASE_URL}/atletas`).then(r => r.json()),
            fetch(`${BASE_URL}/registros_pendientes`).then(r => r.json()),
            fetch(`${BASE_URL}/voluntarios`).then(r => r.json())
        ]);

        return {
            totalRegistros: { valor: atletas.length + pendientes.length, porcentaje: "+12%", tendencia: "up" },
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
