import apiClient from '../config/api';

const rutasService = {
  /**
   * Obtener todas las rutas
   */
  obtenerTodos: async (estadoRuta = null) => {
    try {
      const params = estadoRuta ? { estadoRuta } : {};
      const response = await apiClient.get('/rutas', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener rutas';
    }
  },

  /**
   * Obtener ruta por ID
   */
  obtenerPorId: async (id) => {
    try {
      const response = await apiClient.get(`/rutas/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener ruta';
    }
  },

  /**
   * Crear ruta
   */
  crear: async (rutaData) => {
    try {
      const response = await apiClient.post('/rutas', rutaData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al crear ruta';
    }
  },

  /**
   * Actualizar ruta
   */
  actualizar: async (id, datos) => {
    try {
      const response = await apiClient.put(`/rutas/${id}`, datos);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al actualizar ruta';
    }
  },

  /**
   * Eliminar ruta
   */
  eliminar: async (id) => {
    try {
      const response = await apiClient.delete(`/rutas/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al eliminar ruta';
    }
  },

  /**
   * Iniciar ruta
   */
  iniciar: async (id) => {
    try {
      const response = await apiClient.put(`/rutas/${id}`, {
        estadoRuta: 'en_curso',
        fechaInicio: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al iniciar ruta';
    }
  },

  /**
   * Completar ruta
   */
  completar: async (id) => {
    try {
      const response = await apiClient.put(`/rutas/${id}`, {
        estadoRuta: 'completada',
        fechaFin: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al completar ruta';
    }
  },
};

export default rutasService;
