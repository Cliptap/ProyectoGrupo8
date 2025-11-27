import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dashboardController = {
  obtenerEstadisticas: async (req, res) => {
    try {
      const [
        totalVehiculos,
        totalCargas,
        totalRutas,
        totalUsuarios,
        vehiculosDisponibles,
        vehiculosEnRuta,
        cargasPendientes,
        rutasActivas,
      ] = await Promise.all([
        prisma.vehiculo.count(),
        prisma.carga.count(),
        prisma.ruta.count(),
        prisma.usuario.count(),
        prisma.vehiculo.count({ where: { estado: 'disponible' } }),
        prisma.vehiculo.count({ where: { estado: 'en_ruta' } }),
        prisma.carga.count({ where: { estado: 'pendiente' } }),
        prisma.ruta.count({ where: { estadoRuta: { in: ['planificada', 'en_curso'] } } }),
      ]);

      res.json({
        totales: {
          vehiculos: totalVehiculos,
          cargas: totalCargas,
          rutas: totalRutas,
          usuarios: totalUsuarios,
        },
        vehiculos: {
          disponibles: vehiculosDisponibles,
          enRuta: vehiculosEnRuta,
          enMantenimiento: totalVehiculos - vehiculosDisponibles - vehiculosEnRuta,
        },
        cargas: {
          pendientes: cargasPendientes,
          enTransito: await prisma.carga.count({ where: { estado: 'en_transito' } }),
          entregadas: await prisma.carga.count({ where: { estado: 'entregada' } }),
        },
        rutas: {
          activas: rutasActivas,
          completadas: await prisma.ruta.count({ where: { estadoRuta: 'completada' } }),
        },
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  },

  obtenerRutasActivas: async (req, res) => {
    try {
      const rutasActivas = await prisma.ruta.findMany({
        where: {
          estadoRuta: { in: ['planificada', 'en_curso'] },
        },
        include: {
          vehiculo: {
            select: {
              patente: true,
              marca: true,
              modelo: true,
              estado: true,
            },
          },
          carga: {
            select: {
              descripcion: true,
              peso: true,
              tipo: true,
              prioridad: true,
            },
          },
          conductor: {
            select: {
              nombre: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.json(rutasActivas);
    } catch (error) {
      console.error('Error al obtener rutas activas:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  },
};

export default dashboardController;
