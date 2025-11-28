import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerCargas = async (req, res) => {
  try {
    const { estado, prioridad } = req.query;

    const where = {};
    if (estado) where.estado = estado;
    if (prioridad) where.prioridad = prioridad;

    const cargas = await prisma.carga.findMany({
      where,
      include: {
        rutas: {
          include: {
            vehiculo: { select: { patente: true, marca: true, modelo: true } },
            conductor: { select: { nombre: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(cargas);
  } catch (error) {
    console.error('Error al obtener cargas:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const obtenerCargaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const carga = await prisma.carga.findUnique({
      where: { id: parseInt(id) },
      include: {
        rutas: {
          include: {
            vehiculo: true,
            conductor: { select: { id: true, nombre: true, email: true } },
          },
        },
      },
    });

    if (!carga) {
      return res.status(404).json({ error: 'Carga no encontrada' });
    }

    res.json(carga);
  } catch (error) {
    console.error('Error al obtener carga:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const crearCarga = async (req, res) => {
  try {
    const { descripcion, peso, tipo, prioridad, origen, destino } = req.body;

    if (!descripcion || !peso || !tipo || !origen || !destino) {
      return res.status(400).json({ error: 'Campos requeridos: descripcion, peso, tipo, origen, destino' });
    }

    const tiposValidos = ['fragil', 'peligrosa', 'normal', 'refrigerada'];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({ error: `Tipo debe ser: ${tiposValidos.join(', ')}` });
    }

    const nuevaCarga = await prisma.carga.create({
      data: {
        descripcion,
        peso: parseFloat(peso),
        tipo,
        prioridad: prioridad || 'media',
        origen,
        destino,
      },
    });

    res.status(201).json(nuevaCarga);
  } catch (error) {
    console.error('Error al crear carga:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const actualizarCarga = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, peso, tipo, prioridad, estado, origen, destino } = req.body;

    const cargaActualizada = await prisma.carga.update({
      where: { id: parseInt(id) },
      data: {
        ...(descripcion && { descripcion }),
        ...(peso && { peso: parseFloat(peso) }),
        ...(tipo && { tipo }),
        ...(prioridad && { prioridad }),
        ...(estado && { estado }),
        ...(origen && { origen }),
        ...(destino && { destino }),
      },
    });

    res.json(cargaActualizada);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Carga no encontrada' });
    }
    console.error('Error al actualizar carga:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const eliminarCarga = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.carga.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Carga eliminada exitosamente' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Carga no encontrada' });
    }
    console.error('Error al eliminar carga:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

