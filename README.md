# ⚖️ Sistema de Asesoría Legal Penal mediante IA

## 📋 Descripción

Sistema de asesoría legal basado en inteligencia artificial destinado a fortalecer la alfabetización penal ciudadana en Colombia. Utiliza procesamiento de lenguaje natural (NLP) y el modelo **Gemini 2.5 Flash** de Google para traducir las disposiciones del Código Penal Colombiano (Ley 599 de 2000) a explicaciones claras y accesibles.

**Desarrollado por:** Kevin N. Sierra G.  
**Institución:** Universidad Distrital Francisco José de Caldas  
**Período:** 2025-3
**Contacto:** knsierrag@udistrital.edu.co

---

## 🏗️ Arquitectura del Sistema

### Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                     ARQUITECTURA COMPLETA                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐      ┌──────────────────┐              │
│  │   FRONTEND      │◄────►│    BACKEND       │              │
│  │   (React 19)    │      │   (NestJS 11)    │              │
│  │   Puerto: 3000  │      │   Puerto: 3001   │              │
│  └─────────────────┘      └──────────────────┘              │
│                                    │                         │
│                                    ▼                         │
│                     ┌──────────────────────────┐            │
│                     │   BASE DE DATOS          │            │
│                     │   (PostgreSQL 19c)       │            │
│                     │   Puerto: 5432           │            │
│                     │   Docker Container       │            │
│                     └──────────────────────────┘            │
│                                    │                         │
│                                    ▼                         │
│                     ┌──────────────────────────┐            │
│                     │   SERVICIOS EXTERNOS     │            │
│                     │   • Google Gemini API    │            │
│                     │   • (gemini-2.5-flash)   │            │
│                     └──────────────────────────┘            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Estructura del Backend (NestJS)

```
backend/
├── src/
│   ├── auth/                    # Autenticación JWT
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── guards/
│   │   └── strategies/
│   │
│   ├── users/                   # Gestión de usuarios
│   │   ├── users.service.ts
│   │   └── entities/user.entity.ts
│   │
│   ├── legal-chat/              # Módulo principal de chat
│   │   ├── legal-chat.controller.ts
│   │   ├── legal-chat.service.ts
│   │   └── entities/
│   │       ├── conversation.entity.ts
│   │       └── message.entity.ts
│   │
│   ├── gemini/                  # Integración con IA
│   │   ├── gemini.module.ts
│   │   └── gemini.service.ts
│   │
│   ├── vector-db/               # Búsqueda semántica
│   │   ├── vector-db.module.ts
│   │   └── vector-db.service.ts
│   │
│   ├── codigo-penal/            # Código Penal colombiano
│   │   ├── codigo-penal.service.ts
│   │   └── entities/articulo.entity.ts
│   │
│   ├── scripts/
│   │   └── seed.ts              # ⚠️ IMPORTANTE: Carga artículos
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── data/
│   └── codigo_penal_colombia.txt  # Ley 599 de 2000
│
├── .env.template                # ⚠️ RENOMBRAR A .env
├── package.json
└── tsconfig.json
```

### Estructura del Frontend (React + Vite)

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/              # Login y Registro
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── AuthLayout.jsx
│   │   │
│   │   ├── chat/              # Interfaz de chat
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   └── ArticleCard.jsx
│   │   │
│   │   ├── common/            # Componentes reutilizables
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── Toast.jsx
│   │   │
│   │   └── layout/
│   │       ├── Header.jsx
│   │       └── Layout.jsx
│   │
│   ├── contexts/              # Estado global (Context API)
│   │   ├── AuthContext.jsx
│   │   ├── ChatContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── services/              # Comunicación con API
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── chatService.js
│   │
│   ├── hooks/                 # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useChat.js
│   │   └── useToast.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   └── validators.js
│   │
│   ├── styles/
│   │   └── components/
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env                       # Variables de entorno
├── package.json
└── vite.config.js
```

---

## 🔧 Requisitos Previos

### Software Requerido

- **Node.js**: v18.x o superior ([Descargar](https://nodejs.org/))
- **Docker Desktop**: Última versión ([Descargar](https://www.docker.com/products/docker-desktop/))
- **npm** o **yarn**: Gestor de paquetes (incluido con Node.js)
- **Git**: Para clonar el repositorio

### Cuenta de Google (para API Key)

Necesitarás una **API Key de Google Gemini**. Obtenerla es gratuito:

1. Ve a: [https://aistudio.google.com/app/api-keys](https://aistudio.google.com/app/api-keys)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Create API Key"**
4. Copia la clave generada (la necesitarás en el paso 4 de instalación)

> **💡 Nota:** Si tienes problemas para obtener la API Key o durante la instalación, puedes contactarme directamente:  
> **Email:** knsierrag@udistrital.edu.co

---

## 🚀 Instalación y Configuración

### **PASO 1: Clonar el Repositorio**

```bash
git clone https://github.com/tu-usuario/sistema-asesoria-legal.git
cd sistema-asesoria-legal
```

### **PASO 2: ⚠️ Levantar Docker Desktop (CRÍTICO)**

**ANTES DE CONTINUAR, asegúrate de:**

1. **Abrir Docker Desktop**
2. **Esperar a que esté completamente iniciado** (icono verde en la bandeja del sistema)
3. **Verificar que Docker está corriendo:**

```bash
docker --version
docker-compose --version
```

Deberías ver algo como:
```
Docker version 24.0.6
docker-compose version v2.23.0
```

### **PASO 3: Iniciar Base de Datos (PostgreSQL + pgAdmin)**

Desde la **raíz del proyecto**, ejecuta:

```bash
docker-compose up -d
```

**Esto levantará:**
- ✅ PostgreSQL en `localhost:5432`
- ✅ pgAdmin en `localhost:5050` (interfaz de administración opcional)

**Verificar que los contenedores están corriendo:**

```bash
docker ps
```

Deberías ver algo como:
```
CONTAINER ID   IMAGE                  STATUS          PORTS
abc123def456   postgres:15-alpine     Up 10 seconds   0.0.0.0:5432->5432/tcp
xyz789ghi012   dpage/pgadmin4:latest  Up 10 seconds   0.0.0.0:5050->80/tcp
```

> **⚠️ IMPORTANTE:** Si los contenedores no inician, verifica que:
> - Docker Desktop está abierto y corriendo
> - Los puertos 5432 y 5050 no están siendo usados por otras aplicaciones
> - Tienes permisos de administrador

---

### **PASO 4: Configurar Backend**

#### **4.1. Navegar a la carpeta del backend**

Abre una **NUEVA TERMINAL** (Terminal #1) y ejecuta:

```bash
cd backend
```

#### **4.2. Configurar variables de entorno**

**⚠️ PASO CRÍTICO:**

1. Renombra el archivo `.env.template` a `.env`:

```bash
# En Windows
ren .env.template .env

# En macOS/Linux
mv .env.template .env
```

2. Abre el archivo `.env` con tu editor de texto favorito:

```bash
# Con VS Code
code .env

# O con cualquier editor
notepad .env   # Windows
nano .env      # Linux/Mac
```

3. **Agrega tu GEMINI_API_KEY** (línea 14):

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres123
DATABASE_NAME=legal_advisory_db

# JWT Configuration
JWT_SECRET=sm7yZ>q,t+C9Xe-2=pXooQF;mWpLuSt7%>bKuIe=BY0
JWT_EXPIRATION=7d

# ⚠️ IMPORTANTE: Agrega tu API Key aquí ⬇️
GEMINI_API_KEY=TU_API_KEY_AQUI

# Server Configuration
PORT=3001
NODE_ENV=development
```

> **📌 Recuerda:** Obtén tu API Key en [https://aistudio.google.com/app/api-keys](https://aistudio.google.com/app/api-keys)

#### **4.3. Instalar dependencias del backend**

```bash
npm install
```

Esto instalará todas las dependencias listadas en `package.json` (~2-3 minutos).

#### **4.4. ⚠️ EJECUTAR SCRIPT SEED (IMPORTANTE)**

**Este paso es CRÍTICO** para cargar los 700+ artículos del Código Penal en la base de datos:

```bash
npm run seed
```

**Salida esperada:**
```
🎯 ════════════════════════════════════════════════════
   Seed Script - Código Penal Colombiano
════════════════════════════════════════════════════

✅ Conexión establecida con PostgreSQL
📄 Leyendo archivo: data/codigo_penal_colombia.txt
📦 Artículos procesados: 700+
💾 Insertando en base de datos...
✅ Seed completado exitosamente!
   - 700+ artículos insertados
   - Índices creados
   - Listo para usar

════════════════════════════════════════════════════
```

> **⚠️ Si este comando falla:**
> - Verifica que Docker está corriendo
> - Verifica que PostgreSQL está levantado: `docker ps`
> - Verifica que el archivo `.env` tiene las credenciales correctas
> - Contacta al desarrollador: knsierrag@udistrital.edu.co

#### **4.5. Iniciar servidor backend**

```bash
npm run start:dev
```

**Salida esperada:**
```
🎯 ═══════════════════════════════════════════════
   Sistema de Asesoría Legal - Backend NestJS
═══════════════════════════════════════════════

🚀 Servidor:       http://localhost:3001/api
📚 Base de datos:  PostgreSQL @ localhost:5432
🤖 Modelo IA:      gemini-2.5-flash
🌍 Entorno:        development
🔐 CORS habilitado para:
   - http://localhost:3000

═══════════════════════════════════════════════
```

✅ **Backend corriendo en:** `http://localhost:3001`

---

### **PASO 5: Configurar y Levantar Frontend**

#### **5.1. Abrir una NUEVA TERMINAL (Terminal #2)**

**⚠️ Importante:** NO cierres la terminal del backend. Abre una nueva terminal.

```bash
cd frontend
```

#### **5.2. Instalar dependencias del frontend**

```bash
npm install
```

Esto instalará React, Vite y todas las dependencias (~2-3 minutos).

#### **5.3. Iniciar servidor de desarrollo**

```bash
npm run dev
```

**Salida esperada:**
```
  VITE v7.2.2  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

✅ **Frontend corriendo en:** `http://localhost:3000`

---

## 🎮 Uso de la Aplicación

### **1. Acceder a la Aplicación**

Abre tu navegador y ve a: **http://localhost:3000**

### **2. Registrar una Cuenta**

**⚠️ IMPORTANTE:** Aunque existe un usuario de demostración (`demoparacliente@empresa.com` / `cliente_demo01`), es **MUY PROBABLE** que no esté en tu base de datos local. Por lo tanto:

**Recomendación: REGÍSTRATE** con tus propios datos:

1. Haz clic en **"Regístrate aquí"**
2. Completa el formulario:
   - **Nombre completo:** Tu nombre
   - **Email:** tu@email.com
   - **Contraseña:** mínimo 6 caracteres
   - **Confirmar contraseña**
3. Acepta términos y condiciones
4. Haz clic en **"Crear Cuenta"**

✅ Serás redirigido automáticamente al chat.

### **3. Realizar Consultas Legales**

Una vez dentro del sistema:

1. **Escribe tu consulta** en lenguaje natural, por ejemplo:
   - "¿Qué pena tiene el hurto calificado?"
   - "¿Cuáles son las circunstancias agravantes del homicidio?"
   - "Explícame el artículo 103 del Código Penal"

2. **Presiona Enter** o haz clic en el botón de enviar (➤)

3. **Recibe respuesta** con:
   - Explicación clara en lenguaje sencillo
   - Artículos del Código Penal citados
   - Referencias legales específicas

4. **Visualizar artículos citados:**
   - Haz clic en "📚 X artículos relacionados"
   - Expande cada artículo para ver el texto completo
   - Copia artículos al portapapeles con el botón "📋 Copiar"

### **4. Gestionar Conversaciones**

- **Nueva conversación:** Botón "+ Nueva consulta" en la parte superior
- **Ver historial:** Botón "☰" muestra conversaciones previas
- **Eliminar conversación:** Desde el historial (funcionalidad en desarrollo)

### **5. Cerrar Sesión**

Haz clic en tu avatar (esquina superior derecha) → "Cerrar sesión"

---

## 📊 Características Principales

### ✅ Implementadas

- ✅ **Autenticación segura:** JWT con expiración de 7 días
- ✅ **Chat conversacional:** Interfaz intuitiva y responsiva
- ✅ **Búsqueda RAG:** Recuperación de artículos relevantes del Código Penal
- ✅ **Generación con IA:** Respuestas claras usando Gemini 2.5 Flash
- ✅ **Historial de conversaciones:** Guarda todas tus consultas
- ✅ **Visualización de artículos:** Muestra texto legal completo
- ✅ **Copiar artículos:** Al portapapeles en texto plano
- ✅ **Múltiples conversaciones:** Organiza consultas por tema

### 🚧 En Desarrollo / Trabajo Futuro

- 🚧 **Búsqueda por número de artículo:** Buscar directamente "Artículo 103"
- 🚧 **Exportar conversaciones:** A PDF, DOCX o TXT
- 🚧 **Análisis de documentos:** Subir PDFs de sentencias judiciales
- 🚧 **Embeddings semánticos:** Mejorar precisión de búsqueda con FAISS
- 🚧 **Modo oscuro:** Interfaz adaptable
- 🚧 **Compartir conversaciones:** Vía link público

---

## 🐛 Solución de Problemas Comunes

### ❌ Error: "Cannot connect to PostgreSQL"

**Causa:** Docker no está corriendo o PostgreSQL no está levantado.

**Solución:**
```bash
# 1. Verificar que Docker Desktop está abierto
docker ps

# 2. Si no hay contenedores, reiniciar:
docker-compose down
docker-compose up -d

# 3. Esperar 10 segundos y reintentar
```

### ❌ Error: "GEMINI_API_KEY is not defined"

**Causa:** No agregaste la API Key en el archivo `.env`.

**Solución:**
1. Abre `backend/.env`
2. Agrega tu API Key en la línea `GEMINI_API_KEY=`
3. Guarda el archivo
4. Reinicia el backend: `Ctrl+C` y luego `npm run start:dev`

### ❌ Error: "Port 3000 is already in use"

**Causa:** Otra aplicación está usando el puerto 3000.

**Solución:**
```bash
# Opción 1: Cerrar la aplicación que usa el puerto

# Opción 2: Cambiar puerto en frontend/vite.config.js
server: {
  port: 3002,  // Cambia a otro puerto
  ...
}
```

### ❌ Error: "Login failed - Usuario no encontrado"

**Causa:** El usuario demo no está en tu base de datos local.

**Solución:**
1. Haz clic en **"Regístrate aquí"**
2. Crea tu propia cuenta
3. O ejecuta el seed nuevamente: `npm run seed` (desde backend/)

### ❌ Error: "Failed to fetch - Network Error"

**Causa:** El backend no está corriendo o hay problema CORS.

**Solución:**
1. Verifica que el backend está corriendo en Terminal #1
2. Verifica que ves el mensaje: "🚀 Servidor: http://localhost:3001/api"
3. Si no, reinicia: `Ctrl+C` y `npm run start:dev`

### ❌ La respuesta del chatbot es muy lenta (>10 segundos)

**Causa:** La API de Gemini puede tener latencia variable.

**Explicación:** Esto es normal. El sistema hace:
1. Búsqueda en base de datos (~200ms)
2. Llamada a Gemini API (~1.5-6 segundos dependiendo de carga)
3. Guardado en BD (~100ms)

**Tiempo típico:** 2-5 segundos por consulta.

---

## 📧 Contacto y Soporte

### Desarrollador

- **Nombre:** Kevin N. Sierra G.
- **Email:** knsierrag@udistrital.edu.co
- **Institución:** Universidad Distrital Francisco José de Caldas
- **Facultad:** Ingeniería

### ¿Necesitas Ayuda?

Si encuentras algún error durante la instalación o uso de la aplicación:

1. **Revisa esta documentación** completa
2. **Verifica los pasos críticos:**
   - ✅ Docker Desktop abierto y corriendo
   - ✅ API Key de Gemini configurada en `.env`
   - ✅ Script seed ejecutado exitosamente
   - ✅ Backend y frontend corriendo en terminales separadas
3. **Si el problema persiste:** Contáctame directamente al email indicado

---

## 📝 Tecnologías Utilizadas

### Frontend
- **React 19.2:** Biblioteca de UI
- **Vite 7.2:** Build tool rápido
- **React Router 7:** Navegación
- **Axios 1.13:** Cliente HTTP
- **CSS Modules:** Estilos encapsulados

### Backend
- **NestJS 11:** Framework Node.js
- **TypeORM 0.3:** ORM para PostgreSQL
- **Passport JWT:** Autenticación
- **bcrypt 6.0:** Hash de contraseñas
- **Google Generative AI 0.24:** Integración con Gemini

### Base de Datos
- **PostgreSQL 19c:** Base de datos relacional
- **pgAdmin 4:** Herramienta de administración (opcional)

### Infraestructura
- **Docker Compose:** Orquestación de contenedores
- **Docker Desktop:** Plataforma de contenedores

---

## 📄 Licencia

Este proyecto fue desarrollado como parte de un trabajo académico en la Universidad Distrital Francisco José de Caldas. 

**Uso educativo y de investigación.**

---

## 🙏 Agradecimientos

- **Universidad Distrital Francisco José de Caldas** por el apoyo institucional
- **Google AI Studio** por proporcionar acceso gratuito a Gemini API
- **Comunidad open-source** por las herramientas y librerías utilizadas

---

## 📅 Información del Proyecto

- **Fecha de inicio:** 3 de noviembre de 2025
- **Fecha de finalización:** 17 de noviembre de 2025
- **Duración:** 14 días (2 semanas)
- **Estado:** Prototipo funcional completado ✅

---

**¡Gracias por usar el Sistema de Asesoría Legal Penal mediante IA!** ⚖️🤖

Si tienes sugerencias de mejora o encuentras bugs, no dudes en contactarme.