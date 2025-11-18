import { useState, useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/components/Chat.module.css';

const ChatHeader = ({ conversation }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const { conversations, loadConversations, loadConversation, newConversation, createConversation } = useChat();
  const { user } = useAuth();

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

  // ✅ Cargar conversaciones al abrir el menú
  const handleMenuToggle = async () => {
    if (!showMenu) {
      console.log('📂 Cargando historial de conversaciones...');
      await loadConversations();
    }
    setShowMenu(!showMenu);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
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

  const handleSelectConversation = async (convId) => {
    console.log('📖 Cargando conversación:', convId);
    await loadConversation(convId);
    setShowMenu(false);
  };

  /**
   * ✅ CORREGIDO: Handler para crear nuevo chat
   * Paso 1: Limpia el estado actual
   * Paso 2: Crea conversación local inmediatamente
   */
  const handleNewConversation = () => {
    console.log('🆕 Nueva conversación - Limpiando estado...');
    
    // Paso 1: Limpiar estado actual
    newConversation();
    
    // Paso 2: Crear conversación local inmediatamente
    // Usamos setTimeout para asegurar que el estado se limpió primero
    setTimeout(() => {
      console.log('✅ Creando conversación local...');
      createConversation('Nueva Consulta Legal');
    }, 50);
    
    // Cerrar menú
    setShowMenu(false);
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
        {conversation && (
          <div className={styles.conversationInfo}>
            <h2 className={styles.conversationTitle}>
              {conversation.titulo || 'Sin título'}
            </h2>
            {conversation.createdAt && (
              <span className={styles.conversationDate}>
                {formatDate(conversation.createdAt)}
              </span>
            )}
          </div>
        )}
      </div>

      <div className={styles.headerRight}>
        <button
          className={styles.newChatBtn}
          onClick={handleNewConversation}
          title="Nueva conversación"
        >
          <span className={styles.btnIcon}>+</span>
          <span className={styles.btnText}>Nueva consulta</span>
        </button>

        <div className={styles.menuContainer} ref={menuRef}>
          <button
            className={styles.menuButton}
            onClick={handleMenuToggle}
            title="Historial de conversaciones"
          >
            <span className={styles.menuIcon}>☰</span>
          </button>

          {showMenu && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <h3>Historial de Conversaciones</h3>
                <span className={styles.conversationCount}>
                  {Array.isArray(conversations) ? conversations.length : 0} conversación
                  {Array.isArray(conversations) && conversations.length !== 1 ? 'es' : ''}
                </span>
              </div>

              <div className={styles.conversationList}>
                {!Array.isArray(conversations) || conversations.length === 0 ? (
                  <div className={styles.emptyHistory}>
                    <p>No hay conversaciones previas</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      className={`${styles.conversationItem} ${
                        conversation?.id === conv.id ? styles.active : ''
                      }`}
                      onClick={() => handleSelectConversation(conv.id)}
                    >
                      <div className={styles.convItemHeader}>
                        <span className={styles.convTitle}>
                          {conv.titulo || 'Sin título'}
                        </span>
                        {conv.createdAt && (
                          <span className={styles.convDate}>
                            {formatDate(conv.createdAt)}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.userInfo}>
          <span className={styles.userAvatar}>
            {user?.nombre?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;