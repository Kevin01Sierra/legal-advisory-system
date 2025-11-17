import React from 'react';
import styles from '../../styles/components/Common.module.css';

/**
 * Componente Loading con diferentes variantes
 * 
 * Props:
 * - variant: 'spinner' | 'dots' | 'pulse' | 'skeleton'
 * - size: 'sm' | 'md' | 'lg'
 * - fullscreen: boolean (overlay de pantalla completa)
 * - text: mensaje opcional
 */
const Loading = ({
  variant = 'spinner',
  size = 'md',
  fullscreen = false,
  text,
  className = '',
}) => {
  // Renderizar según variante
  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return <SpinnerLoader size={size} />;
      case 'dots':
        return <DotsLoader size={size} />;
      case 'pulse':
        return <PulseLoader size={size} />;
      case 'skeleton':
        return <SkeletonLoader />;
      default:
        return <SpinnerLoader size={size} />;
    }
  };

  if (fullscreen) {
    return (
      <div className={styles['loading-overlay']}>
        <div className={styles['loading-container']}>
          {renderLoader()}
          {text && <p className={styles['loading-text']}>{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles['loading-inline']} ${className}`}>
      {renderLoader()}
      {text && <span className={styles['loading-text']}>{text}</span>}
    </div>
  );
};

/**
 * Spinner circular
 */
const SpinnerLoader = ({ size }) => (
  <div className={`${styles.spinner} ${styles[`spinner--${size}`]}`}>
    <svg viewBox="0 0 50 50" className={styles['spinner-svg']}>
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
        className={styles['spinner-circle']}
      />
    </svg>
  </div>
);

/**
 * Puntos animados
 */
const DotsLoader = ({ size }) => (
  <div className={`${styles['dots-loader']} ${styles[`dots-loader--${size}`]}`}>
    <span className={styles['dots-loader__dot']}></span>
    <span className={styles['dots-loader__dot']}></span>
    <span className={styles['dots-loader__dot']}></span>
  </div>
);

/**
 * Pulso circular
 */
const PulseLoader = ({ size }) => (
  <div className={`${styles['pulse-loader']} ${styles[`pulse-loader--${size}`]}`}>
    <div className={styles['pulse-loader__circle']}></div>
    <div className={styles['pulse-loader__circle']}></div>
  </div>
);

/**
 * Skeleton para cargar contenido
 */
const SkeletonLoader = () => (
  <div className={styles['skeleton-loader']}>
    <div className={styles['skeleton-loader__line']}></div>
    <div className={styles['skeleton-loader__line']}></div>
    <div className={styles['skeleton-loader__line']}></div>
  </div>
);

export default Loading;