/**
 * LoginForm.jsx
 * Formulario de inicio de sesión
 * Actualizado para usar constants.js
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useForm } from '../../hooks/useForm';
import { validateEmail, validateRequired } from '../../utils/validators';
import Input from '../common/Input';
import Button from '../common/Button';
import Loading from '../common/Loading';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROUTES,
  AUTH_CONFIG
} from '../../utils/constants';
import styles from '../../styles/components/Auth.module.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Configuración del formulario
  const { values, errors, touched, handleChange, handleBlur, validateForm } = useForm({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validations: {
      email: [
        { validator: validateRequired, message: ERROR_MESSAGES.REQUIRED_FIELD },
        { validator: validateEmail, message: ERROR_MESSAGES.INVALID_EMAIL }
      ],
      password: [
        { validator: validateRequired, message: ERROR_MESSAGES.REQUIRED_FIELD }
      ]
    }
  });

  // Handler para enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si está bloqueado por intentos fallidos
    if (isLocked) {
      showToast(
        `Demasiados intentos fallidos. Espera ${AUTH_CONFIG.LOCKOUT_DURATION_MINUTES} minutos.`,
        'error'
      );
      return;
    }

    // Validar formulario
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      showToast('Por favor, corrige los errores en el formulario', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Intentar login
      await login(values.email, values.password, values.rememberMe);
      
      // Login exitoso
      showToast(SUCCESS_MESSAGES.LOGIN_SUCCESS, 'success');
      setLoginAttempts(0);
      
      // Redirigir al chat
      setTimeout(() => {
      navigate(ROUTES.CHAT);
      }, 300);
      
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      
      // Incrementar intentos fallidos
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      // Verificar si se alcanzó el máximo de intentos
      if (newAttempts >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS) {
        setIsLocked(true);
        showToast(
          `Demasiados intentos fallidos. Cuenta bloqueada por ${AUTH_CONFIG.LOCKOUT_DURATION_MINUTES} minutos.`,
          'error'
        );
        
        // Desbloquear después del tiempo configurado
        setTimeout(() => {
          setIsLocked(false);
          setLoginAttempts(0);
        }, AUTH_CONFIG.LOCKOUT_DURATION_MINUTES * 60 * 1000);
      } else {
        // Mostrar error específico
        const errorMessage = error.response?.data?.detail || 
                           error.message || 
                           ERROR_MESSAGES.INVALID_CREDENTIALS;
        showToast(errorMessage, 'error');
        
        // Mostrar intentos restantes
        const attemptsLeft = AUTH_CONFIG.MAX_LOGIN_ATTEMPTS - newAttempts;
        if (attemptsLeft > 0 && attemptsLeft <= 3) {
          showToast(
            `Intentos restantes: ${attemptsLeft}`,
            'warning'
          );
        }
      }
    }
  };

  // Toggle mostrar contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.authForm}>
      {/* Header */}
      <div className={styles.authHeader}>
        <div className={styles.authIcon}>⚖️</div>
        <h2 className={styles.authTitle}>Iniciar Sesión</h2>
        <p className={styles.authSubtitle}>
          Accede a tu cuenta para comenzar a consultar
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Email */}
        <Input
          id="email"
          name="email"
          type="email"
          label="Correo Electrónico"
          placeholder="tu@email.com"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email && errors.email}
          disabled={isLoading || isLocked}
          required
          autoComplete="email"
          autoFocus
        />

        {/* Password */}
        <div className={styles.passwordField}>
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Contraseña"
            placeholder="••••••••"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && errors.password}
            disabled={isLoading || isLocked}
            required
            autoComplete="current-password"
          />
          
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={styles.passwordToggle}
            disabled={isLoading || isLocked}
            tabIndex="-1"
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>

        {/* Opciones adicionales */}
        <div className={styles.formOptions}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="rememberMe"
              checked={values.rememberMe}
              onChange={handleChange}
              disabled={isLoading || isLocked}
              className={styles.checkbox}
            />
            <span>Recordarme</span>
          </label>

          <Link 
            to="/forgot-password" 
            className={styles.forgotPassword}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Botón de submit */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isLoading || isLocked}
          className={styles.submitButton}
        >
          {isLoading ? (
            <Loading size="small" text="Iniciando sesión..." />
          ) : isLocked ? (
            'Cuenta bloqueada'
          ) : (
            'Iniciar Sesión'
          )}
        </Button>

        {/* Indicador de intentos */}
        {loginAttempts > 0 && loginAttempts < AUTH_CONFIG.MAX_LOGIN_ATTEMPTS && (
          <div className={styles.warningMessage}>
            ⚠️ Intentos fallidos: {loginAttempts}/{AUTH_CONFIG.MAX_LOGIN_ATTEMPTS}
          </div>
        )}

        {/* Link a registro */}
        <div className={styles.formFooter}>
          <p className={styles.footerText}>
            ¿No tienes una cuenta?{' '}
            <Link to={ROUTES.REGISTER} className={styles.footerLink}>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </form>

      {/* Demo credentials (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className={styles.demoCredentials}>
          <p className={styles.demoTitle}>🔧 Demo Credentials:</p>
          <p className={styles.demoText}>
            Email: demo@legal.com<br />
            Password: demo123
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;