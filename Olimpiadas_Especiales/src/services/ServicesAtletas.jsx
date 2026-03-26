const API_URL = "http://localhost:3001/atletas";

// Obtener todos los atletas (Read)
export const getAtletas = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener los atletas");
        return await response.json();
    } catch (error) {
        console.error("Error en getAtletas:", error);
        throw error;
    }
};

// Obtener un atleta por su ID (Read)
export const getAtletaById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Error al obtener el atleta");
        return await response.json();
    } catch (error) {
        console.error("Error en getAtletaById:", error);
        throw error;
    }
};

// Crear un nuevo atleta (Create)
export const createAtleta = async (atleta) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(atleta),
        });
        if (!response.ok) throw new Error("Error al crear el atleta");
        return await response.json();
    } catch (error) {
        console.error("Error en createAtleta:", error);
        throw error;
    }
};

// Actualizar un atleta existente (Update)
export const updateAtleta = async (id, atleta) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(atleta),
        });
        if (!response.ok) throw new Error("Error al actualizar el atleta");
        return await response.json();
    } catch (error) {
        console.error("Error en updateAtleta:", error);
        throw error;
    }
};

// Eliminar un atleta (Delete)
export const deleteAtleta = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Error al eliminar el atleta");
        return await response.json();
    } catch (error) {
        console.error("Error en deleteAtleta:", error);
        throw error;
    }
};
