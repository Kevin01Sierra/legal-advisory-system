/**
 * Validadores reutilizables
 */
export const validators = {
  required: (value) => {
    if (!value || value.trim() === '') {
      return 'Este campo es obligatorio';
    }
    return null;
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Email inválido';
    }
    return null;
  },

  minLength: (min) => (value) => {
    if (value.length < min) {
      return `Debe tener al menos ${min} caracteres`;
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (value.length > max) {
      return `No puede exceder ${max} caracteres`;
    }
    return null;
  },

  password: (value) => {
    if (value.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return null;
  },

  matchPassword: (password) => (value) => {
    if (value !== password) {
      return 'Las contraseñas no coinciden';
    }
    return null;
  },
};

/**
 * Ejecutar validaciones en un campo
 */
export const validateField = (value, validations) => {
  if (!validations) return null;

  for (const validation of validations) {
    const error = validation(value);
    if (error) return error;
  }

  return null;
};