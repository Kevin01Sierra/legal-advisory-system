/**
 * Message.jsx
 * Componente para mostrar un mensaje individual en el chat
 * Actualizado para usar constants.js
 */

import React, { useState } from 'react';
import ArticleCard from './ArticleCard';
import { 
  MESSAGE_ROLES, 
  MESSAGE_STATUS 
} from '../../utils/constants';
import styles from '../../styles/components/Chat.module.css';

const Message = ({ message }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isUser = message.role === MESSAGE_ROLES.USER;
  const isAssistant = message.role === MESSAGE_ROLES.ASSISTANT;
  const isSystem = message.role === MESSAGE_ROLES.SYSTEM;

  // Formatear timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener ícono de status
  const getStatusIcon = (status) => {
    switch (status) {
      case MESSAGE_STATUS.SENDING:
        return '⏳';
      case MESSAGE_STATUS.SENT:
        return '✓';
      case MESSAGE_STATUS.DELIVERED:
        return '✓✓';
      case MESSAGE_STATUS.ERROR:
        return '⚠️';
      default:
        return '';
    }
  };

  // Renderizar contenido del mensaje con formato
  const renderContent = (content) => {
    if (!content) return null;

    // Convertir URLs a links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.messageLink}
          >
            {part}
          </a>
        );
      }
      
      // Detectar y formatear código inline
      if (part.includes('`')) {
        const codeParts = part.split('`');
        return codeParts.map((codePart, codeIndex) => {
          if (codeIndex % 2 === 1) {
            return (
              <code key={`${index}-${codeIndex}`} className={styles.inlineCode}>
                {codePart}
              </code>
            );
          }
          return codePart;
        });
      }
      
      return part;
    });
  };

  // Si es un mensaje del sistema, renderizar de manera especial
  if (isSystem) {
    return (
      <div className={styles.systemMessage}>
        <span className={styles.systemIcon}>ℹ️</span>
        <span className={styles.systemText}>{message.content}</span>
      </div>
    );
  }

  return (
    <div 
      className={`${styles.messageWrapper} ${
        isUser ? styles.userMessage : styles.assistantMessage
      }`}
    >
      <div className={styles.messageContainer}>
        {/* Avatar */}
        <div className={styles.messageAvatar}>
          {isUser ? (
            <div className={styles.userAvatar}>
              {message.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          ) : (
            <div className={styles.assistantAvatar}>⚖️</div>
          )}
        </div>

        {/* Contenido del mensaje */}
        <div className={styles.messageContent}>
          {/* Header con nombre y hora */}
          <div className={styles.messageHeader}>
            <span className={styles.messageSender}>
              {isUser 
                ? message.user?.name || 'Usuario' 
                : 'Asistente Legal'
              }
            </span>
            <span className={styles.messageTime}>
              {formatTime(message.created_at || message.timestamp)}
            </span>
          </div>

          {/* Texto del mensaje */}
          <div className={styles.messageText}>
            {renderContent(message.content)}
          </div>

          {/* Artículos relacionados (solo para mensajes del asistente) */}
          {isAssistant && message.articles && message.articles.length > 0 && (
            <div className={styles.relatedArticles}>
              <button
                className={styles.articlesToggle}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <span className={styles.articlesIcon}>📚</span>
                <span>
                  {message.articles.length} artículo{message.articles.length > 1 ? 's' : ''} relacionado{message.articles.length > 1 ? 's' : ''}
                </span>
                <span className={styles.toggleIcon}>
                  {isExpanded ? '▼' : '▶'}
                </span>
              </button>

              {isExpanded && (
                <div className={styles.articlesContainer}>
                  {message.articles.map((article, index) => (
                    <ArticleCard 
                      key={article.number || index} 
                      article={article} 
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer con estado (solo para mensajes del usuario) */}
          {isUser && message.status && (
            <div className={styles.messageFooter}>
              <span 
                className={`${styles.messageStatus} ${
                  message.status === MESSAGE_STATUS.ERROR 
                    ? styles.statusError 
                    : ''
                }`}
              >
                {getStatusIcon(message.status)}
              </span>
            </div>
          )}

          {/* Indicador de error */}
          {message.error && (
            <div className={styles.messageError}>
              <span className={styles.errorIcon}>⚠️</span>
              <span className={styles.errorText}>
                {message.error}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;