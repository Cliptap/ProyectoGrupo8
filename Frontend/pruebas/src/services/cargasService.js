import apiClient from '../config/api';

const cargasService = {
  /**
   * Obtener todas las cargas
   */
  obtenerTodos: async (filtros = {}) => {
    try {
      const response = await apiClient.get('/cargas', { params: filtros });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener cargas';
    }
  },

  /**
   * Obtener carga por ID
   */
  obtenerPorId: async (id) => {
    try {
      const response = await apiClient.get(`/cargas/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener carga';
    }
  },

  /**
   * Crear carga
   */
  crear: async (cargaData) => {
    try {
      const response = await apiClient.post('/cargas', cargaData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al crear carga';
    }
  },

  /**
   * Actualizar carga
   */
  actualizar: async (id, cargaData) => {
    try {
      const response = await apiClient.put(`/cargas/${id}`, cargaData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al actualizar carga';
    }
  },

  /**
   * Eliminar carga
   */
  eliminar: async (id) => {
    try {
      const response = await apiClient.delete(`/cargas/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al eliminar carga';
    }
  },
};

export default cargasService;
