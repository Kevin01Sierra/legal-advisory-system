import React, { createContext, useState, useContext, useCallback } from 'react';
import { chatService } from '../services/chatService';
import { useAuth } from './AuthContext';

/**
 * Context para el chat
 * Maneja conversaciones y mensajes
 */
const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
  const { token } = useAuth();

  // Estados independientes para diferentes propósitos
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Estado inmutable: Agregar mensaje usando función setter
   * Usa el estado anterior para garantizar inmutabilidad
   */
  const addMessage = useCallback((message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  /**
   * Enviar consulta al backend
   */
  const sendQuery = useCallback(
    async (query) => {
      if (!query.trim() || loading) return;

      try {
        setLoading(true);
        setError(null);

        // Agregar mensaje del usuario inmediatamente
        const userMessage = {
          role: 'user',
          content: query,
          timestamp: new Date().toISOString(),
        };
        addMessage(userMessage);

        // Llamar al servicio
        const response = await chatService.sendQuery(
          query,
          currentConversationId,
          token
        );

        // Actualizar ID de conversación si es nueva
        if (!currentConversationId && response.conversationId) {
          setCurrentConversationId(response.conversationId);
        }

        // Agregar respuesta del asistente
        const assistantMessage = {
          role: 'assistant',
          content: response.response,
          articulos: response.articulosCitados,
          metadata: response.metadata,
          timestamp: new Date().toISOString(),
        };
        addMessage(assistantMessage);

        return { success: true, data: response };
      } catch (err) {
        const errorMessage = err.message || 'Error al enviar el mensaje';
        setError(errorMessage);

        // Agregar mensaje de error
        const errorMsg = {
          role: 'assistant',
          content: 'Lo siento, ocurrió un error al procesar tu consulta. Por favor, intenta de nuevo.',
          error: true,
          timestamp: new Date().toISOString(),
        };
        addMessage(errorMsg);

        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [currentConversationId, loading, token, addMessage]
  );

  /**
   * Cargar conversaciones del usuario
   */
  const loadConversations = useCallback(async () => {
    try {
      const data = await chatService.getConversations(token);
      setConversations(data);
    } catch (err) {
      console.error('Error al cargar conversaciones:', err);
    }
  }, [token]);

  /**
   * Crear nueva conversación
   */
  const newConversation = useCallback(() => {
    setMessages([]);
    setCurrentConversationId(null);
    setError(null);
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
    currentConversationId,
    loading,
    error,
    sendQuery,
    loadConversations,
    newConversation,
    clearError,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

/**
 * Hook personalizado para usar el ChatContext
 */
export const useChat = () => {
  const context = useContext(ChatContext);

  if (context === undefined) {
    throw new Error('useChat debe ser usado dentro de un ChatProvider');
  }

  return context;
};