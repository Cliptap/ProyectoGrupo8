import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============ CRUD CAPACITACIONES ============

// Obtener todas las capacitaciones
export const obtenerCapacitaciones = async (req, res) => {
  try {
    const capacitaciones = await prisma.capacitacion.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: capacitaciones
    });
  } catch (error) {
    console.error('Error al obtener capacitaciones:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener capacitaciones'
    });
  }
};

// Obtener capacitaciones de un trabajador específico
export const obtenerCapacitacionesPorTrabajador = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const capacitaciones = await prisma.capacitacion.findMany({
      where: { usuarioId: parseInt(usuarioId) },
      orderBy: { fechaCapacitacion: 'desc' }
    });

    res.json({
      success: true,
      data: capacitaciones
    });
  } catch (error) {
    console.error('Error al obtener capacitaciones del trabajador:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener capacitaciones'
    });
  }
};

// Crear capacitación
export const crearCapacitacion = async (req, res) => {
  try {
    const { usuarioId, tema, fechaCapacitacion, categoria, institucion, certificacion, duracionHoras, calificacion, notas } = req.body;

    // Validar que el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(usuarioId) }
    });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    const capacitacion = await prisma.capacitacion.create({
      data: {
        usuarioId: parseInt(usuarioId),
        tema,
        fechaCapacitacion: new Date(fechaCapacitacion),
        categoria: categoria || 'general',
        institucion: institucion || null,
        certificacion: certificacion || 'no_aplica',
        estado: 'completada',
        duracionHoras: duracionHoras ? parseInt(duracionHoras) : null,
        calificacion: calificacion ? parseFloat(calificacion) : null,
        notas: notas || null
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: capacitacion,
      message: 'Capacitación registrada exitosamente'
    });
  } catch (error) {
    console.error('Error al crear capacitación:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear capacitación'
    });
  }
};

// Actualizar capacitación
export const actualizarCapacitacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { tema, fechaCapacitacion, categoria, institucion, certificacion, duracionHoras, calificacion, notas } = req.body;

    // Validar que la capacitación existe
    const capacitacion = await prisma.capacitacion.findUnique({
      where: { id: parseInt(id) }
    });

    if (!capacitacion) {
      return res.status(404).json({
        success: false,
        error: 'Capacitación no encontrada'
      });
    }

    const actualizada = await prisma.capacitacion.update({
      where: { id: parseInt(id) },
      data: {
        tema: tema || capacitacion.tema,
        fechaCapacitacion: fechaCapacitacion ? new Date(fechaCapacitacion) : capacitacion.fechaCapacitacion,
        categoria: categoria || capacitacion.categoria,
        institucion: institucion !== undefined ? institucion : capacitacion.institucion,
        certificacion: certificacion || capacitacion.certificacion,
        duracionHoras: duracionHoras ? parseInt(duracionHoras) : capacitacion.duracionHoras,
        calificacion: calificacion ? parseFloat(calificacion) : capacitacion.calificacion,
        notas: notas !== undefined ? notas : capacitacion.notas
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: actualizada,
      message: 'Capacitación actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar capacitación:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar capacitación'
    });
  }
};

// Eliminar capacitación
export const eliminarCapacitacion = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que la capacitación existe
    const capacitacion = await prisma.capacitacion.findUnique({
      where: { id: parseInt(id) }
    });

    if (!capacitacion) {
      return res.status(404).json({
        success: false,
        error: 'Capacitación no encontrada'
      });
    }

    await prisma.capacitacion.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Capacitación eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar capacitación:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar capacitación'
    });
  }
};

// ============ ANÁLISIS Y FILTROS ============

// Obtener trabajadores sin capacitaciones en el último año
export const obtenerTrabajadoresSinCapacitaciones = async (req, res) => {
  try {
    const hace12Meses = new Date();
    hace12Meses.setFullYear(hace12Meses.getFullYear() - 1);

    // Obtener todos los trabajadores
    const todosTrabajadores = await prisma.usuario.findMany({
      where: { rol: 'trabajador' },
      select: {
        id: true,
        nombre: true,
        email: true,
        capacitaciones: {
          where: {
            fechaCapacitacion: {
              gte: hace12Meses
            }
          }
        }
      }
    });

    // Filtrar trabajadores sin capacitaciones en el último año
    const sinCapacitaciones = todosTrabajadores.filter(t => t.capacitaciones.length === 0);

    res.json({
      success: true,
      data: sinCapacitaciones,
      total: sinCapacitaciones.length
    });
  } catch (error) {
    console.error('Error al obtener trabajadores sin capacitaciones:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener trabajadores sin capacitaciones'
    });
  }
};

// Obtener estadísticas de capacitación por categoría
export const obtenerEstadisticasCapacitaciones = async (req, res) => {
  try {
    const estadisticas = await prisma.capacitacion.groupBy({
      by: ['categoria'],
      _count: {
        id: true
      },
      _avg: {
        calificacion: true
      }
    });

    res.json({
      success: true,
      data: estadisticas
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas'
    });
  }
};

// Obtener capacitaciones por categoría y usuario
export const obtenerCapacitacionesPorFiltros = async (req, res) => {
  try {
    const { usuarioId, categoria, desde, hasta } = req.query;

    let where = {};

    if (usuarioId) {
      where.usuarioId = parseInt(usuarioId);
    }

    if (categoria) {
      where.categoria = categoria;
    }

    if (desde || hasta) {
      where.fechaCapacitacion = {};
      if (desde) {
        where.fechaCapacitacion.gte = new Date(desde);
      }
      if (hasta) {
        where.fechaCapacitacion.lte = new Date(hasta);
      }
    }

    const capacitaciones = await prisma.capacitacion.findMany({
      where,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        }
      },
      orderBy: { fechaCapacitacion: 'desc' }
    });

    res.json({
      success: true,
      data: capacitaciones
    });
  } catch (error) {
    console.error('Error al filtrar capacitaciones:', error);
    res.status(500).json({
      success: false,
      error: 'Error al filtrar capacitaciones'
    });
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
