import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

/**
 * Context para la autenticación
 * Maneja el estado del usuario, token y operaciones de auth
 */
const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * useEffect: Cargar datos del usuario desde localStorage al montar
   * Dependencias: [] - Solo se ejecuta una vez al montar
   */
  useEffect(() => {
    const initAuth = () => {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error('Error al cargar datos de autenticación:', err);
        // Limpiar datos corruptos
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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

      // Guardar en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Actualizar estado
      setToken(data.token);
      setUser(data.user);

      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Error al iniciar sesión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
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

      // Guardar en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Actualizar estado
      setToken(data.token);
      setUser(data.user);

      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Error al registrarse';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * useCallback: Logout - Limpiar estado y localStorage
   */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
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
    token,
    loading,
    error,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook personalizado para usar el AuthContext
 * Incluye validación para asegurar que se usa dentro del Provider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return context;
};