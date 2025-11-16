import { useState } from 'react';
import ArticleCard from './ArticleCard';
import styles from '../../styles/components/Chat.module.css';

const Message = ({ message }) => {
  const [showArticles, setShowArticles] = useState(true);
  const isUser = message.role === 'user';
  const hasArticles = message.metadata?.articles && message.metadata.articles.length > 0;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatear el texto con saltos de línea y énfasis
  const formatText = (text) => {
    if (!text) return '';
    
    // Convertir **texto** a <strong>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convertir saltos de línea a <br>
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  };

  return (
    <div className={styles.messageWrapper}>
      <div className={`${styles.message} ${isUser ? styles.user : styles.assistant}`}>
        <div className={styles.messageHeader}>
          <span className={styles.messageAvatar}>
            {isUser ? '👤' : '🤖'}
          </span>
          <span className={styles.messageSender}>
            {isUser ? 'Tú' : 'Asistente Legal'}
          </span>
          <span className={styles.messageTime}>
            {formatTimestamp(message.createdAt)}
          </span>
        </div>

        <div className={styles.messageContent}>
          <div
            className={styles.messageText}
            dangerouslySetInnerHTML={{ __html: formatText(message.content) }}
          />

          {!isUser && hasArticles && (
            <div className={styles.articlesSection}>
              <button
                className={styles.articlesToggle}
                onClick={() => setShowArticles(!showArticles)}
              >
                <span className={styles.toggleIcon}>
                  {showArticles ? '▼' : '▶'}
                </span>
                <span className={styles.toggleText}>
                  Artículos citados ({message.metadata.articles.length})
                </span>
              </button>

              {showArticles && (
                <div className={styles.articlesList}>
                  {message.metadata.articles.map((article, index) => (
                    <ArticleCard key={index} article={article} />
                  ))}
                </div>
              )}
            </div>
          )}

          {!isUser && message.metadata?.confidence && (
            <div className={styles.messageFooter}>
              <span className={styles.confidenceLabel}>
                Confianza: {Math.round(message.metadata.confidence * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;