import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { 
  STORAGE_KEYS, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES 
} from '../utils/constants';

/**
 * Context para la autenticación
 * Maneja el estado del usuario, token y operaciones de auth
 */
export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * useEffect: Cargar datos del usuario desde localStorage al montar
   * Dependencias: [] - Solo se ejecuta una vez al montar
   */
  useEffect(() => {
    const initAuth = () => {
      try {
        const savedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (savedToken && savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error('Error al cargar datos de autenticación:', err);
        // Limpiar datos corruptos
        authService.clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * useCallback: Login - Memoriza la función para evitar re-renders
   */
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const data = await authService.login(email, password);

      // authService.login ya guarda el token automáticamente
      setUser(data.user);
      console.log('✅ Usuario logueado:', data.user);
      console.log('✅ isAuthenticated:', authService.isAuthenticated());

      return { 
        success: true, 
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        user: data.user
      };
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.INVALID_CREDENTIALS;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * useCallback: Register - Memoriza la función
   */
  const register = useCallback(async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const data = await authService.register(formData);

      // authService.register ya guarda el token automáticamente
      setUser(data.user);

      return { 
        success: true, 
        message: SUCCESS_MESSAGES.REGISTER_SUCCESS 
      };
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * useCallback: Logout - Limpiar estado y localStorage
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      // Llamar al servicio de logout (limpia datos locales)
      await authService.logout();
      
      // Limpiar estado
      setUser(null);
      setError(null);

      return { 
        success: true, 
        message: SUCCESS_MESSAGES.LOGOUT_SUCCESS 
      };
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      
      // Limpiar datos locales aunque falle
      authService.clearAuthData();
      setUser(null);
      setError(null);

      return { 
        success: true, 
        message: SUCCESS_MESSAGES.LOGOUT_SUCCESS 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * useCallback: Verificar si la sesión es válida
   */
  const checkAuth = useCallback(async () => {
    try {
      if (!authService.isAuthenticated()) {
        setUser(null);
        return false;
      }

      const userData = await authService.getCurrentUser();
      setUser(userData);
      return true;
    } catch (err) {
      console.error('Error al verificar autenticación:', err);
      
      // Si falla, limpiar sesión
      authService.clearAuthData();
      setUser(null);
      
      return false;
    }
  }, []);

  /**
   * useCallback: Actualizar datos del usuario
   */
  const updateUser = useCallback((updatedData) => {
    setUser(prevUser => {
      const newUser = { ...prevUser, ...updatedData };
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  /**
   * useCallback: Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Valor del contexto
  const value = {
    user,
    loading,
    error,
    isAuthenticated: authService.isAuthenticated(),
    login,
    register,
    logout,
    checkAuth,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};