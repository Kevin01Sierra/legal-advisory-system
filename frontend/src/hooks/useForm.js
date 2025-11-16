import { useState, useCallback } from 'react';
import { validateField } from '../utils/validators';

/**
 * Hook personalizado para gestión de formularios
 * Incluye validación, manejo de errores y estados
 * 
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Object} validationRules - Reglas de validación por campo
 * @param {Function} onSubmit - Callback al enviar el formulario
 */
export const useForm = (initialValues = {}, validationRules = {}, onSubmit) => {
  // Estado del formulario (objeto con todos los campos)
  const [values, setValues] = useState(initialValues);

  // Errores por campo
  const [errors, setErrors] = useState({});

  // Estado de campos "tocados" (el usuario interactuó)
  const [touched, setTouched] = useState({});

  // Estado de envío
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Manejo de cambios en inputs (múltiples inputs con un solo handler)
   * Usa e.target.name para identificar dinámicamente el campo
   */
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      // Actualizar valor usando estado anterior
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));

      // Validar el campo si tiene reglas
      if (validationRules[name]) {
        const error = validateField(value, validationRules[name]);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: error,
        }));
      }
    },
    [validationRules]
  );

  /**
   * Marcar campo como "tocado" al perder foco
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
  }, []);

  /**
   * Validar todos los campos
   */
  const validateAll = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(values[fieldName], validationRules[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  /**
   * Enviar formulario
   */
  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      // Marcar todos los campos como tocados
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      // Validar
      const isValid = validateAll();

      if (!isValid) {
        return;
      }

      // Ejecutar callback de submit
      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Error en submit:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validateAll, onSubmit]
  );

  /**
   * Resetear formulario
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Verificar si un campo tiene error visible
   */
  const hasError = useCallback(
    (fieldName) => {
      return touched[fieldName] && errors[fieldName];
    },
    [touched, errors]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    hasError,
    setValues,
    setErrors,
  };
};