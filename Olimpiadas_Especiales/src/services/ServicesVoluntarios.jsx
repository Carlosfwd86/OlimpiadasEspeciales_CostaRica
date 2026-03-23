const API_URL = "http://localhost:3000/voluntarios";

// Obtener todos los voluntarios (Read)
export const getVoluntarios = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener los voluntarios");
        return await response.json();
    } catch (error) {
        console.error("Error en getVoluntarios:", error);
        throw error;
    }
};

// Obtener un voluntario por su ID (Read)
export const getVoluntarioById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Error al obtener el voluntario");
        return await response.json();
    } catch (error) {
        console.error("Error en getVoluntarioById:", error);
        throw error;
    }
};

// Crear un nuevo voluntario (Create)
export const createVoluntario = async (voluntario) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(voluntario),
        });
        if (!response.ok) throw new Error("Error al crear el voluntario");
        return await response.json();
    } catch (error) {
        console.error("Error en createVoluntario:", error);
        throw error;
    }
};

// Actualizar un voluntario existente (Update)
export const updateVoluntario = async (id, voluntario) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(voluntario),
        });
        if (!response.ok) throw new Error("Error al actualizar el voluntario");
        return await response.json();
    } catch (error) {
        console.error("Error en updateVoluntario:", error);
        throw error;
    }
};

// Eliminar un voluntario (Delete)
export const deleteVoluntario = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Error al eliminar el voluntario");
        return await response.json();
    } catch (error) {
        console.error("Error en deleteVoluntario:", error);
        throw error;
    }
};
