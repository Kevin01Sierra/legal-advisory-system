/**
 * AuthLayout.jsx
 * Layout compartido para páginas de autenticación
 * ACTUALIZADO con export default
 */

import React from 'react';
import { APP_NAME, LEGAL_INFO } from '../../utils/constants';
import styles from '../../styles/components/Auth.module.css';

const AuthLayout = ({ children }) => {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        {/* Header */}
        <div className={styles.authHeader}>
          <div className={styles.authLogo}>⚖️</div>
          <h1 className={styles.authTitle}>{APP_NAME}</h1>
          <p className={styles.authSubtitle}>
            {LEGAL_INFO.CODE_NAME}
          </p>
        </div>

        {/* Body - aquí va el formulario (LoginForm o RegisterForm) */}
        <div className={styles.authBody}>
          {children}
        </div>

        {/* Footer */}
        <div className={styles.authFooter}>
          <p className={styles.footerText}>
            {LEGAL_INFO.COPYRIGHT}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;