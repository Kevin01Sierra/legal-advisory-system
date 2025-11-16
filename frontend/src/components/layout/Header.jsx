import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Layout.module.css';

const Header = () => {
  const { user, logout } = useAuth();
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
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
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
              <h1 className={styles.appTitle}>Sistema de Asesoría Legal</h1>
              <p className={styles.appSubtitle}>Código Penal Colombiano</p>
            </div>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.userSection} ref={menuRef}>
            <button
              className={styles.userButton}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <span className={styles.userAvatar}>
                {user.name?.charAt(0).toUpperCase()}
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