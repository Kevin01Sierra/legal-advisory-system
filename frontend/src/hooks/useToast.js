import { createContext, useContext, useState, useCallback } from 'react';
import { TOAST_TYPES, TOAST_DURATION } from '../utils/constants';

/**
 * Context para sistema de notificaciones Toast
 */
const ToastContext = createContext(undefined);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  /**
   * Agregar un nuevo toast
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo de toast (success, error, warning, info)
   * @param {number} duration - Duración en milisegundos (0 = permanente)
   * @returns {number} ID del toast creado
   */
  const addToast = useCallback((message, type = TOAST_TYPES.INFO, duration = TOAST_DURATION.MEDIUM) => {
    const id = Date.now() + Math.random();
    const toast = { 
      id, 
      message, 
      type, 
      duration,
      createdAt: new Date().toISOString() 
    };

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
   * @param {number} id - ID del toast a remover
   */
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Remover todos los toasts
   */
  const removeAll = useCallback(() => {
    setToasts([]);
  }, []);

  /**
   * Función genérica showToast (alias mejorado de addToast)
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo: 'success' | 'error' | 'warning' | 'info'
   * @param {number} duration - Duración opcional
   */
  const showToast = useCallback(
    (message, type = TOAST_TYPES.INFO, duration) => {
      return addToast(message, type, duration);
    },
    [addToast]
  );

  /**
   * Mostrar toast de éxito
   * @param {string} message - Mensaje de éxito
   * @param {number} duration - Duración personalizada (opcional)
   */
  const success = useCallback(
    (message, duration = TOAST_DURATION.MEDIUM) => 
      addToast(message, TOAST_TYPES.SUCCESS, duration),
    [addToast]
  );

  /**
   * Mostrar toast de error
   * @param {string} message - Mensaje de error
   * @param {number} duration - Duración personalizada (opcional)
   */
  const error = useCallback(
    (message, duration = TOAST_DURATION.LONG) => 
      addToast(message, TOAST_TYPES.ERROR, duration),
    [addToast]
  );

  /**
   * Mostrar toast de advertencia
   * @param {string} message - Mensaje de advertencia
   * @param {number} duration - Duración personalizada (opcional)
   */
  const warning = useCallback(
    (message, duration = TOAST_DURATION.MEDIUM) => 
      addToast(message, TOAST_TYPES.WARNING, duration),
    [addToast]
  );

  /**
   * Mostrar toast informativo
   * @param {string} message - Mensaje informativo
   * @param {number} duration - Duración personalizada (opcional)
   */
  const info = useCallback(
    (message, duration = TOAST_DURATION.SHORT) => 
      addToast(message, TOAST_TYPES.INFO, duration),
    [addToast]
  );

  /**
   * Mostrar toast de promesa (loading -> success/error)
   * @param {Promise} promise - Promesa a ejecutar
   * @param {Object} messages - Mensajes para cada estado
   * @param {string} messages.loading - Mensaje durante la carga
   * @param {string} messages.success - Mensaje de éxito
   * @param {string} messages.error - Mensaje de error
   */
  const promise = useCallback(
    async (promiseToResolve, messages = {}) => {
      const {
        loading = 'Cargando...',
        success: successMsg = 'Operación exitosa',
        error: errorMsg = 'Ocurrió un error'
      } = messages;

      // Mostrar toast de loading
      const loadingId = addToast(loading, TOAST_TYPES.INFO, 0);

      try {
        const result = await promiseToResolve;
        
        // Remover loading y mostrar success
        removeToast(loadingId);
        success(successMsg);
        
        return { success: true, data: result };
      } catch (err) {
        // Remover loading y mostrar error
        removeToast(loadingId);
        error(errorMsg);
        
        return { success: false, error: err };
      }
    },
    [addToast, removeToast, success, error]
  );

  const value = {
    toasts,
    addToast,
    showToast,  // ✅ AGREGADO
    removeToast,
    removeAll,
    success,
    error,
    warning,
    info,
    promise,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

/**
 * Hook para usar toasts
 * @returns {Object} Funciones y estado de toasts
 * @throws {Error} Si se usa fuera del ToastProvider
 */
export const useToast = () => {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider');
  }

  return context;
};

export default useToast;