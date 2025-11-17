/**
 * useForm.js
 * Hook personalizado para manejar formularios
 * CORREGIDO: validateForm como función
 */

import { useState, useCallback } from 'react';

export const useForm = ({ initialValues = {}, validations = {} }) => {
  // Estado del formulario
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /**
   * Validar un campo individual
   */
  const validateField = useCallback((name, value) => {
    const fieldValidations = validations[name];
    
    if (!fieldValidations || fieldValidations.length === 0) {
      return null;
    }

    // Si es un array de validaciones
    if (Array.isArray(fieldValidations)) {
      for (const validation of fieldValidations) {
        // Si la validación es un objeto con validator y message
        if (validation.validator) {
          const error = validation.validator(value, values);
          if (error !== null) {
            return validation.message || error;
          }
        }
        // Si es una función directa
        else if (typeof validation === 'function') {
          const error = validation(value, values);
          if (error) {
            return error;
          }
        }
      }
    }
    // Si es una función directa
    else if (typeof fieldValidations === 'function') {
      return fieldValidations(value, values);
    }

    return null;
  }, [validations, values]);

  /**
   * Validar todos los campos del formulario
   */
  const validateForm = useCallback(() => {
    const newErrors = {};

    Object.keys(validations).forEach((fieldName) => {
      const value = values[fieldName];
      const error = validateField(fieldName, value);
      
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return newErrors;
  }, [values, validations, validateField]);

  /**
   * Manejar cambios en los inputs
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Validar en tiempo real si el campo ya fue tocado
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error || undefined,
      }));
    }
  }, [touched, validateField]);

  /**
   * Manejar blur (cuando el usuario sale del campo)
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validar el campo cuando pierde el foco
    const error = validateField(name, values[name]);
    setErrors((prev) => ({
      ...prev,
      [name]: error || undefined,
    }));
  }, [values, validateField]);

  /**
   * Establecer un valor manualmente
   */
  const setValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /**
   * Establecer múltiples valores
   */
  const setFormValues = useCallback((newValues) => {
    setValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  /**
   * Establecer un error manualmente
   */
  const setError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  /**
   * Limpiar errores
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Resetear el formulario
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  /**
   * Verificar si el formulario es válido
   */
  const isValid = useCallback(() => {
    const formErrors = validateForm();
    return Object.keys(formErrors).length === 0;
  }, [validateForm]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setValue,
    setFormValues,
    setError,
    clearErrors,
    resetForm,
    validateForm,
    validateField,
    isValid,
  };
};

export default useForm;