import apiClient from '../config/api';

const reportesService = {
  /**
   * Obtener rutas en un rango de fechas
   */
  obtenerRutasPorFechas: async (fechaInicio, fechaFin, filtros = {}) => {
    try {
      const response = await apiClient.get('/reportes/rutas', {
        params: {
          fechaInicio,
          fechaFin,
          ...filtros,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener rutas para el reporte';
    }
  },

  /**
   * Obtener cargas en un rango de fechas
   */
  obtenerCargasPorFechas: async (fechaInicio, fechaFin, filtros = {}) => {
    try {
      const response = await apiClient.get('/reportes/cargas', {
        params: {
          fechaInicio,
          fechaFin,
          ...filtros,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener cargas para el reporte';
    }
  },

  /**
   * Obtener vehículos en un rango de fechas
   */
  obtenerVehiculosPorFechas: async (fechaInicio, fechaFin, filtros = {}) => {
    try {
      const response = await apiClient.get('/reportes/vehiculos', {
        params: {
          fechaInicio,
          fechaFin,
          ...filtros,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener vehículos para el reporte';
    }
  },

  /**
   * Obtener usuarios en un rango de fechas
   */
  obtenerUsuariosPorFechas: async (fechaInicio, fechaFin, filtros = {}) => {
    try {
      const response = await apiClient.get('/reportes/usuarios', {
        params: {
          fechaInicio,
          fechaFin,
          ...filtros,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener usuarios para el reporte';
    }
  },

  /**
   * Obtener reporte consolidado
   */
  obtenerReporteConsolidado: async (fechaInicio, fechaFin, tiposReporte = []) => {
    try {
      const response = await apiClient.get('/reportes/consolidado', {
        params: {
          fechaInicio,
          fechaFin,
          tipos: tiposReporte.join(','),
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener reporte consolidado';
    }
  },
};

export default reportesService;
