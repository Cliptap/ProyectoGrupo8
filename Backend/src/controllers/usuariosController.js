import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

export const obtenerUsuarios = async (req, res) => {
  try {
    const { rol, activo } = req.query;
    const where = {};
    if (rol) where.rol = rol;
    if (activo !== undefined) where.activo = activo === 'true';
    const usuarios = await prisma.usuario.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { nombre: 'asc' },
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const crearUsuario = async (req, res) => {
  try {
    const { email, password, nombre, rol } = req.body;

    // Validaciones
    if (!email || !password || !nombre || !rol) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Verificar si el email ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Crear usuario
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        rol,
        activo: true,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, rol } = req.body;

    // Validaciones
    if (!nombre || !rol) {
      return res.status(400).json({ error: 'Nombre y rol son requeridos' });
    }

    // Verificar que el usuario existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
    });

    if (!usuarioExistente) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar usuario
    const usuarioActualizado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        rol,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(usuarioActualizado);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
  
};

export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioActual = req.usuario; // Del middleware de autenticación

    // Verificar que el usuario actual sea de RRHH
    if (usuarioActual.rol !== 'rrhh') {
      return res.status(403).json({ 
        error: 'Solo usuarios de RRHH pueden eliminar trabajadores' 
      });
    }

    // Verificar que el usuario a eliminar existe
    const usuarioAEliminar = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
    });

    if (!usuarioAEliminar) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Validar que no se pueda eliminar a otro usuario de RRHH
    if (usuarioAEliminar.rol === 'rrhh') {
      return res.status(403).json({ 
        error: 'No puedes eliminar a otros usuarios de RRHH' 
      });
    }

    // Eliminar usuario
    await prisma.usuario.delete({
      where: { id: parseInt(id) },
    });

    res.json({ 
      message: 'Usuario eliminado exitosamente',
      id: parseInt(id)
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }

};

export const obtenerPerfil = async (req, res) => {
  try {
    const usuarioActual = req.usuario; // Del middleware de autenticación

    const perfil = await prisma.usuario.findUnique({
      where: { id: usuarioActual.id },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!perfil) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(perfil);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const actualizarPerfil = async (req, res) => {
  try {
    const usuarioActual = req.usuario; // Del middleware de autenticación
    const { nombre, email } = req.body;

    // Validaciones
    if (!nombre || !email) {
      return res.status(400).json({ error: 'Nombre y email son requeridos' });
    }

    // Validar formato de email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Verificar si el nuevo email ya está en uso por otro usuario
    if (email !== usuarioActual.email) {
      const emailExistente = await prisma.usuario.findUnique({
        where: { email },
      });

      if (emailExistente) {
        return res.status(400).json({ error: 'El email ya está en uso por otro usuario' });
      }
    }

    // Actualizar perfil
    const perfilActualizado = await prisma.usuario.update({
      where: { id: usuarioActual.id },
      data: {
        nombre,
        email,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(perfilActualizado);
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const cambiarContrasena = async (req, res) => {
  try {
    const usuarioActual = req.usuario; // Del middleware de autenticación
    const { contrasenaActual, contrasenaNueva } = req.body;

    // Validaciones
    if (!contrasenaActual || !contrasenaNueva) {
      return res.status(400).json({ error: 'Contraseña actual y nueva son requeridas' });
    }

    if (contrasenaNueva.length < 6) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    // Obtener usuario con contraseña
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioActual.id },
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual
    const contrasenaValida = await bcryptjs.compare(contrasenaActual, usuario.password);
    
    if (!contrasenaValida) {
      return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcryptjs.hash(contrasenaNueva, 10);

    // Actualizar contraseña
    await prisma.usuario.update({
      where: { id: usuarioActual.id },
      data: {
        password: hashedPassword,
      },
    });

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const obtenerConductores = async (req, res) => {
  try {
    const conductores = await prisma.usuario.findMany({
      where: { 
        rol: 'conductor',
        activo: true,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
      },
      orderBy: { nombre: 'asc' },
    });

    res.json(conductores);
  } catch (error) {
    console.error('Error al obtener conductores:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};