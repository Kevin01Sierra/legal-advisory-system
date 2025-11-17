/**
 * ArticleCard.jsx
 * Componente para mostrar información de un artículo del Código Penal
 * Actualizado para usar constants.js
 */

import React, { useState } from 'react';
import Button from '../common/Button';
import { LEGAL_INFO } from '../../utils/constants';
import styles from '../../styles/components/Chat.module.css';

const ArticleCard = ({ article }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!article) return null;

  // Handler para copiar texto del artículo
  const handleCopy = async () => {
    const textToCopy = `
${LEGAL_INFO.CODE_NAME}
Artículo ${article.number}${article.title ? ` - ${article.title}` : ''}

${article.content}

${article.notes ? `Notas: ${article.notes}` : ''}
${article.modifications ? `Modificaciones: ${article.modifications}` : ''}
    `.trim();

    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
  };

  // Truncar texto largo
  const truncateText = (text, maxLength = 200) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Determinar si el contenido es largo
  const isLongContent = article.content && article.content.length > 300;
  const displayContent = isExpanded 
    ? article.content 
    : truncateText(article.content, 300);

  return (
    <div className={styles.articleCard}>
      {/* Header del artículo */}
      <div className={styles.articleHeader}>
        <div className={styles.articleNumber}>
          <span className={styles.articleLabel}>Artículo</span>
          <span className={styles.articleNumberValue}>{article.number}</span>
        </div>
        
        {article.title && (
          <h4 className={styles.articleTitle}>{article.title}</h4>
        )}
      </div>

      {/* Contenido del artículo */}
      <div className={styles.articleContent}>
        <p className={styles.articleText}>
          {displayContent}
        </p>

        {/* Botón para expandir/contraer */}
        {isLongContent && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.expandButton}
          >
            {isExpanded ? 'Ver menos' : 'Ver más'}
            <span className={styles.expandIcon}>
              {isExpanded ? '▲' : '▼'}
            </span>
          </button>
        )}
      </div>

      {/* Información adicional (cuando está expandido) */}
      {isExpanded && (
        <div className={styles.articleDetails}>
          {/* Capítulo y título */}
          {(article.chapter || article.chapter_title) && (
            <div className={styles.articleMeta}>
              <span className={styles.metaLabel}>Capítulo:</span>
              <span className={styles.metaValue}>
                {article.chapter && `${article.chapter}. `}
                {article.chapter_title}
              </span>
            </div>
          )}

          {/* Libro */}
          {article.book && (
            <div className={styles.articleMeta}>
              <span className={styles.metaLabel}>Libro:</span>
              <span className={styles.metaValue}>{article.book}</span>
            </div>
          )}

          {/* Notas */}
          {article.notes && (
            <div className={styles.articleNotes}>
              <span className={styles.notesLabel}>📝 Notas:</span>
              <p className={styles.notesText}>{article.notes}</p>
            </div>
          )}

          {/* Modificaciones */}
          {article.modifications && (
            <div className={styles.articleModifications}>
              <span className={styles.modificationsLabel}>⚠️ Modificaciones:</span>
              <p className={styles.modificationsText}>{article.modifications}</p>
            </div>
          )}

          {/* Jurisprudencia relacionada */}
          {article.jurisprudence && article.jurisprudence.length > 0 && (
            <div className={styles.articleJurisprudence}>
              <span className={styles.jurisprudenceLabel}>⚖️ Jurisprudencia:</span>
              <ul className={styles.jurisprudenceList}>
                {article.jurisprudence.map((item, index) => (
                  <li key={index} className={styles.jurisprudenceItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Footer con acciones */}
      <div className={styles.articleFooter}>
        {/* Referencia legal */}
        <div className={styles.articleReference}>
          <span className={styles.referenceIcon}>📜</span>
          <span className={styles.referenceText}>
            {LEGAL_INFO.CODE_LAW} - {LEGAL_INFO.CODE_DATE}
          </span>
        </div>

        {/* Botón de copiar */}
        <Button
          variant="outline"
          size="small"
          onClick={handleCopy}
          className={styles.copyButton}
          title="Copiar artículo al portapapeles"
        >
          {isCopied ? (
            <>
              <span className={styles.copyIcon}>✓</span>
              Copiado
            </>
          ) : (
            <>
              <span className={styles.copyIcon}>📋</span>
              Copiar
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ArticleCard;