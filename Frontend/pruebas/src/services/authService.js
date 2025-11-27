import apiClient, { setToken, setUsuario, removeToken, removeUsuario } from '../config/api';

const authService = {
  /**
   * Iniciar sesiÃ³n
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, usuario } = response.data;
      
      // Guardar token y usuario
      setToken(token);
      setUsuario(usuario);
      
      console.log('âœ… SCRUM-77: Token guardado en localStorage');
      console.log('í³¦ Token:', localStorage.getItem('token') ? 'Guardado correctamente' : 'ERROR');
      console.log('í±¤ Usuario:', localStorage.getItem('usuario') ? 'Guardado correctamente' : 'ERROR');
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al iniciar sesiÃ³n';
    }
  },

  /**
   * Registrar nuevo usuario
   */
  registro: async (userData) => {
    try {
      const response = await apiClient.post('/auth/registro', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al registrar usuario';
    }
  },

  /**
   * Obtener perfil del usuario
   */
  obtenerPerfil: async () => {
    try {
      const response = await apiClient.get('/auth/perfil');
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener perfil';
    }
  },

  /**
   * Cerrar sesiÃ³n
   */
  logout: () => {
    removeToken();
    removeUsuario();
    window.location.href = '/';
  },
};

export default authService;
