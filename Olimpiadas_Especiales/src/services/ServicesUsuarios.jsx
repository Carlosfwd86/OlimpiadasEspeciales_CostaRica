const API_URL = "http://localhost:3001/usuarios";

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

export const createUsuario = async (usuario) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...usuario,
                rol: 'usuario',
                fechaRegistro: new Date().toISOString()
            }),
        });
        if (!response.ok) throw new Error("Error al registrar el usuario");
        return await response.json();
    } catch (error) {
        console.error("Error en createUsuario:", error);
        throw error;
    }
};

export const updateUsuario = async (id, usuario) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PATCH",
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
