import React, { useState } from 'react';
import styles from '../../styles/components/Common.module.css';

/**
 * Componente Input Controlado con Validación
 * 
 * Props:
 * - label: etiqueta del input
 * - name: nombre del campo
 * - type: tipo de input ('text', 'email', 'password', etc)
 * - value: valor controlado
 * - onChange: función para manejar cambios
 * - onBlur: función para manejar pérdida de foco
 * - error: mensaje de error
 * - placeholder: texto placeholder
 * - required: boolean
 * - disabled: boolean
 * - icon: ReactNode (icono opcional)
 * - helperText: texto de ayuda
 */
const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  icon = null,
  helperText,
  className = '',
  ...props
}) => {
  // useState: Controlar visibilidad de contraseña
  const [showPassword, setShowPassword] = useState(false);

  // Determinar el tipo real del input
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Composición de clases
  const containerClasses = [
    styles['input-container'],
    error && styles['input-container--error'],
    disabled && styles['input-container--disabled'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inputClasses = [
    styles.input,
    error && styles['input--error'],
    icon && styles['input--with-icon'],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {/* Label */}
      {label && (
        <label htmlFor={name} className={styles['input-label']}>
          {label}
          {required && <span className={styles['input-required']}>*</span>}
        </label>
      )}

      {/* Input wrapper para icono */}
      <div className={styles['input-wrapper']}>
        {/* Icono izquierdo */}
        {icon && <span className={styles['input-icon']}>{icon}</span>}

        {/* Input */}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        />

        {/* Toggle para contraseña */}
        {type === 'password' && (
          <button
            type="button"
            className={styles['input-toggle-password']}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}
      </div>

      {/* Mensaje de error */}
      {error && (
        <span id={`${name}-error`} className={styles['input-error']} role="alert">
          {error}
        </span>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <span className={styles['input-helper']}>{helperText}</span>
      )}
    </div>
  );
};

export default Input;