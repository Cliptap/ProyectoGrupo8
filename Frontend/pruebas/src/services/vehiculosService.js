import apiClient from '../config/api';

const vehiculosService = {
  /**
   * Obtener todos los vehículos
   */
  obtenerTodos: async (estado = null) => {
    try {
      const params = estado ? { estado } : {};
      const response = await apiClient.get('/vehiculos', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener vehículos';
    }
  },

  /**
   * Obtener vehículo por ID
   */
  obtenerPorId: async (id) => {
    try {
      const response = await apiClient.get(`/vehiculos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener vehículo';
    }
  },

  /**
   * Crear vehículo
   */
  crear: async (vehiculoData) => {
    try {
      const response = await apiClient.post('/vehiculos', vehiculoData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al crear vehículo';
    }
  },

  /**
   * Actualizar vehículo
   */
  actualizar: async (id, vehiculoData) => {
    try {
      const response = await apiClient.put(`/vehiculos/${id}`, vehiculoData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al actualizar vehículo';
    }
  },

  /**
   * Eliminar vehículo
   */
  eliminar: async (id) => {
    try {
      const response = await apiClient.delete(`/vehiculos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al eliminar vehículo';
    }
  },
};

export default vehiculosService;
