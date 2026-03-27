const API_BASE_URL = "http://localhost:3001";

export const getConfig = async (key) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${key}`);
        if (!response.ok) throw new Error(`Error al obtener ${key}`);
        return await response.json();
    } catch (error) {
        console.error(`Error en getConfig(${key}):`, error);
        return [];
    }
};

export const getFullConfig = async () => {
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
