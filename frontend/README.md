# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/           ✅ (Ya teníamos)
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── chat/           ✅ NUEVO COMPLETO
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   └── ArticleCard.jsx
│   │   ├── common/         ✅ (Ya teníamos)
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   └── layout/         ✅ NUEVO
│   │       ├── Layout.jsx
│   │       ├── Header.jsx
│   │       └── Layout.module.css
│   ├── contexts/           ✅ (Ya teníamos)
│   │   ├── AuthContext.jsx
│   │   └── ChatContext.jsx
│   ├── hooks/              ✅ (Ya teníamos)
│   │   ├── useAuth.js
│   │   ├── useChat.js
│   │   ├── useForm.js
│   │   └── useToast.js
│   ├── services/           ✅ (Ya teníamos)
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── chatService.js
│   ├── styles/
│   │   ├── index.css       ✅ ACTUALIZADO
│   │   ├── variables.css   ✅ (Ya teníamos)
│   │   └── components/
│   │       ├── Auth.module.css    ✅ (Ya teníamos)
│   │       ├── Chat.module.css    ✅ NUEVO COMPLETO
│   │       └── Common.module.css  ✅ (Ya teníamos)
│   ├── utils/              ✅ (Ya teníamos)
│   │   ├── validators.js
│   │   └── constants.js
│   ├── App.jsx             ✅ NUEVO - Principal con rutas
│   └── main.jsx            ✅ NUEVO - Entry point
├── index.html              ✅ NUEVO
├── package.json            ✅ NUEVO
├── vite.config.js          ✅ NUEVO
├── .env.example            ✅ NUEVO
└── README.md               ✅ NUEVO
```