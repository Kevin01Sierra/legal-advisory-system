/**
 * Header.jsx
 * Componente de encabezado principal
 * Actualizado para usar constants.js
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { 
  APP_NAME, 
  LEGAL_INFO, 
  ROUTES, 
  SUCCESS_MESSAGES 
} from '../../utils/constants';
import styles from './Layout.module.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      showToast(SUCCESS_MESSAGES.LOGOUT_SUCCESS, 'success');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      showToast('Error al cerrar sesión', 'error');
    }
  };

  if (!user) return null;

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.headerLeft}>
          <div className={styles.appLogo}>
            <span className={styles.logoIcon}>⚖️</span>
            <div className={styles.logoContent}>
              <h1 className={styles.appTitle}>{APP_NAME}</h1>
              <p className={styles.appSubtitle}>{LEGAL_INFO.CODE_NAME}</p>
            </div>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.userSection} ref={menuRef}>
            <button
              className={styles.userButton}
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="Menú de usuario"
              aria-expanded={showUserMenu}
            >
              <span className={styles.userAvatar}>
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.dropdownArrow}>
                {showUserMenu ? '▲' : '▼'}
              </span>
            </button>

            {showUserMenu && (
              <div className={styles.userDropdown}>
                <div className={styles.userInfo}>
                  <p className={styles.userFullName}>{user.name}</p>
                  <p className={styles.userEmail}>{user.email}</p>
                </div>
                <div className={styles.dropdownDivider}></div>
                <button
                  className={styles.logoutButton}
                  onClick={handleLogout}
                >
                  <span>🚪</span>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;