import React, { useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import styles from '../../styles/components/Common.module.css';

/**
 * Contenedor de Toasts
 */
export const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className={styles['toast-container']}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

/**
 * Toast individual
 */
const Toast = ({ id, message, type, duration }) => {
  const { removeToast } = useToast();

  // useEffect: Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      // Agregar clase de salida antes de remover
      const element = document.getElementById(`toast-${id}`);
      if (element) {
        element.classList.add(styles['toast--exit']);
      }
    }, duration - 300);

    return () => clearTimeout(timer);
  }, [id, duration]);

  // Iconos según tipo
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  const handleClose = () => {
    const element = document.getElementById(`toast-${id}`);
    if (element) {
      element.classList.add(styles['toast--exit']);
      setTimeout(() => removeToast(id), 300);
    }
  };

  return (
    <div
      id={`toast-${id}`}
      className={`${styles.toast} ${styles[`toast--${type}`]}`}
      role="alert"
    >
      <span className={styles['toast__icon']}>{icons[type]}</span>
      <p className={styles['toast__message']}>{message}</p>
      <button
        className={styles['toast__close']}
        onClick={handleClose}
        aria-label="Cerrar notificación"
      >
        ×
      </button>
    </div>
  );
};