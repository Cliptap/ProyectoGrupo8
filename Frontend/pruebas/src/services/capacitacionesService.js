import api from '../config/api';

// ============ CRUD BÁSICO ============

export const obtenerCapacitaciones = async () => {
  try {
    const response = await api.get('/capacitaciones');
    return response.data;
  } catch (error) {
    console.error('Error al obtener capacitaciones:', error);
    throw error;
  }
};

export const obtenerCapacitacionesPorTrabajador = async (usuarioId) => {
  try {
    const response = await api.get(`/capacitaciones/trabajador/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener capacitaciones del trabajador:', error);
    throw error;
  }
};

export const crearCapacitacion = async (datos) => {
  try {
    const response = await api.post('/capacitaciones', datos);
    return response.data;
  } catch (error) {
    console.error('Error al crear capacitación:', error);
    throw error;
  }
};

export const actualizarCapacitacion = async (id, datos) => {
  try {
    const response = await api.put(`/capacitaciones/${id}`, datos);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar capacitación:', error);
    throw error;
  }
};

export const eliminarCapacitacion = async (id) => {
  try {
    const response = await api.delete(`/capacitaciones/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar capacitación:', error);
    throw error;
  }
};

// ============ FILTROS Y ANÁLISIS ============

export const obtenerTrabajadoresSinCapacitaciones = async () => {
  try {
    const response = await api.get('/capacitaciones/filtros/sin-capacitaciones');
    return response.data;
  } catch (error) {
    console.error('Error al obtener trabajadores sin capacitaciones:', error);
    throw error;
  }
};

export const obtenerEstadisticasCapacitaciones = async () => {
  try {
    const response = await api.get('/capacitaciones/estadisticas/por-categoria');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};

export const obtenerCapacitacionesPorFiltros = async (filtros) => {
  try {
    const params = new URLSearchParams();
    if (filtros.usuarioId) params.append('usuarioId', filtros.usuarioId);
    if (filtros.categoria) params.append('categoria', filtros.categoria);
    if (filtros.desde) params.append('desde', filtros.desde);
    if (filtros.hasta) params.append('hasta', filtros.hasta);

    const response = await api.get(`/capacitaciones/filtros/buscar?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error al filtrar capacitaciones:', error);
    throw error;
  }
};

export default {
  obtenerCapacitaciones,
  obtenerCapacitacionesPorTrabajador,
  crearCapacitacion,
  actualizarCapacitacion,
  eliminarCapacitacion,
  obtenerTrabajadoresSinCapacitaciones,
  obtenerEstadisticasCapacitaciones,
  obtenerCapacitacionesPorFiltros
};
