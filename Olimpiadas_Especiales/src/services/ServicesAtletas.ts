import apiClient from '../api/apiClient';
import type { Atleta } from '../types';

/* [verde] Servicio encargado de centralizar todas las peticiones relacionadas con Atletas */
export const ServicesAtletas = {

  /* [verde] Obtener lista de todos los atletas con su información de salud */
  /* Endpoint: GET /api/atletas */
  obtenerAtletas: async (): Promise<Atleta[]> => {
    try {
      const response = await apiClient.get<{ data: Atleta[] }>('/atletas');
      return response.data.data;
    } catch (error) {
      console.error("Error en obtenerAtletas:", error);
      throw error;
    }
  },

  /* [verde] Registrar un nuevo atleta en el sistema */
  /* Endpoint: POST /api/atletas */
  registrarAtleta: async (atleta: Partial<Atleta>): Promise<Atleta> => {
    try {
      const response = await apiClient.post<{ data: Atleta }>('/atletas', atleta);
      return response.data.data;
    } catch (error) {
      console.error("Error en registrarAtleta:", error);
      throw error;
    }
  },

  /* [verde] Actualizar condiciones médicas y estado de salud general */
  /* Endpoint: PUT /api/atletas/:id */
  actualizarEstadoSalud: async (id: number, datosSalud: Partial<Atleta>): Promise<Atleta> => {
    try {
      const response = await apiClient.put<{ data: Atleta }>(`/atletas/${id}`, datosSalud);
      return response.data.data;
    } catch (error) {
      console.error("Error en actualizarEstadoSalud:", error);
      throw error;
    }
  },

  subirDocumentosAtleta: async (id: number, formData: FormData): Promise<void> => {
    try {
      await apiClient.post(`/atletas/${id}/documentos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error("Error en subirDocumentosAtleta:", error);
      throw error;
    }
  }
};

// Funciones individuales para compatibilidad con componentes antiguos
export const getAtletaById = async (id: string | number): Promise<Atleta> => {
  try {
    const response = await apiClient.get<{ data: Atleta }>(`/atletas/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error en getAtletaById:", error);
    throw error;
  }
};

export const updateAtleta = async (id: string | number, atleta: Partial<Atleta>): Promise<Atleta> => {
  try {
    const response = await apiClient.put<{ data: Atleta }>(`/atletas/${id}`, atleta);
    return response.data.data;
  } catch (error) {
    console.error("Error en updateAtleta:", error);
    throw error;
  }
};
