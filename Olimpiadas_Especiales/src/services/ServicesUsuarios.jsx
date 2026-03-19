const API_URL = "http://localhost:3000/usuarios";

// Obtener todos los usuarios (Read)
export const getUsuarios = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener los usuarios");
        return await response.json();
    } catch (error) {
        console.error("Error en getUsuarios:", error);
        throw error;
    }
};

// Obtener un usuario por su ID (Read)
export const getUsuarioById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Error al obtener el usuario");
        return await response.json();
    } catch (error) {
        console.error("Error en getUsuarioById:", error);
        throw error;
    }
};

// Crear un nuevo usuario (Create)
export const createUsuario = async (usuario) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(usuario),
        });
        if (!response.ok) throw new Error("Error al crear el usuario");
        return await response.json();
    } catch (error) {
        console.error("Error en createUsuario:", error);
        throw error;
    }
};

// Actualizar un usuario existente (Update)
export const updateUsuario = async (id, usuario) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(usuario),
        });
        if (!response.ok) throw new Error("Error al actualizar el usuario");
        return await response.json();
    } catch (error) {
        console.error("Error en updateUsuario:", error);
        throw error;
    }
};

// Eliminar un usuario (Delete)
export const deleteUsuario = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Error al eliminar el usuario");
        return await response.json();
    } catch (error) {
        console.error("Error en deleteUsuario:", error);
        throw error;
    }
};
