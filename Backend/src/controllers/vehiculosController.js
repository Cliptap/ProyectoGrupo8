import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerVehiculos = async (req, res) => {
  try {
    const { estado } = req.query;
    const where = estado ? { estado } : {};

    const vehiculos = await prisma.vehiculo.findMany({
      where,
      include: {
        sensores: { orderBy: { timestamp: 'desc' }, take: 5 },
        camaras: true,
        rutas: {
          where: { estadoRuta: { in: ['planificada', 'en_curso'] } },
          include: { carga: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(vehiculos);
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const obtenerVehiculoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const vehiculo = await prisma.vehiculo.findUnique({
      where: { id: parseInt(id) },
      include: {
        sensores: { orderBy: { timestamp: 'desc' } },
        camaras: true,
        rutas: {
          include: {
            carga: true,
            conductor: { select: { id: true, nombre: true, email: true } },
          },
        },
      },
    });

    if (!vehiculo) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    res.json(vehiculo);
  } catch (error) {
    console.error('Error al obtener vehículo:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const crearVehiculo = async (req, res) => {
  try {
    const { patente, marca, modelo, capacidadCarga } = req.body;

    if (!patente || !marca || !modelo || !capacidadCarga) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const vehiculoExistente = await prisma.vehiculo.findUnique({
      where: { patente },
    });

    if (vehiculoExistente) {
      return res.status(409).json({ error: 'La patente ya está registrada' });
    }

    const nuevoVehiculo = await prisma.vehiculo.create({
      data: { patente, marca, modelo, capacidadCarga: parseFloat(capacidadCarga) },
    });

    res.status(201).json(nuevoVehiculo);
  } catch (error) {
    console.error('Error al crear vehículo:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const actualizarVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const { patente, marca, modelo, capacidadCarga, estado, ubicacionActualLat, ubicacionActualLng } = req.body;

    const vehiculoActualizado = await prisma.vehiculo.update({
      where: { id: parseInt(id) },
      data: {
        ...(patente && { patente }),
        ...(marca && { marca }),
        ...(modelo && { modelo }),
        ...(capacidadCarga && { capacidadCarga: parseFloat(capacidadCarga) }),
        ...(estado && { estado }),
        ...(ubicacionActualLat !== undefined && { ubicacionActualLat: parseFloat(ubicacionActualLat) }),
        ...(ubicacionActualLng !== undefined && { ubicacionActualLng: parseFloat(ubicacionActualLng) }),
      },
    });

    res.json(vehiculoActualizado);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }
    console.error('Error al actualizar vehículo:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const eliminarVehiculo = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.vehiculo.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Vehículo eliminado exitosamente' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }
    console.error('Error al eliminar vehículo:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
