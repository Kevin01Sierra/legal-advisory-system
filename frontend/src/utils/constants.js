/**
 * Constantes de la aplicación
 * Sistema de Asesoría Legal Penal
 */

// ============================================
// API y Configuración
// ============================================
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Sistema de Asesoría Legal Penal';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';
export const ENVIRONMENT = import.meta.env.VITE_ENV || 'development';

// ============================================
// Endpoints de la API
// ============================================
export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  
  // Conversaciones
  CONVERSATIONS: {
    BASE: '/legal-chat/conversations',
    BY_ID: (id) => `/legal-chat/conversations/${id}`,
    MESSAGES: (id) => `/legal-chat/conversations/${id}/messages`,
  },
  
  // Mensajes
  MESSAGES: {
    SEND: '/legal-chat/query',
    BY_ID: (id) => `/legal-chat/messages/${id}`,
  },
  
  // Usuarios
  USERS: {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`,
    PROFILE: '/users/profile',
  },
  
  // Artículos del Código Penal
  ARTICLES: {
    SEARCH: '/codigo-penal/search',
    BY_NUMBER: (number) => `/codigo-penal/articles/${number}`,
    ALL: '/codigo-penal/articles',
  },
  
  // Health check
  HEALTH: '/health',
};

// ============================================
// Rutas de la Aplicación
// ============================================
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CHAT: '/chat',
  NOT_FOUND: '*',
};

// ============================================
// Storage Keys (LocalStorage/SessionStorage)
// ============================================
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'legal_advisory_token',
  REFRESH_TOKEN: 'legal_advisory_refresh_token',
  USER_DATA: 'legal_advisory_user',
  THEME: 'legal_advisory_theme',
  LAST_CONVERSATION: 'legal_advisory_last_conversation',
  LANGUAGE: 'legal_advisory_language',
};

// ============================================
// Configuración de Autenticación
// ============================================
export const AUTH_CONFIG = {
  TOKEN_EXPIRY_DAYS: 7,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 15,
};

// ============================================
// Configuración de Chat
// ============================================
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 2000,
  MAX_CONVERSATION_TITLE_LENGTH: 100,
  TYPING_INDICATOR_DELAY: 500, // ms
  MESSAGE_SEND_TIMEOUT: 30000, // 30 segundos
  AUTO_SCROLL_DELAY: 100, // ms
  MAX_CONVERSATIONS_DISPLAY: 50,
};

// ============================================
// Validación de Formularios
// ============================================
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MIN_LENGTH: 5,
    MAX_LENGTH: 100,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 50,
    REQUIRE_UPPERCASE: false,
    REQUIRE_LOWERCASE: false,
    REQUIRE_NUMBER: false,
    REQUIRE_SPECIAL: false,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  },
  MESSAGE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 2000,
  },
};

// ============================================
// Mensajes de Error
// ============================================
export const ERROR_MESSAGES = {
  // Errores de red
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet.',
  TIMEOUT_ERROR: 'La petición tardó demasiado. Por favor, intenta de nuevo.',
  SERVER_ERROR: 'Error del servidor. Por favor, intenta más tarde.',
  
  // Errores de autenticación
  INVALID_CREDENTIALS: 'Credenciales inválidas. Verifica tu email y contraseña.',
  USER_NOT_FOUND: 'Usuario no encontrado.',
  EMAIL_ALREADY_EXISTS: 'El email ya está registrado.',
  UNAUTHORIZED: 'No autorizado. Por favor, inicia sesión.',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  
  // Errores de validación
  REQUIRED_FIELD: 'Este campo es obligatorio.',
  INVALID_EMAIL: 'Email inválido.',
  PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 6 caracteres.',
  PASSWORD_MISMATCH: 'Las contraseñas no coinciden.',
  INVALID_NAME: 'Nombre inválido. Solo se permiten letras y espacios.',
  
  // Errores de chat
  MESSAGE_TOO_LONG: 'El mensaje es demasiado largo. Máximo 2000 caracteres.',
  MESSAGE_EMPTY: 'No puedes enviar un mensaje vacío.',
  CONVERSATION_NOT_FOUND: 'Conversación no encontrada.',
  
  // Errores generales
  UNKNOWN_ERROR: 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.',
  PERMISSION_DENIED: 'No tienes permisos para realizar esta acción.',
};

// ============================================
// Mensajes de Éxito
// ============================================
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '¡Bienvenido de nuevo!',
  REGISTER_SUCCESS: '¡Cuenta creada exitosamente!',
  LOGOUT_SUCCESS: 'Sesión cerrada correctamente.',
  MESSAGE_SENT: 'Mensaje enviado.',
  PROFILE_UPDATED: 'Perfil actualizado correctamente.',
  PASSWORD_CHANGED: 'Contraseña cambiada correctamente.',
};

// ============================================
// Tipos de Toast
// ============================================
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// ============================================
// Duración de Toast (en ms)
// ============================================
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
};

// ============================================
// Estados de Mensaje
// ============================================
export const MESSAGE_STATUS = {
  SENDING: 'sending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  ERROR: 'error',
};

// ============================================
// Roles de Mensaje
// ============================================
export const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
};

// ============================================
// Sugerencias de Consultas Iniciales
// ============================================
export const INITIAL_SUGGESTIONS = [
  {
    id: 1,
    icon: '⚖️',
    title: 'Penas y sanciones',
    query: '¿Qué pena tiene el hurto calificado?',
  },
  {
    id: 2,
    icon: '📋',
    title: 'Circunstancias agravantes',
    query: '¿Cuáles son las circunstancias agravantes del homicidio?',
  },
  {
    id: 3,
    icon: '🛡️',
    title: 'Conceptos legales',
    query: 'Explícame qué es la legítima defensa',
  },
  {
    id: 4,
    icon: '📚',
    title: 'Tipos de delitos',
    query: '¿Qué delitos son contra la vida?',
  },
];

// ============================================
// Temas de la Aplicación
// ============================================
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
};

// ============================================
// Idiomas Soportados
// ============================================
export const LANGUAGES = {
  ES: 'es',
  EN: 'en',
};

// ============================================
// Breakpoints Responsivos
// ============================================
export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1280,
};

// ============================================
// Límites de Rate Limiting (Frontend)
// ============================================
export const RATE_LIMITS = {
  MESSAGES_PER_MINUTE: 10,
  REQUESTS_PER_MINUTE: 60,
};

// ============================================
// Configuración de Paginación
// ============================================
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// ============================================
// HTTP Status Codes
// ============================================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// ============================================
// Regex Patterns
// ============================================
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
  NAME: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  PHONE: /^[\d\s\-\+\(\)]+$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
};

// ============================================
// Información Legal
// ============================================
export const LEGAL_INFO = {
  CODE_NAME: 'Código Penal Colombiano',
  CODE_LAW: 'Ley 599 de 2000',
  CODE_DATE: '24 de julio de 2000',
  DISCLAIMER: 'Este sistema proporciona información educativa basada en el Código Penal colombiano. No constituye asesoría legal profesional.',
  COPYRIGHT: '© 2025 Universidad Distrital Francisco José de Caldas',
  CONTACT_EMAIL: 'knsierrag@udistrital.edu.co',
};

// ============================================
// Configuración del Modelo IA
// ============================================
export const AI_CONFIG = {
  MODEL_NAME: 'gemini-2.5-flash',
  MAX_TOKENS: 2048,
  TEMPERATURE: 0.7,
  TOP_P: 0.9,
};

// ============================================
// Configuración de Debug
// ============================================
export const DEBUG = {
  ENABLED: ENVIRONMENT === 'development',
  LOG_API_REQUESTS: ENVIRONMENT === 'development',
  LOG_STATE_CHANGES: ENVIRONMENT === 'development',
};

// ============================================
// Export por defecto (objeto con todo)
// ============================================
export default {
  API_BASE_URL,
  APP_NAME,
  APP_VERSION,
  ENVIRONMENT,
  API_ENDPOINTS,
  ROUTES,
  STORAGE_KEYS,
  AUTH_CONFIG,
  CHAT_CONFIG,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  TOAST_TYPES,
  TOAST_DURATION,
  MESSAGE_STATUS,
  MESSAGE_ROLES,
  INITIAL_SUGGESTIONS,
  THEMES,
  LANGUAGES,
  BREAKPOINTS,
  RATE_LIMITS,
  PAGINATION,
  HTTP_STATUS,
  REGEX_PATTERNS,
  LEGAL_INFO,
  AI_CONFIG,
  DEBUG,
};