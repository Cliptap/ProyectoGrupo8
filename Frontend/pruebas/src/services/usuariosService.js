import apiClient from '../config/api';

const usuariosService = {
  /**
   * Obtener todos los usuarios
   * @param {string} rol - Filtro opcional por rol
   * @param {boolean} activo - Filtro opcional por estado activo
   */
  obtenerTodos: async (rol = null, activo = null) => {
    try {
      const params = {};
      if (rol) params.rol = rol;
      if (activo !== null) params.activo = activo;
      
      const response = await apiClient.get('/usuarios', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener usuarios';
    }
  },

  /**
   * Obtener solo conductores activos
   */
  obtenerConductores: async () => {
    try {
      const response = await apiClient.get('/usuarios/conductores');
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener conductores';
    }
  },

  /**
   * Crear nuevo usuario
   */
  crear: async (datosUsuario) => {
    try {
      const response = await apiClient.post('/usuarios', datosUsuario);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al crear usuario';
    }
  },

  /**
   * Actualizar usuario existente
   */
  actualizar: async (id, datosUsuario) => {
    try {
      const response = await apiClient.put(`/usuarios/${id}`, datosUsuario);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al actualizar usuario';
    }
  },

  /**
   * Eliminar usuario
   */
  eliminar: async (id) => {
    try {
      const response = await apiClient.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al eliminar usuario';
    }
  },

  /**
   * Obtener perfil del usuario actual
   */
  obtenerPerfil: async () => {
    try {
      const response = await apiClient.get('/usuarios/perfil');
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener perfil';
    }
  },

  /**
   * Actualizar perfil del usuario actual
   */
  actualizarPerfil: async (datosPerfil) => {
    try {
      const response = await apiClient.put('/usuarios/perfil', datosPerfil);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al actualizar perfil';
    }
  },

  /**
   * Cambiar contraseña del usuario actual
   */
  cambiarContrasena: async (contrasenaActual, contrasenaNueva) => {
    try {
      const response = await apiClient.put('/usuarios/perfil/contrasena', {
        contrasenaActual,
        contrasenaNueva,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al cambiar contraseña';
    }
  },
};

export default usuariosService;
