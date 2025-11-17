/**
 * ChatInput.jsx
 * Componente de entrada de mensajes en el chat
 * Actualizado para usar constants.js
 */

import React, { useState, useRef, useEffect } from 'react';
import Button from '../common/Button';
import { 
  CHAT_CONFIG, 
  ERROR_MESSAGES 
} from '../../utils/constants';
import styles from '../../styles/components/Chat.module.css';

const ChatInput = ({ onSendMessage, disabled = false, maxLength }) => {
  const [message, setMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isOverLimit, setIsOverLimit] = useState(false);
  const textareaRef = useRef(null);
  
  const effectiveMaxLength = maxLength || CHAT_CONFIG.MAX_MESSAGE_LENGTH;

  // Auto-resize del textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  // Focus automático al montar el componente
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  // Handler para cambios en el input
  const handleChange = (e) => {
    const newMessage = e.target.value;
    const newCharCount = newMessage.length;
    
    setMessage(newMessage);
    setCharCount(newCharCount);
    setIsOverLimit(newCharCount > effectiveMaxLength);
  };

  // Handler para enviar mensaje
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return;
    }

    if (message.length > effectiveMaxLength) {
      return;
    }

    if (disabled) {
      return;
    }

    onSendMessage(message.trim());
    setMessage('');
    setCharCount(0);
    setIsOverLimit(false);
    
    // Re-focus después de enviar
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  // Handler para tecla Enter
  const handleKeyDown = (e) => {
    // Enter sin Shift para enviar
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Calcular porcentaje de caracteres usados
  const charPercentage = (charCount / effectiveMaxLength) * 100;
  const showCharCount = charPercentage > 70; // Mostrar cuando supere 70%

  return (
    <form onSubmit={handleSubmit} className={styles.chatInputContainer}>
      <div className={styles.inputWrapper}>
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled 
              ? 'Esperando respuesta...' 
              : 'Escribe tu consulta legal aquí... (Enter para enviar, Shift+Enter para nueva línea)'
          }
          disabled={disabled}
          className={`${styles.chatTextarea} ${isOverLimit ? styles.overLimit : ''}`}
          rows={1}
          maxLength={effectiveMaxLength + 100} // Un poco más para mostrar el error
        />

        {/* Contador de caracteres */}
        {showCharCount && (
          <div 
            className={`${styles.charCounter} ${
              isOverLimit ? styles.charCounterError : 
              charPercentage > 90 ? styles.charCounterWarning : ''
            }`}
          >
            {charCount} / {effectiveMaxLength}
          </div>
        )}

        {/* Botón de enviar */}
        <Button
          type="submit"
          disabled={disabled || !message.trim() || isOverLimit}
          className={styles.sendButton}
          title={
            disabled ? 'Esperando respuesta' :
            !message.trim() ? 'Escribe un mensaje' :
            isOverLimit ? ERROR_MESSAGES.MESSAGE_TOO_LONG :
            'Enviar mensaje (Enter)'
          }
        >
          {disabled ? (
            <span className={styles.sendingIcon}>⏳</span>
          ) : (
            <span className={styles.sendIcon}>➤</span>
          )}
        </Button>
      </div>

      {/* Mensaje de error si supera el límite */}
      {isOverLimit && (
        <div className={styles.inputError}>
          {ERROR_MESSAGES.MESSAGE_TOO_LONG}
        </div>
      )}

      {/* Hints de uso */}
      {!disabled && message.length === 0 && (
        <div className={styles.inputHints}>
          <span className={styles.hint}>
            💡 <strong>Enter</strong> para enviar
          </span>
          <span className={styles.hint}>
            <strong>Shift + Enter</strong> para nueva línea
          </span>
        </div>
      )}
    </form>
  );
};

export default ChatInput;