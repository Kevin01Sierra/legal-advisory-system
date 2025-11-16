import { useState } from 'react';
import styles from '../../styles/components/Chat.module.css';

const ArticleCard = ({ article }) => {
  const [expanded, setExpanded] = useState(false);

  if (!article) return null;

  const {
    articleNumber,
    title,
    content,
    similarity,
    chapter,
    section
  } = article;

  const truncateContent = (text, maxLength = 200) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className={styles.articleCard}>
      <div className={styles.articleHeader}>
        <div className={styles.articleTitle}>
          <span className={styles.articleNumber}>
            Artículo {articleNumber}
          </span>
          {title && (
            <span className={styles.articleTitleText}>
              {title}
            </span>
          )}
        </div>
        
        {similarity && (
          <span className={styles.similarityBadge}>
            {Math.round(similarity * 100)}% relevante
          </span>
        )}
      </div>

      {(chapter || section) && (
        <div className={styles.articleMeta}>
          {chapter && (
            <span className={styles.metaItem}>
              <strong>Capítulo:</strong> {chapter}
            </span>
          )}
          {section && (
            <span className={styles.metaItem}>
              <strong>Sección:</strong> {section}
            </span>
          )}
        </div>
      )}

      <div className={styles.articleContent}>
        <p className={styles.articleText}>
          {expanded ? content : truncateContent(content)}
        </p>

        {content && content.length > 200 && (
          <button
            className={styles.expandButton}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </div>

      <div className={styles.articleFooter}>
        <span className={styles.sourceLabel}>
          📚 Código Penal Colombiano (Ley 599 de 2000)
        </span>
      </div>
    </div>
  );
};

export default ArticleCard;