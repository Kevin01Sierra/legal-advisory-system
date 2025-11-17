import { 
  VALIDATION_RULES, 
  REGEX_PATTERNS, 
  ERROR_MESSAGES 
} from './constants';

/**
 * Validadores reutilizables con reglas centralizadas
 */
export const validators = {
  /**
   * Campo obligatorio
   */
  required: (value) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return ERROR_MESSAGES.REQUIRED_FIELD;
    }
    return null;
  },

  /**
   * Validar aceptación de términos (checkbox)
   */
  acceptTerms: (value) => {
    if (value !== true) {
      return 'Debes aceptar los términos y condiciones';
    }
    return null;
  },

  /**
   * Validar email
   */
  email: (value) => {
    if (!value) return null;
    
    if (!REGEX_PATTERNS.EMAIL.test(value)) {
      return ERROR_MESSAGES.INVALID_EMAIL;
    }
    
    if (value.length < VALIDATION_RULES.EMAIL.MIN_LENGTH) {
      return `El email debe tener al menos ${VALIDATION_RULES.EMAIL.MIN_LENGTH} caracteres`;
    }
    
    if (value.length > VALIDATION_RULES.EMAIL.MAX_LENGTH) {
      return `El email no puede exceder ${VALIDATION_RULES.EMAIL.MAX_LENGTH} caracteres`;
    }
    
    return null;
  },

  /**
   * Longitud mínima
   */
  minLength: (min) => (value) => {
    if (!value) return null;
    
    if (value.length < min) {
      return `Debe tener al menos ${min} caracteres`;
    }
    return null;
  },

  /**
   * Longitud máxima
   */
  maxLength: (max) => (value) => {
    if (!value) return null;
    
    if (value.length > max) {
      return `No puede exceder ${max} caracteres`;
    }
    return null;
  },

  /**
   * Validar contraseña
   */
  password: (value) => {
    if (!value) return null;
    
    if (value.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
      return ERROR_MESSAGES.PASSWORD_TOO_SHORT;
    }
    
    if (value.length > VALIDATION_RULES.PASSWORD.MAX_LENGTH) {
      return `La contraseña no puede exceder ${VALIDATION_RULES.PASSWORD.MAX_LENGTH} caracteres`;
    }
    
    if (VALIDATION_RULES.PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(value)) {
      return 'La contraseña debe contener al menos una mayúscula';
    }
    
    if (VALIDATION_RULES.PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(value)) {
      return 'La contraseña debe contener al menos una minúscula';
    }
    
    if (VALIDATION_RULES.PASSWORD.REQUIRE_NUMBER && !/\d/.test(value)) {
      return 'La contraseña debe contener al menos un número';
    }
    
    if (VALIDATION_RULES.PASSWORD.REQUIRE_SPECIAL && !/[@$!%*?&]/.test(value)) {
      return 'La contraseña debe contener al menos un carácter especial (@$!%*?&)';
    }
    
    return null;
  },

  /**
   * Confirmar que las contraseñas coinciden
   */
  matchPassword: (password) => (value) => {
    if (!value) return null;
    
    if (value !== password) {
      return ERROR_MESSAGES.PASSWORD_MISMATCH;
    }
    return null;
  },

  /**
   * Validar nombre (solo letras y espacios)
   */
  name: (value) => {
    if (!value) return null;
    
    if (value.length < VALIDATION_RULES.NAME.MIN_LENGTH) {
      return `El nombre debe tener al menos ${VALIDATION_RULES.NAME.MIN_LENGTH} caracteres`;
    }
    
    if (value.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
      return `El nombre no puede exceder ${VALIDATION_RULES.NAME.MAX_LENGTH} caracteres`;
    }
    
    if (!VALIDATION_RULES.NAME.PATTERN.test(value)) {
      return ERROR_MESSAGES.INVALID_NAME;
    }
    
    return null;
  },

  /**
   * Validar mensaje de chat
   */
  message: (value) => {
    if (!value || value.trim() === '') {
      return ERROR_MESSAGES.MESSAGE_EMPTY;
    }
    
    if (value.length < VALIDATION_RULES.MESSAGE.MIN_LENGTH) {
      return 'El mensaje no puede estar vacío';
    }
    
    if (value.length > VALIDATION_RULES.MESSAGE.MAX_LENGTH) {
      return ERROR_MESSAGES.MESSAGE_TOO_LONG;
    }
    
    return null;
  },

  /**
   * Validar teléfono
   */
  phone: (value) => {
    if (!value) return null;
    
    if (!REGEX_PATTERNS.PHONE.test(value)) {
      return 'Número de teléfono inválido';
    }
    
    return null;
  },

  /**
   * Validar URL
   */
  url: (value) => {
    if (!value) return null;
    
    if (!REGEX_PATTERNS.URL.test(value)) {
      return 'URL inválida';
    }
    
    return null;
  },

  /**
   * Valor numérico
   */
  number: (value) => {
    if (!value) return null;
    
    if (isNaN(value)) {
      return 'Debe ser un número válido';
    }
    
    return null;
  },

  /**
   * Rango numérico
   */
  range: (min, max) => (value) => {
    if (!value) return null;
    
    const num = Number(value);
    if (isNaN(num)) {
      return 'Debe ser un número válido';
    }
    
    if (num < min || num > max) {
      return `El valor debe estar entre ${min} y ${max}`;
    }
    
    return null;
  },

  /**
   * Valor mínimo
   */
  min: (minValue) => (value) => {
    if (!value) return null;
    
    const num = Number(value);
    if (isNaN(num)) {
      return 'Debe ser un número válido';
    }
    
    if (num < minValue) {
      return `El valor mínimo es ${minValue}`;
    }
    
    return null;
  },

  /**
   * Valor máximo
   */
  max: (maxValue) => (value) => {
    if (!value) return null;
    
    const num = Number(value);
    if (isNaN(num)) {
      return 'Debe ser un número válido';
    }
    
    if (num > maxValue) {
      return `El valor máximo es ${maxValue}`;
    }
    
    return null;
  },

  /**
   * Patrón personalizado
   */
  pattern: (regex, message = 'Formato inválido') => (value) => {
    if (!value) return null;
    
    if (!regex.test(value)) {
      return message;
    }
    
    return null;
  },
};

/**
 * Ejecutar validaciones en un campo
 */
export const validateField = (value, validations, fieldName = '') => {
  if (!validations || validations.length === 0) return null;

  if (Array.isArray(validations)) {
    for (const validation of validations) {
      const error = validation(value);
      if (error) return error;
    }
    return null;
  }

  if (typeof validations === 'function') {
    return validations(value);
  }

  return null;
};

/**
 * Validar múltiples campos a la vez
 */
export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach((fieldName) => {
    const value = values[fieldName];
    const fieldRules = rules[fieldName];
    const error = validateField(value, fieldRules, fieldName);
    
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

/**
 * Verificar si un formulario es válido
 */
export const isFormValid = (values, rules) => {
  const errors = validateForm(values, rules);
  return Object.keys(errors).length === 0;
};

/**
 * Obtener fuerza de contraseña (0-4)
 */
export const getPasswordStrength = (password) => {
  if (!password) return 0;
  
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;
  
  return Math.min(strength, 4);
};

/**
 * Obtener mensaje de fuerza de contraseña
 */
export const getPasswordStrengthInfo = (password) => {
  const strength = getPasswordStrength(password);
  
  const info = {
    0: { message: 'Muy débil', color: 'error' },
    1: { message: 'Débil', color: 'error' },
    2: { message: 'Regular', color: 'warning' },
    3: { message: 'Fuerte', color: 'success' },
    4: { message: 'Muy fuerte', color: 'success' },
  };
  
  return {
    strength,
    ...info[strength]
  };
};

// Export default
export default validators;

// ============================================
// EXPORTS INDIVIDUALES para compatibilidad
// ============================================
export const validateEmail = validators.email;
export const validatePassword = validators.password;
export const validateName = validators.name;
export const validateRequired = validators.required;
export const validateAcceptTerms = validators.acceptTerms;
export const validatePasswordMatch = validators.matchPassword;
export const validateMinLength = validators.minLength;
export const validateMaxLength = validators.maxLength;
export const validatePhoneNumber = validators.phone;
export const validateURL = validators.url;
export const validateMessage = validators.message;
export const validateNumber = validators.number;
export const validateRange = validators.range;
export const validateMin = validators.min;
export const validateMax = validators.max;
export const validatePattern = validators.pattern;