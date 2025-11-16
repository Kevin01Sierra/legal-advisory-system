import React from 'react';
import styles from '../../styles/components/Common.module.css';

/**
 * Componente Button Reutilizable
 * 
 * Props:
 * - variant: 'primary' | 'secondary' | 'danger' | 'ghost'
 * - size: 'sm' | 'md' | 'lg'
 * - fullWidth: boolean
 * - loading: boolean
 * - disabled: boolean
 * - icon: ReactNode (icono opcional)
 * - children: contenido del botón
 * - onClick: función callback
 * - type: 'button' | 'submit' | 'reset'
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon = null,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  // Composición de clases CSS usando BEM
  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    fullWidth && styles['button--full-width'],
    loading && styles['button--loading'],
    disabled && styles['button--disabled'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className={styles.spinner}></span>
          <span>Cargando...</span>
        </>
      ) : (
        <>
          {icon && <span className={styles['button__icon']}>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};