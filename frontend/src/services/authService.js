import { apiClient } from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

/**
 * Servicio de autenticación
 * Maneja login, registro, logout y gestión de tokens
 */
export const authService = {
  /**
   * Inicia sesión con email y contraseña
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} Respuesta con token y datos del usuario
   */
  async login(email, password) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { 
      email, 
      password 
    });

    console.log('✅ Respuesta de login:', response);

    // ✅ CORREGIDO: El backend devuelve "token", no "access_token"
    if (response.token && response.user) {
      this.setAuthData(response.token, response.user);
      console.log('✅ Token guardado en localStorage');
    } else {
      console.error('❌ Respuesta sin token o user:', response);
    }

    return response;
  },

  /**
   * Registra un nuevo usuario
   * @param {Object} formData - Datos del formulario de registro
   * @param {string} formData.name - Nombre completo
   * @param {string} formData.email - Email
   * @param {string} formData.password - Contraseña
   * @returns {Promise<Object>} Respuesta con token y datos del usuario
   */
  async register(formData) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, formData);

    console.log('✅ Respuesta de register:', response);

    // ✅ CORREGIDO: El backend devuelve "token", no "access_token"
    if (response.token && response.user) {
      this.setAuthData(response.token, response.user);
      console.log('✅ Token guardado en localStorage');
    } else {
      console.error('❌ Respuesta sin token o user:', response);
    }

    return response;
  },

  /**
   * Cierra la sesión del usuario
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      // Intentar llamar al endpoint de logout del backend
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Continuar aunque falle el logout en el backend
      console.warn('Error al hacer logout en el backend:', error);
    } finally {
      // Siempre limpiar datos locales
      this.clearAuthData();
      console.log('✅ Datos de auth limpiados');
    }
  },

  /**
   * Obtiene los datos del usuario actual
   * @returns {Promise<Object>} Datos del usuario
   */
  async getCurrentUser() {
    return apiClient.get(API_ENDPOINTS.AUTH.ME);
  },

  /**
   * Refresca el token de autenticación
   * @param {string} refreshToken - Token de refresco
   * @returns {Promise<Object>} Nuevo access token
   */
  async refreshToken(refreshToken) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken
    });

    if (response.token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
    }

    return response;
  },

  /**
   * Guarda los datos de autenticación en localStorage
   * @param {string} token - JWT token
   * @param {Object} user - Datos del usuario
   */
  setAuthData(token, user) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    console.log('💾 Guardado en localStorage:', {
      token: token.substring(0, 20) + '...',
      user: user
    });
  },

  /**
   * Obtiene el token de autenticación guardado
   * @returns {string|null} Token o null si no existe
   */
  getAuthToken() {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  /**
   * Obtiene los datos del usuario guardados
   * @returns {Object|null} Datos del usuario o null si no existen
   */
  getUserData() {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} true si hay un token válido
   */
  isAuthenticated() {
    const token = this.getAuthToken();
    const user = this.getUserData();
    const isAuth = !!(token && user);
    console.log('🔐 isAuthenticated:', isAuth, { hasToken: !!token, hasUser: !!user });
    return isAuth;
  },

  /**
   * Limpia todos los datos de autenticación del localStorage
   */
  clearAuthData() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.LAST_CONVERSATION);
  },
};