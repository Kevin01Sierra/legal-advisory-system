import { useState, useRef, useEffect } from 'react';
import styles from '../../styles/components/Chat.module.css';

const ChatHeader = ({
  currentConversation,
  conversations,
  onNewConversation,
  onSelectConversation,
  userName
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Hoy';
    if (diffDays === 2) return 'Ayer';
    if (diffDays <= 7) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <header className={styles.chatHeader}>
      <div className={styles.headerLeft}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⚖️</span>
          <span className={styles.logoText}>Asesor Legal Penal</span>
        </div>
      </div>

      <div className={styles.headerCenter}>
        {currentConversation && (
          <div className={styles.conversationInfo}>
            <h2 className={styles.conversationTitle}>
              {currentConversation.title || 'Sin título'}
            </h2>
            <span className={styles.conversationDate}>
              {formatDate(currentConversation.createdAt)}
            </span>
          </div>
        )}
      </div>

      <div className={styles.headerRight}>
        <button
          className={styles.newChatBtn}
          onClick={onNewConversation}
          title="Nueva conversación"
        >
          <span className={styles.btnIcon}>+</span>
          <span className={styles.btnText}>Nueva consulta</span>
        </button>

        <div className={styles.menuContainer} ref={menuRef}>
          <button
            className={styles.menuButton}
            onClick={() => setShowMenu(!showMenu)}
            title="Historial de conversaciones"
          >
            <span className={styles.menuIcon}>☰</span>
          </button>

          {showMenu && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <h3>Historial de Conversaciones</h3>
                <span className={styles.conversationCount}>
                  {conversations.length} conversación{conversations.length !== 1 ? 'es' : ''}
                </span>
              </div>

              <div className={styles.conversationList}>
                {conversations.length === 0 ? (
                  <div className={styles.emptyHistory}>
                    <p>No hay conversaciones previas</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      className={`${styles.conversationItem} ${
                        currentConversation?.id === conv.id ? styles.active : ''
                      }`}
                      onClick={() => {
                        onSelectConversation(conv.id);
                        setShowMenu(false);
                      }}
                    >
                      <div className={styles.convItemHeader}>
                        <span className={styles.convTitle}>
                          {conv.title || 'Sin título'}
                        </span>
                        <span className={styles.convDate}>
                          {formatDate(conv.createdAt)}
                        </span>
                      </div>
                      {conv.lastMessage && (
                        <p className={styles.convPreview}>
                          {conv.lastMessage.substring(0, 60)}
                          {conv.lastMessage.length > 60 ? '...' : ''}
                        </p>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.userInfo}>
          <span className={styles.userAvatar}>
            {userName?.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;