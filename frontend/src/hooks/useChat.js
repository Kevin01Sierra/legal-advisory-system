import { useContext } from 'react';
import { ChatContext } from '../contexts/ChatContext';

/**
 * Hook personalizado para acceder al contexto de chat
 * @returns {Object} Objeto con estado y funciones del chat
 */
export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChat debe ser usado dentro de un ChatProvider');
  }

  return context;
};

export default useChat;