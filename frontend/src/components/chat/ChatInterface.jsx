/**
 * ChatInterface.jsx
 * Componente principal de la interfaz de chat
 * FINAL: Crea conversación localmente, el backend la crea al enviar primer mensaje
 */

import React, { useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { useToast } from '../../hooks/useToast';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import Loading from '../common/Loading';
import { 
  CHAT_CONFIG, 
  ERROR_MESSAGES,
  INITIAL_SUGGESTIONS 
} from '../../utils/constants';
import styles from '../../styles/components/Chat.module.css';

const ChatInterface = () => {
  const { 
    currentConversation,
    messages,
    loading,
    createConversation,
    sendMessage,
    error: chatError
  } = useChat();
  
  const { showToast } = useToast();
  const messagesEndRef = useRef(null);
  const hasInitialized = useRef(false);

  // ✅ Crear conversación LOCAL (no hace POST, solo habilita el chat)
  useEffect(() => {
    if (!currentConversation && !loading && !hasInitialized.current) {
      hasInitialized.current = true;
      console.log('✅ Habilitando chat - conversación se creará al enviar primer mensaje');
      createConversation('Nueva Consulta Legal');
    }
  }, [currentConversation, loading, createConversation]);

  // Auto-scroll al final de los mensajes
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, CHAT_CONFIG.AUTO_SCROLL_DELAY);
  };

  // Auto-scroll cuando llegan nuevos mensajes
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Mostrar errores del chat
  useEffect(() => {
    if (chatError) {
      showToast(chatError, 'error');
    }
  }, [chatError, showToast]);

  // Handler para enviar mensaje
  const handleSendMessage = async (content) => {
    if (!content || content.trim().length === 0) {
      showToast(ERROR_MESSAGES.MESSAGE_EMPTY, 'error');
      return;
    }

    if (content.length > CHAT_CONFIG.MAX_MESSAGE_LENGTH) {
      showToast(ERROR_MESSAGES.MESSAGE_TOO_LONG, 'error');
      return;
    }

    try {
      console.log('📤 Enviando mensaje:', content);
      console.log('🔑 Conversation ID:', currentConversation?.id);
      
      // Enviar mensaje (conversationId puede ser null para primera vez)
      await sendMessage(currentConversation?.id || null, content);
      
      scrollToBottom();
    } catch (error) {
      console.error('❌ Error sending message:', error);
      showToast(
        error.message || ERROR_MESSAGES.UNKNOWN_ERROR, 
        'error'
      );
    }
  };

  // Handler para sugerencias iniciales
  const handleSuggestionClick = (query) => {
    handleSendMessage(query);
  };

  // Vista vacía inicial
  if (!currentConversation) {
    return (
      <div className={styles.chatEmpty}>
        <div className={styles.emptyContent}>
          <Loading size="medium" text="Preparando chat..." />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatInterface}>
      {/* Header del chat */}
      <ChatHeader conversation={currentConversation} />

      {/* Área de mensajes */}
      <div className={styles.chatMessages}>
        {messages.length === 0 && !loading ? (
          // Vista inicial con sugerencias
          <div className={styles.initialView}>
            <div className={styles.welcomeMessage}>
              <h3>¿En qué puedo ayudarte hoy?</h3>
              <p>Selecciona una pregunta o escribe tu consulta legal</p>
            </div>
            
            <div className={styles.suggestions}>
              {INITIAL_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion.id}
                  className={styles.suggestionCard}
                  onClick={() => handleSuggestionClick(suggestion.query)}
                  disabled={loading}
                >
                  <span className={styles.suggestionIcon}>
                    {suggestion.icon}
                  </span>
                  <span className={styles.suggestionTitle}>
                    {suggestion.title}
                  </span>
                  <span className={styles.suggestionQuery}>
                    {suggestion.query}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Lista de mensajes
          <>
            <MessageList messages={messages} />
            <div ref={messagesEndRef} />
          </>
        )}

        {/* Indicador de carga */}
        {loading && (
          <div className={styles.loadingContainer}>
            <Loading size="small" text="Pensando..." />
          </div>
        )}
      </div>

      {/* Input de chat */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={loading}
        maxLength={CHAT_CONFIG.MAX_MESSAGE_LENGTH}
      />
    </div>
  );
};

export default ChatInterface;