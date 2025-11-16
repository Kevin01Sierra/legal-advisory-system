import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import Loading from '../common/Loading';
import styles from '../../styles/components/Chat.module.css';

const ChatInterface = () => {
  const { user } = useAuth();
  const {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    createConversation,
    loadConversation,
    sendMessage,
    clearError
  } = useChat();

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Crear conversación inicial si no existe
  useEffect(() => {
    if (!currentConversation && !loading) {
      handleNewConversation();
    }
  }, []);

  const handleNewConversation = async () => {
    try {
      await createConversation('Nueva consulta legal');
    } catch (err) {
      console.error('Error creando conversación:', err);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || !currentConversation) return;

    setInputValue('');
    setIsTyping(true);

    try {
      await sendMessage(currentConversation.id, text.trim());
    } catch (err) {
      console.error('Error enviando mensaje:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectConversation = async (conversationId) => {
    try {
      await loadConversation(conversationId);
    } catch (err) {
      console.error('Error cargando conversación:', err);
    }
  };

  if (!user) {
    return (
      <div className={styles.chatContainer}>
        <div className={styles.emptyState}>
          <h2>Bienvenido al Sistema de Asesoría Legal</h2>
          <p>Por favor, inicia sesión para comenzar a consultar sobre el Código Penal Colombiano.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatContainer}>
      <ChatHeader
        currentConversation={currentConversation}
        conversations={conversations}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        userName={user.name}
      />

      <div className={styles.chatContent}>
        {loading && !messages.length ? (
          <div className={styles.loadingContainer}>
            <Loading />
            <p>Cargando conversación...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.welcomeMessage}>
              <h2>👋 ¡Hola, {user.name}!</h2>
              <p className={styles.subtitle}>
                Soy tu asistente legal especializado en el Código Penal Colombiano (Ley 599 de 2000)
              </p>
              
              <div className={styles.suggestions}>
                <h3>Puedes preguntarme sobre:</h3>
                <div className={styles.suggestionCards}>
                  <button
                    className={styles.suggestionCard}
                    onClick={() => handleSendMessage('¿Qué pena tiene el hurto calificado?')}
                  >
                    <span className={styles.icon}>⚖️</span>
                    <span>Penas y sanciones</span>
                  </button>
                  <button
                    className={styles.suggestionCard}
                    onClick={() => handleSendMessage('¿Cuáles son las circunstancias agravantes del homicidio?')}
                  >
                    <span className={styles.icon}>📋</span>
                    <span>Circunstancias agravantes</span>
                  </button>
                  <button
                    className={styles.suggestionCard}
                    onClick={() => handleSendMessage('Explícame qué es la legítima defensa')}
                  >
                    <span className={styles.icon}>🛡️</span>
                    <span>Conceptos legales</span>
                  </button>
                  <button
                    className={styles.suggestionCard}
                    onClick={() => handleSendMessage('¿Qué delitos son contra la vida?')}
                  >
                    <span className={styles.icon}>📚</span>
                    <span>Tipos de delitos</span>
                  </button>
                </div>
              </div>

              <div className={styles.disclaimer}>
                <p>
                  <strong>Nota importante:</strong> Este sistema proporciona información educativa 
                  basada en el Código Penal colombiano. No constituye asesoría legal profesional.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <MessageList
            messages={messages}
            isTyping={isTyping}
            messagesEndRef={messagesEndRef}
          />
        )}

        {error && (
          <div className={styles.errorBanner}>
            <span>{error}</span>
            <button onClick={clearError} className={styles.closeError}>×</button>
          </div>
        )}
      </div>

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        disabled={loading || isTyping || !currentConversation}
        placeholder={
          !currentConversation
            ? 'Creando conversación...'
            : 'Escribe tu consulta sobre el Código Penal...'
        }
      />
    </div>
  );
};

export default ChatInterface;