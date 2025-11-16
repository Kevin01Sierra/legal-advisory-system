import React, { useEffect, useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { useForm } from '../../hooks/useForm';
import { validators } from '../../utils/validators';
import styles from '../../styles/components/Auth.module.css';

/**
 * Formulario de Registro
 * Incluye validación de confirmación de contraseña
 * 
 * Props:
 * - onSwitchToLogin: callback para cambiar a login
 */
export const RegisterForm = ({ onSwitchToLogin }) => {
  // Context: Autenticación
  const { register, error: authError, clearError } = useAuth();
  
  // Context: Notificaciones
  const toast = useToast();

  // useState: Fortaleza de contraseña
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    color: '',
  });

  // Valores iniciales del formulario
  const initialValues = {
    email: '',
    nombre: '',
    apellido: '',
    password: '',
    confirmPassword: '',
  };

  // Reglas de validación (sin confirmPassword inicialmente)
  const validationRules = {
    email: [validators.required, validators.email],
    nombre: [validators.required, validators.minLength(2)],
    apellido: [], // Opcional
    password: [validators.required, validators.password],
    confirmPassword: [], // Se validará dinámicamente
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
    setErrors,
  } = useForm(initialValues, validationRules, onSubmit);

  /**
   * useEffect: Validar confirmación de contraseña
   * Se ejecuta cada vez que cambia password o confirmPassword
   * Demostración de validación basada en estado anterior
   */
  useEffect(() => {
    if (values.confirmPassword && values.password !== values.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: 'Las contraseñas no coinciden',
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  }, [values.password, values.confirmPassword, setErrors]);

  /**
   * useEffect: Calcular fortaleza de contraseña
   * Demostración de useEffect con cálculos basados en estado
   */
  useEffect(() => {
    const password = values.password;
    
    if (!password) {
      setPasswordStrength({ score: 0, label: '', color: '' });
      return;
    }

    let score = 0;

    // Criterios de fortaleza
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    // Determinar etiqueta y color
    const strengths = {
      0: { label: '', color: '' },
      1: { label: 'Muy débil', color: '#ef4444' },
      2: { label: 'Débil', color: '#f59e0b' },
      3: { label: 'Regular', color: '#eab308' },
      4: { label: 'Fuerte', color: '#22c55e' },
      5: { label: 'Muy fuerte', color: '#10b981' },
    };

    setPasswordStrength(strengths[score]);
  }, [values.password]);

  /**
   * Función de submit del formulario
   */
  async function onSubmit(formValues) {
    // Validación final de contraseñas
    if (formValues.password !== formValues.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    // Eliminar confirmPassword antes de enviar
    const { confirmPassword, ...dataToSend } = formValues;

    const result = await register(dataToSend);

    if (result.success) {
      toast.success('¡Cuenta creada exitosamente!');
    } else {
      toast.error(result.error || 'Error al registrarse');
    }
  }

  /**
   * useEffect: Cleanup
   */
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  /**
   * useEffect: Mostrar errores del contexto
   */
  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
  }, [authError, toast]);

  return (
    <AuthLayout
      title="Crear Cuenta"
      subtitle="Regístrate para acceder al sistema"
    >
      <div className={styles['auth-form']}>
        {/* Email */}
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

        {/* Nombre y Apellido (Grid) */}
        <div className={styles['auth-form__grid']}>
          <Input
            name="nombre"
            type="text"
            label="Nombre"
            placeholder="Juan"
            value={values.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            error={hasError('nombre') ? errors.nombre : null}
            required
            icon={<span>👤</span>}
            autoComplete="given-name"
          />

          <Input
            name="apellido"
            type="text"
            label="Apellido"
            placeholder="Pérez"
            value={values.apellido}
            onChange={handleChange}
            onBlur={handleBlur}
            error={hasError('apellido') ? errors.apellido : null}
            icon={<span>👤</span>}
            autoComplete="family-name"
            helperText="Opcional"
          />
        </div>

        {/* Password con indicador de fortaleza */}
        <div>
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
            autoComplete="new-password"
          />

          {/* Indicador de fortaleza */}
          {values.password && passwordStrength.label && (
            <div className={styles['password-strength']}>
              <div className={styles['password-strength__bar']}>
                <div
                  className={styles['password-strength__fill']}
                  style={{
                    width: `${(passwordStrength.score / 5) * 100}%`,
                    backgroundColor: passwordStrength.color,
                  }}
                ></div>
              </div>
              <span
                className={styles['password-strength__label']}
                style={{ color: passwordStrength.color }}
              >
                {passwordStrength.label}
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <Input
          name="confirmPassword"
          type="password"
          label="Confirmar Contraseña"
          placeholder="••••••••"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={hasError('confirmPassword') ? errors.confirmPassword : null}
          required
          icon={<span>🔒</span>}
          autoComplete="new-password"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
        </Button>

        {/* Terms */}
        <p className={styles['auth-terms']}>
          Al registrarte, aceptas los{' '}
          <button
            type="button"
            className={styles['auth-terms__link']}
            onClick={() => toast.info('Términos y condiciones')}
          >
            Términos de Servicio
          </button>
        </p>

        {/* Divider */}
        <div className={styles['auth-divider']}>
          <span className={styles['auth-divider__line']}></span>
          <span className={styles['auth-divider__text']}>o</span>
          <span className={styles['auth-divider__line']}></span>
        </div>

        {/* Switch to Login */}
        <div className={styles['auth-form__switch']}>
          <p className={styles['auth-form__switch-text']}>
            ¿Ya tienes una cuenta?{' '}
            <button
              type="button"
              className={styles['auth-form__switch-link']}
              onClick={onSwitchToLogin}
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};