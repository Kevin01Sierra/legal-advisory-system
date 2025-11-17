/**
 * RegisterForm.jsx
 * Formulario de registro de usuarios
 * Actualizado para usar constants.js
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useForm } from '../../hooks/useForm';
import {
  validateEmail,
  validatePassword,
  validateName,
  validateRequired,
  validateAcceptTerms
} from '../../utils/validators';
import Input from '../common/Input';
import Button from '../common/Button';
import Loading from '../common/Loading';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROUTES,
  VALIDATION_RULES
} from '../../utils/constants';
import styles from '../../styles/components/Auth.module.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Configuración del formulario
  const { values, errors, touched, handleChange, handleBlur, validateForm } = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    },
    validations: {
      name: [
        { validator: validateRequired, message: ERROR_MESSAGES.REQUIRED_FIELD },
        { validator: validateName, message: ERROR_MESSAGES.INVALID_NAME }
      ],
      email: [
        { validator: validateRequired, message: ERROR_MESSAGES.REQUIRED_FIELD },
        { validator: validateEmail, message: ERROR_MESSAGES.INVALID_EMAIL }
      ],
      password: [
        { validator: validateRequired, message: ERROR_MESSAGES.REQUIRED_FIELD },
        { validator: validatePassword, message: ERROR_MESSAGES.PASSWORD_TOO_SHORT }
      ],
      confirmPassword: [
        { validator: validateRequired, message: ERROR_MESSAGES.REQUIRED_FIELD },
        {
          validator: (value, formValues)  => {
          if (value !== formValues.password) {
            return false; // Retorna false para indicar error
          }
          return null; // null = sin error
        },
          message: ERROR_MESSAGES.PASSWORD_MISMATCH
        }
      ],
      acceptTerms: [
        { validator: validateAcceptTerms , message: ERROR_MESSAGES.ACCEPT_TERMS }
      ]
    }
  });

  // Calcular fuerza de la contraseña
  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, text: '', color: '' };
    
    let strength = 0;
    
    if (password.length >= VALIDATION_RULES.PASSWORD.MIN_LENGTH) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { level: 1, text: 'Débil', color: '#ef4444' };
    if (strength <= 4) return { level: 2, text: 'Media', color: '#f59e0b' };
    return { level: 3, text: 'Fuerte', color: '#10b981' };
  };

  const passwordStrength = getPasswordStrength(values.password);

  // Handler para enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (values.password !== values.confirmPassword) {
    showToast(ERROR_MESSAGES.PASSWORD_MISMATCH, 'error');
    return;
  }

    // Validar formulario
    const formErrors = validateForm();
    console.log('Errores de validación:', formErrors);
    if (Object.keys(formErrors).length > 0) {
      showToast('Por favor, corrige los errores en el formulario', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Registrar usuario
      await register({
        name: values.name,
        email: values.email,
        password: values.password
      });

      // Registro exitoso
      showToast(SUCCESS_MESSAGES.REGISTER_SUCCESS, 'success');
      console.log('Usuario registrado:', values.email);
      
      // Redirigir al chat
      setTimeout(() => {
        navigate(ROUTES.CHAT);
      }, 1000);
      
    } catch (error) {
      console.error('Register error:', error);
      
      // Mostrar error específico
      let errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
      
      if (error.response?.status === 409) {
        errorMessage = ERROR_MESSAGES.EMAIL_ALREADY_EXISTS;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle mostrar contraseñas
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className={styles.authForm}>
      {/* Header */}
      <div className={styles.authHeader}>
        <div className={styles.authIcon}>⚖️</div>
        <h2 className={styles.authTitle}>Crear Cuenta</h2>
        <p className={styles.authSubtitle}>
          Regístrate para acceder al sistema de asesoría legal
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Nombre completo */}
        <Input
          id="name"
          name="name"
          type="text"
          label="Nombre Completo"
          placeholder="Juan Pérez"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name && errors.name}
          disabled={isLoading}
          required
          autoComplete="name"
          autoFocus
          maxLength={VALIDATION_RULES.NAME.MAX_LENGTH}
        />

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
          disabled={isLoading}
          required
          autoComplete="email"
          maxLength={VALIDATION_RULES.EMAIL.MAX_LENGTH}
        />

        {/* Contraseña */}
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
            disabled={isLoading}
            required
            autoComplete="new-password"
            maxLength={VALIDATION_RULES.PASSWORD.MAX_LENGTH}
          />
          
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={styles.passwordToggle}
            disabled={isLoading}
            tabIndex="-1"
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>

        {/* Indicador de fuerza de contraseña */}
        {values.password && (
          <div className={styles.passwordStrength}>
            <div className={styles.strengthBar}>
              <div 
                className={styles.strengthFill}
                style={{ 
                  width: `${(passwordStrength.level / 3) * 100}%`,
                  backgroundColor: passwordStrength.color
                }}
              />
            </div>
            <span 
              className={styles.strengthText}
              style={{ color: passwordStrength.color }}
            >
              Seguridad: {passwordStrength.text}
            </span>
          </div>
        )}

        {/* Confirmar contraseña */}
        <div className={styles.passwordField}>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirmar Contraseña"
            placeholder="••••••••"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.confirmPassword && errors.confirmPassword}
            disabled={isLoading}
            required
            autoComplete="new-password"
            maxLength={VALIDATION_RULES.PASSWORD.MAX_LENGTH}
          />
          
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className={styles.passwordToggle}
            disabled={isLoading}
            tabIndex="-1"
          >
            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>

        {/* Términos y condiciones */}
        <div className={styles.termsField}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="acceptTerms"
              checked={values.acceptTerms}
              onChange={handleChange}
              disabled={isLoading}
              className={styles.checkbox}
            />
            <span>
              Acepto los{' '}
              <Link to="/terms" className={styles.link} target="_blank">
                términos y condiciones
              </Link>
              {' '}y la{' '}
              <Link to="/privacy" className={styles.link} target="_blank">
                política de privacidad
              </Link>
            </span>
          </label>
          {touched.acceptTerms && errors.acceptTerms && (
            <span className={styles.fieldError}>{errors.acceptTerms}</span>
          )}
        </div>

        {/* Botón de submit */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? (
            <Loading size="small" text="Creando cuenta..." />
          ) : (
            'Crear Cuenta'
          )}
        </Button>

        {/* Link a login */}
        <div className={styles.formFooter}>
          <p className={styles.footerText}>
            ¿Ya tienes una cuenta?{' '}
            <Link to={ROUTES.LOGIN} className={styles.footerLink}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;