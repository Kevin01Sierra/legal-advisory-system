/**
 * ErrorBoundary.jsx
 * Componente para capturar y manejar errores de React
 * Actualizado para usar constants.js
 */

import React from 'react';
import Button from './Button';
import { 
  ERROR_MESSAGES,
  APP_NAME,
  LEGAL_INFO,
  DEBUG 
} from '../../utils/constants';
import styles from '../../styles/components/Common.module.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Actualizar el estado para mostrar la UI de error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log del error
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Actualizar estado con información del error
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // En producción, aquí podrías enviar el error a un servicio de logging
    if (!DEBUG.ENABLED) {
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error, errorInfo) => {
    // Aquí implementarías el envío a un servicio como Sentry, LogRocket, etc.
    // Por ahora solo registramos en consola
    console.log('Logging error to service:', {
      error: error.toString(),
      errorInfo: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorCount } = this.state;
      
      // Si hay demasiados errores consecutivos, mostrar opción de reload completo
      const tooManyErrors = errorCount > 3;

      return (
        <div className={styles.errorBoundary}>
          <div className={styles.errorContainer}>
            {/* Ícono de error */}
            <div className={styles.errorIcon}>
              {tooManyErrors ? '🚨' : '⚠️'}
            </div>

            {/* Título */}
            <h1 className={styles.errorTitle}>
              {tooManyErrors 
                ? 'Error Crítico Detectado' 
                : 'Algo salió mal'
              }
            </h1>

            {/* Descripción */}
            <p className={styles.errorDescription}>
              {tooManyErrors 
                ? 'La aplicación ha encontrado múltiples errores. Te recomendamos recargar la página completamente.'
                : 'Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta nuevamente.'
              }
            </p>

            {/* Detalles del error (solo en desarrollo) */}
            {DEBUG.ENABLED && error && (
              <details className={styles.errorDetails}>
                <summary className={styles.errorSummary}>
                  Detalles técnicos (modo desarrollo)
                </summary>
                <div className={styles.errorStack}>
                  <p className={styles.errorMessage}>
                    <strong>Error:</strong> {error.toString()}
                  </p>
                  {errorInfo && (
                    <pre className={styles.errorStackTrace}>
                      {errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {/* Acciones */}
            <div className={styles.errorActions}>
              {tooManyErrors ? (
                <>
                  <Button
                    variant="primary"
                    onClick={this.handleReload}
                    className={styles.errorButton}
                  >
                    🔄 Recargar Página
                  </Button>
                  <Button
                    variant="outline"
                    onClick={this.handleGoHome}
                    className={styles.errorButton}
                  >
                    🏠 Ir al Inicio
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    onClick={this.handleReset}
                    className={styles.errorButton}
                  >
                    🔄 Intentar Nuevamente
                  </Button>
                  <Button
                    variant="outline"
                    onClick={this.handleReload}
                    className={styles.errorButton}
                  >
                    ↻ Recargar Página
                  </Button>
                </>
              )}
            </div>

            {/* Información de contacto */}
            <div className={styles.errorFooter}>
              <p className={styles.errorFooterText}>
                Si el problema persiste, contacta al soporte técnico en{' '}
                <a 
                  href={`mailto:${LEGAL_INFO.CONTACT_EMAIL}`}
                  className={styles.errorLink}
                >
                  {LEGAL_INFO.CONTACT_EMAIL}
                </a>
              </p>
              
              {/* Info adicional en desarrollo */}
              {DEBUG.ENABLED && (
                <p className={styles.errorDebugInfo}>
                  <small>
                    Aplicación: {APP_NAME} | 
                    Errores consecutivos: {errorCount}
                  </small>
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Si no hay error, renderizar los children normalmente
    return this.props.children;
  }
}

export default ErrorBoundary;