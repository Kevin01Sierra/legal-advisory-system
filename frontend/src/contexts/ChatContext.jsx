import { createContext, useState, useCallback, useEffect } from 'react';
import { chatService } from '../services/chatService';
import { useAuth } from '../hooks/useAuth';
import { 
  ERROR_MESSAGES, 
  MESSAGE_ROLES, 
  CHAT_CONFIG,
  STORAGE_KEYS 
} from '../utils/constants';

/**
 * Context para el chat
 * Maneja conversaciones y mensajes
 */
export const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Estados independientes para diferentes propósitos
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * useEffect: Cargar conversaciones al montar si hay autenticación
   */
  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
      loadLastConversation();
    }
  }, [isAuthenticated]);

  /**
   * Cargar última conversación desde localStorage
   */
  const loadLastConversation = useCallback(() => {
    const lastConvId = localStorage.getItem(STORAGE_KEYS.LAST_CONVERSATION);
    if (lastConvId) {
      loadConversation(lastConvId);
    }
  }, []);

  /**
   * Estado inmutable: Agregar mensaje usando función setter
   */
  const addMessage = useCallback((message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  /**
   * Crear nueva conversación (NO-OP - el backend la crea automáticamente)
   * Esta función solo establece un estado temporal para habilitar el chat
   */
  const createConversation = useCallback(async (title = 'Nueva consulta legal') => {
    console.log('ℹ️ Conversación se creará automáticamente al enviar primer mensaje');
    
    // Establecer una "conversación temporal" para habilitar el input
    setCurrentConversation({ id: null, titulo: title });
    setMessages([]);
    setError(null);
    
    return { success: true, data: { id: null, titulo: title } };
  }, []);

  /**
   * Enviar mensaje en una conversación
   * Si conversationId es null, el backend crea una nueva conversación automáticamente
   */
  const sendMessage = useCallback(
    async (conversationId, query) => {
      // Validaciones
      if (!query?.trim()) {
        setError(ERROR_MESSAGES.MESSAGE_EMPTY);
        return { success: false, error: ERROR_MESSAGES.MESSAGE_EMPTY };
      }

      if (query.length > CHAT_CONFIG.MAX_MESSAGE_LENGTH) {
        setError(ERROR_MESSAGES.MESSAGE_TOO_LONG);
        return { success: false, error: ERROR_MESSAGES.MESSAGE_TOO_LONG };
      }

      if (loading) {
        return { success: false, error: 'Ya hay una consulta en proceso' };
      }

      try {
        setLoading(true);
        setError(null);

        // Agregar mensaje del usuario inmediatamente (optimistic update)
        const userMessage = {
          id: `temp-${Date.now()}`,
          role: MESSAGE_ROLES.USER,
          content: query,
          createdAt: new Date().toISOString(),
        };
        addMessage(userMessage);

        // Enviar query (conversationId puede ser null para crear nueva)
        console.log('📤 Enviando mensaje con conversationId:', conversationId);
        const response = await chatService.sendQuery(query, conversationId);

        console.log('✅ Respuesta del backend:', response);

        // Si se creó una conversación nueva, actualizar el estado
        if (response.conversationId && conversationId === null) {
          console.log('🆕 Nueva conversación creada:', response.conversationId);
          setCurrentConversation({
            id: response.conversationId,
            titulo: query.substring(0, 100),
          });
          // Guardar como última conversación
          localStorage.setItem(STORAGE_KEYS.LAST_CONVERSATION, response.conversationId);
        }

        // Agregar respuesta del asistente
        const assistantMessage = {
          id: response.messageId || `msg-${Date.now()}`,
          role: MESSAGE_ROLES.ASSISTANT,
          content: response.response,
          articles: response.articulosCitados || [],
          metadata: response.metadata || {},
          createdAt: new Date().toISOString(),
        };
        addMessage(assistantMessage);

        return { success: true, data: response };
      } catch (err) {
        console.error('❌ Error al enviar mensaje:', err);
        const errorMessage = err.message || ERROR_MESSAGES.UNKNOWN_ERROR;
        setError(errorMessage);

        // Agregar mensaje de error
        const errorMsg = {
          id: `error-${Date.now()}`,
          role: MESSAGE_ROLES.ASSISTANT,
          content: 'Lo siento, ocurrió un error al procesar tu consulta. Por favor, intenta de nuevo.',
          error: true,
          createdAt: new Date().toISOString(),
        };
        addMessage(errorMsg);

        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [loading, addMessage]
  );

  /**
   * Cargar conversaciones del usuario
   */
  const loadConversations = useCallback(async () => {
    try {
      console.log('📂 Cargando conversaciones...');
      const data = await chatService.getConversations();
      
      console.log('✅ Conversaciones cargadas:', data);
      
      // Asegurarse de que data es un array
      const conversationsArray = Array.isArray(data) ? data : [];
      
      // Limitar el número de conversaciones mostradas
      const limitedConversations = conversationsArray.slice(0, CHAT_CONFIG.MAX_CONVERSATIONS_DISPLAY);
      setConversations(limitedConversations);
      
      return { success: true, data: limitedConversations };
    } catch (err) {
      console.error('❌ Error al cargar conversaciones:', err);
      setConversations([]); // ✅ Establecer array vacío en caso de error
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Cargar una conversación específica con su historial
   */
  const loadConversation = useCallback(async (conversationId) => {
    try {
      setLoading(true);
      setError(null);

      const data = await chatService.getConversationHistory(conversationId);
      
      setCurrentConversation(data);
      setMessages(data.messages || []);
      
      // Guardar como última conversación
      localStorage.setItem(STORAGE_KEYS.LAST_CONVERSATION, conversationId);

      return { success: true, data };
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.CONVERSATION_NOT_FOUND;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Eliminar conversación
   */
  const deleteConversation = useCallback(async (conversationId) => {
    try {
      await chatService.deleteConversation(conversationId);
      
      // Eliminar de la lista
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      // Si es la conversación actual, limpiar
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
        localStorage.removeItem(STORAGE_KEYS.LAST_CONVERSATION);
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [currentConversation]);

  /**
   * Crear nueva conversación (limpiar estado)
   */
  const newConversation = useCallback(() => {
    setMessages([]);
    setCurrentConversation(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEYS.LAST_CONVERSATION);
  }, []);

  /**
   * Limpiar error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    messages,
    conversations,
    currentConversation,
    loading,
    error,
    // Funciones
    createConversation,
    sendMessage,
    loadConversations,
    loadConversation,
    deleteConversation,
    newConversation,
    clearError,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};