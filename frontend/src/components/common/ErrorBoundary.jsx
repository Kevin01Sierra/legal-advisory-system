import { Component } from 'react';
import styles from '../../styles/components/Common.module.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorBoundaryContainer}>
          <div className={styles.errorBoundaryContent}>
            <div className={styles.errorBoundaryIcon}>⚠️</div>
            <h1 className={styles.errorBoundaryTitle}>Oops! Algo salió mal</h1>
            <p className={styles.errorBoundaryDescription}>
              Lo sentimos, ha ocurrido un error inesperado en la aplicación.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={styles.errorBoundaryDetails}>
                <summary className={styles.errorBoundarySummary}>
                  Detalles del error (modo desarrollo)
                </summary>
                <pre className={styles.errorBoundaryErrorText}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className={styles.errorBoundaryActions}>
              <button 
                onClick={this.handleReload} 
                className={styles.errorBoundaryPrimaryButton}
              >
                🔄 Recargar página
              </button>
              <button 
                onClick={this.handleGoHome} 
                className={styles.errorBoundarySecondaryButton}
              >
                🏠 Ir al inicio
              </button>
            </div>

            <p className={styles.errorBoundarySupport}>
              Si el problema persiste, por favor contacta al soporte técnico.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;