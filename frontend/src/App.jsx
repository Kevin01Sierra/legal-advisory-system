/**
 * App.jsx
 * Componente principal de la aplicación
 * CORREGIDO: Providers en el orden correcto
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { ToastProvider } from './hooks/useToast';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ToastContainer } from './components/common/Toast';
import AuthLayout from './components/auth/AuthLayout';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Layout from './components/layout/Layout';
import ChatInterface from './components/chat/ChatInterface';
import { 
  ROUTES, 
  APP_NAME,
  DEBUG 
} from './utils/constants';
import './styles/index.css';

// Componente de ruta protegida
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

// Componente de ruta pública (solo para no autenticados)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Cargando...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.CHAT} replace />;
  }

  return children;
};

// Componente principal de rutas (AHORA PUEDE USAR useToast)
const AppRoutes = () => {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <Routes>
        {/* Ruta raíz - redirige según autenticación */}
        <Route 
          path={ROUTES.HOME} 
          element={<Navigate to={ROUTES.LOGIN} replace />} 
        />

        {/* Rutas públicas (Auth) */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <AuthLayout>
                <LoginForm />
              </AuthLayout>
            </PublicRoute>
          }
        />

        <Route
          path={ROUTES.REGISTER}
          element={
            <PublicRoute>
              <AuthLayout>
                <RegisterForm />
              </AuthLayout>
            </PublicRoute>
          }
        />

        {/* Rutas protegidas */}
        <Route
          path={ROUTES.CHAT}
          element={
            <ProtectedRoute>
              <ChatProvider>
                <Layout>
                  <ChatInterface />
                </Layout>
              </ChatProvider>
            </ProtectedRoute>
          }
        />

        {/* Ruta 404 */}
        <Route
          path={ROUTES.NOT_FOUND}
          element={
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              textAlign: 'center'
            }}>
              <h1 style={{ fontSize: '4rem', margin: '0' }}>404</h1>
              <p style={{ fontSize: '1.5rem', margin: '1rem 0' }}>
                Página no encontrada
              </p>
              <a 
                href={ROUTES.HOME}
                style={{
                  marginTop: '2rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '0.5rem'
                }}
              >
                Volver al inicio
              </a>
            </div>
          }
        />
      </Routes>

      {/* Contenedor de Toasts */}
      <ToastContainer 
        toasts={toasts} 
        onRemove={removeToast} 
      />
    </>
  );
};

// Componente App principal
const App = () => {
  useEffect(() => {
    // Establecer título de la página
    document.title = APP_NAME;

    // Log de inicio en desarrollo
    if (DEBUG.ENABLED) {
      console.log(`🚀 ${APP_NAME} iniciado en modo desarrollo`);
      console.log('Debug habilitado:', DEBUG);
    }

    // Cleanup
    return () => {
      if (DEBUG.ENABLED) {
        console.log('App desmontada');
      }
    };
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        {/* ORDEN CORRECTO DE PROVIDERS */}
        <ToastProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;