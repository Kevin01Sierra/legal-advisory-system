import { createContext, useContext, useState, useCallback } from 'react';

/**
 * Context para sistema de notificaciones Toast
 */
const ToastContext = createContext(undefined);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  /**
   * Agregar un nuevo toast
   */
  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    // Auto-remover después de la duración
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  /**
   * Remover toast por ID
   */
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Métodos helper
   */
  const success = useCallback(
    (message, duration) => addToast(message, 'success', duration),
    [addToast]
  );

  const error = useCallback(
    (message, duration) => addToast(message, 'error', duration),
    [addToast]
  );

  const warning = useCallback(
    (message, duration) => addToast(message, 'warning', duration),
    [addToast]
  );

  const info = useCallback(
    (message, duration) => addToast(message, 'info', duration),
    [addToast]
  );

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

/**
 * Hook para usar toasts
 */
export const useToast = () => {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider');
  }

  return context;
};