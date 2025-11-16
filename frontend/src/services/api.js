import { API_BASE_URL, ERROR_MESSAGES, HTTP_STATUS, STORAGE_KEYS } from '../utils/constants';

/**
 * Cliente HTTP centralizado con manejo de errores y autenticación
 */
class ApiClient {
  /**
   * Realiza una petición HTTP con manejo automático de errores y autenticación
   * @param {string} endpoint - Endpoint relativo a la API
   * @param {Object} options - Opciones de fetch
   * @returns {Promise<Object>} Respuesta de la API
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    // Obtener token de autenticación
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Manejar respuesta no-JSON (204 No Content, etc)
      const contentType = response.headers.get('content-type');
      const data = contentType?.includes('application/json')
        ? await response.json()
        : null;

      // Manejo específico de errores HTTP
      if (!response.ok) {
        return this.handleHttpError(response.status, data);
      }

      return data;
    } catch (error) {
      // Manejo de errores de red
      if (error instanceof TypeError) {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }
      throw error;
    }
  }

  /**
   * Maneja errores HTTP según el código de estado
   * @param {number} status - Código de estado HTTP
   * @param {Object} data - Datos de respuesta
   * @throws {Error} Error con mensaje apropiado
   */
  handleHttpError(status, data) {
    const errorMessage = data?.message || data?.error;

    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        // Limpiar sesión si el token es inválido
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        throw new Error(errorMessage || ERROR_MESSAGES.UNAUTHORIZED);

      case HTTP_STATUS.FORBIDDEN:
        throw new Error(errorMessage || ERROR_MESSAGES.PERMISSION_DENIED);

      case HTTP_STATUS.NOT_FOUND:
        throw new Error(errorMessage || ERROR_MESSAGES.UNKNOWN_ERROR);

      case HTTP_STATUS.CONFLICT:
        throw new Error(errorMessage || ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);

      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        throw new Error(errorMessage || ERROR_MESSAGES.UNKNOWN_ERROR);

      case HTTP_STATUS.TOO_MANY_REQUESTS:
        throw new Error('Demasiadas peticiones. Por favor, intenta más tarde.');

      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        throw new Error(errorMessage || ERROR_MESSAGES.SERVER_ERROR);

      default:
        throw new Error(errorMessage || ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  }

  /**
   * Petición GET
   * @param {string} endpoint - Endpoint relativo
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>}
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * Petición POST
   * @param {string} endpoint - Endpoint relativo
   * @param {Object} body - Cuerpo de la petición
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>}
   */
  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * Petición PUT
   * @param {string} endpoint - Endpoint relativo
   * @param {Object} body - Cuerpo de la petición
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>}
   */
  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * Petición PATCH
   * @param {string} endpoint - Endpoint relativo
   * @param {Object} body - Cuerpo de la petición
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>}
   */
  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  /**
   * Petición DELETE
   * @param {string} endpoint - Endpoint relativo
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>}
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;