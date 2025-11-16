import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { ToastProvider } from './hooks/useToast';
import { useAuth } from './hooks/useAuth';

// Layouts
import Layout from './components/layout/Layout';
import AuthLayout from './components/auth/AuthLayout';

// Pages
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ChatInterface from './components/chat/ChatInterface';

// Error Boundary
import ErrorBoundary from './components/common/ErrorBoundary';

// Estilos globales
import './styles/index.css';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

// Componente para rutas públicas (solo accesibles sin autenticación)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return !user ? children : <Navigate to="/chat" replace />;
};

// Componente principal de rutas
const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthLayout>
              <LoginForm />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/register"
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
        path="/chat"
        element={
          <ProtectedRoute>
            <Layout>
              <ChatInterface />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Ruta raíz - redirige según autenticación */}
      <Route
        path="/"
        element={<RootRedirect />}
      />

      {/* Ruta 404 */}
      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
};

// Componente para redirección desde raíz
const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return <Navigate to={user ? '/chat' : '/login'} replace />;
};

// Componente 404
const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Página no encontrada</p>
      <a href="/">Volver al inicio</a>
    </div>
  );
};

// Componente principal de la aplicación
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ToastProvider>
            <ChatProvider>
              <AppRoutes />
            </ChatProvider>
          </ToastProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;