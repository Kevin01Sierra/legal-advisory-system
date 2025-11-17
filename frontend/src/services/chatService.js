import { apiClient } from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Servicio de chat legal
 * Maneja conversaciones, mensajes y consultas al sistema de IA
 */
export const chatService = {
  /**
   * Envía una consulta legal al sistema de IA
   * Si no se proporciona conversationId, el backend creará una nueva conversación automáticamente
   * @param {string} query - Texto de la consulta
   * @param {string} conversationId - ID de la conversación (opcional)
   * @returns {Promise<Object>} Respuesta de la IA con artículos citados
   */
  async sendQuery(query, conversationId = null) {
    const payload = {
      query,
      ...(conversationId && { conversationId }),
    };

    console.log('📤 Enviando query:', payload);

    const response = await apiClient.post(API_ENDPOINTS.MESSAGES.SEND, payload);

    console.log('✅ Respuesta recibida:', response);

    return response;
  },

  /**
   * Obtiene todas las conversaciones del usuario actual
   * @returns {Promise<Array>} Lista de conversaciones
   */
  async getConversations() {
    return apiClient.get(API_ENDPOINTS.CONVERSATIONS.BASE);
  },

  /**
   * Obtiene el historial completo de una conversación
   * @param {string} conversationId - ID de la conversación
   * @returns {Promise<Object>} Conversación con sus mensajes
   */
  async getConversationHistory(conversationId) {
    return apiClient.get(API_ENDPOINTS.CONVERSATIONS.BY_ID(conversationId));
  },

  /**
   * Elimina una conversación
   * @param {string} conversationId - ID de la conversación
   * @returns {Promise<void>}
   */
  async deleteConversation(conversationId) {
    return apiClient.delete(API_ENDPOINTS.CONVERSATIONS.BY_ID(conversationId));
  },

  /**
   * Obtiene los mensajes de una conversación
   * @param {string} conversationId - ID de la conversación
   * @returns {Promise<Array>} Lista de mensajes
   */
  async getMessages(conversationId) {
    return apiClient.get(API_ENDPOINTS.CONVERSATIONS.MESSAGES(conversationId));
  },

  /**
   * Obtiene un mensaje específico por ID
   * @param {string} messageId - ID del mensaje
   * @returns {Promise<Object>} Mensaje con sus metadatos
   */
  async getMessage(messageId) {
    return apiClient.get(API_ENDPOINTS.MESSAGES.BY_ID(messageId));
  },

  /**
   * Busca artículos del Código Penal
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<Array>} Artículos encontrados
   */
  async searchArticles(searchTerm) {
    return apiClient.post(API_ENDPOINTS.ARTICLES.SEARCH, {
      query: searchTerm,
    });
  },

  /**
   * Obtiene un artículo específico por número
   * @param {number} articleNumber - Número del artículo
   * @returns {Promise<Object>} Artículo del Código Penal
   */
  async getArticleByNumber(articleNumber) {
    return apiClient.get(API_ENDPOINTS.ARTICLES.BY_NUMBER(articleNumber));
  },

  /**
   * Obtiene todos los artículos del Código Penal (paginado)
   * @param {number} page - Número de página
   * @param {number} limit - Cantidad de artículos por página
   * @returns {Promise<Object>} Artículos con paginación
   */
  async getAllArticles(page = 1, limit = 20) {
    return apiClient.get(`${API_ENDPOINTS.ARTICLES.ALL}?page=${page}&limit=${limit}`);
  },
};