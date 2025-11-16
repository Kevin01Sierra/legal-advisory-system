import React from 'react';
import styles from '../../styles/components/Auth.module.css';

/**
 * Layout compartido para páginas de autenticación
 * Componente presentacional que proporciona estructura visual consistente
 * 
 * Props:
 * - children: contenido del formulario
 * - title: título principal
 * - subtitle: subtítulo descriptivo
 */
export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className={styles['auth-container']}>
      {/* Fondo decorativo con gradiente animado */}
      <div className={styles['auth-background']}>
        <div className={styles['auth-background__shape1']}></div>
        <div className={styles['auth-background__shape2']}></div>
      </div>

      {/* Contenido principal */}
      <div className={styles['auth-content']}>
        {/* Logo y branding */}
        <div className={styles['auth-branding']}>
          <div className={styles['auth-logo']}>
            <span className={styles['auth-logo__icon']}>⚖️</span>
          </div>
          <h1 className={styles['auth-title']}>Asesoría Legal IA</h1>
          <p className={styles['auth-description']}>
            Sistema de consulta del Código Penal Colombiano
          </p>
        </div>

        {/* Card del formulario */}
        <div className={styles['auth-card']}>
          <div className={styles['auth-card__header']}>
            <h2 className={styles['auth-card__title']}>{title}</h2>
            {subtitle && (
              <p className={styles['auth-card__subtitle']}>{subtitle}</p>
            )}
          </div>

          <div className={styles['auth-card__body']}>
            {children}
          </div>
        </div>

        {/* Footer */}
        <footer className={styles['auth-footer']}>
          <p className={styles['auth-footer__text']}>
            © 2025 Sistema de Asesoría Legal IA
          </p>
        </footer>
      </div>
    </div>
  );
};