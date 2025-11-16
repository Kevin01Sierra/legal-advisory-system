import React, { useEffect } from 'react';
import { AuthLayout } from './AuthLayout';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { useForm } from '../../hooks/useForm';
import { validators } from '../../utils/validators';
import styles from '../../styles/components/Auth.module.css';

/**
 * Formulario de Login
 * Componente contenedor que maneja la lógica de autenticación
 * 
 * Props:
 * - onSwitchToRegister: callback para cambiar a registro
 */
export const LoginForm = ({ onSwitchToRegister }) => {
  // Context: Autenticación
  const { login, error: authError, clearError } = useAuth();
  
  // Context: Notificaciones
  const toast = useToast();

  // Valores iniciales del formulario
  const initialValues = {
    email: '',
    password: '',
  };

  // Reglas de validación por campo
  const validationRules = {
    email: [validators.required, validators.email],
    password: [validators.required, validators.minLength(6)],
  };

  // Custom hook: Gestión del formulario
  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    hasError,
  } = useForm(initialValues, validationRules, onSubmit);

  /**
   * Función de submit del formulario
   */
  async function onSubmit(formValues) {
    const result = await login(formValues.email, formValues.password);

    if (result.success) {
      toast.success('¡Bienvenido de nuevo!');
    } else {
      toast.error(result.error || 'Error al iniciar sesión');
    }
  }

  /**
   * useEffect: Limpiar errores del contexto al desmontar
   * Cleanup function para evitar fugas de memoria
   */
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  /**
   * useEffect: Mostrar errores del contexto de auth
   * Se ejecuta cuando cambia authError
   */
  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
  }, [authError, toast]);

  return (
    <AuthLayout
      title="Iniciar Sesión"
      subtitle="Accede a tu cuenta para comenzar"
    >
      <div className={styles['auth-form']}>
        {/* Email Input */}
        <Input
          name="email"
          type="email"
          label="Correo Electrónico"
          placeholder="tu@email.com"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={hasError('email') ? errors.email : null}
          required
          icon={<span>📧</span>}
          autoComplete="email"
        />

        {/* Password Input */}
        <Input
          name="password"
          type="password"
          label="Contraseña"
          placeholder="••••••••"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={hasError('password') ? errors.password : null}
          required
          icon={<span>🔒</span>}
          autoComplete="current-password"
        />

        {/* Forgot Password Link */}
        <div className={styles['auth-form__link-container']}>
          <button
            type="button"
            className={styles['auth-form__link']}
            onClick={() => toast.info('Funcionalidad en desarrollo')}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>

        {/* Divider */}
        <div className={styles['auth-divider']}>
          <span className={styles['auth-divider__line']}></span>
          <span className={styles['auth-divider__text']}>o</span>
          <span className={styles['auth-divider__line']}></span>
        </div>

        {/* Switch to Register */}
        <div className={styles['auth-form__switch']}>
          <p className={styles['auth-form__switch-text']}>
            ¿No tienes una cuenta?{' '}
            <button
              type="button"
              className={styles['auth-form__switch-link']}
              onClick={onSwitchToRegister}
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};