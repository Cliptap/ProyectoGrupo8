import apiClient from '../config/api';

const dashboardService = {
  /**
   * Obtener estadísticas generales del dashboard
   */
  obtenerEstadisticas: async () => {
    try {
      const response = await apiClient.get('/dashboard/estadisticas');
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener estadísticas';
    }
  },

  /**
   * Obtener rutas activas (planificadas o en curso)
   */
  obtenerRutasActivas: async () => {
    try {
      const response = await apiClient.get('/dashboard/rutas-activas');
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener rutas activas';
    }
  },

  /**
   * Obtener actividad reciente
   */
  obtenerActividadReciente: async () => {
    try {
      const response = await apiClient.get('/dashboard/actividad-reciente');
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener actividad reciente';
    }
  },
};

export default dashboardService;
