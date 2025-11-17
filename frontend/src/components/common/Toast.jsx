/**
 * Toast.jsx
 * Componente de notificaciones toast
 * Actualizado para usar constants.js
 */

import React, { useEffect, useState } from 'react';
import { 
  TOAST_TYPES, 
  TOAST_DURATION 
} from '../../utils/constants';
import styles from '../../styles/components/Common.module.css';

const Toast = ({ 
  message, 
  type = TOAST_TYPES.INFO, 
  duration = TOAST_DURATION.MEDIUM,
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Auto-cerrar después de la duración especificada
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300); // Duración de la animación de salida
  };

  if (!isVisible) return null;

  // Configuración de iconos y colores según el tipo
  const toastConfig = {
    [TOAST_TYPES.SUCCESS]: {
      icon: '✓',
      className: styles.toastSuccess
    },
    [TOAST_TYPES.ERROR]: {
      icon: '✕',
      className: styles.toastError
    },
    [TOAST_TYPES.WARNING]: {
      icon: '⚠',
      className: styles.toastWarning
    },
    [TOAST_TYPES.INFO]: {
      icon: 'ℹ',
      className: styles.toastInfo
    }
  };

  const config = toastConfig[type] || toastConfig[TOAST_TYPES.INFO];

  return (
    <div 
      className={`${styles.toast} ${config.className} ${
        isExiting ? styles.toastExit : styles.toastEnter
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.toastIcon}>
        {config.icon}
      </div>
      
      <div className={styles.toastContent}>
        <p className={styles.toastMessage}>{message}</p>
      </div>

      <button
        onClick={handleClose}
        className={styles.toastClose}
        aria-label="Cerrar notificación"
      >
        ×
      </button>

      {/* Barra de progreso */}
      <div 
        className={styles.toastProgress}
        style={{ 
          animationDuration: `${duration}ms` 
        }}
      />
    </div>
  );
};

// Componente contenedor para múltiples toasts
export const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;