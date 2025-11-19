import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Configuración de CORS
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(origin => origin.trim()) || [
    'http://localhost:3000',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (como Postman, curl, etc.)
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️  CORS bloqueado para origen: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Prefijo global para API
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  const host = process.env.HOST || '0.0.0.0';

  await app.listen(port, host);

  console.log('\n🎯 ════════════════════════════════════════════════════════');
  console.log('   Sistema de Asesoría Legal - Backend NestJS');
  console.log('════════════════════════════════════════════════════════\n');
  console.log(`🚀 Servidor:       http://localhost:${port}/api`);
  console.log(`📚 Base de datos:  PostgreSQL @ localhost:5432`);
  console.log(`🤖 Modelo IA:      gemini-2.5-flash`);
  console.log(`🌍 Entorno:        ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔓 CORS habilitado para:`);
  allowedOrigins.forEach(origin => console.log(`   - ${origin}`));
  console.log('\n════════════════════════════════════════════════════════\n');
}

bootstrap().catch((err) => {
  console.error('❌ Error al iniciar la aplicación:', err);
  process.exit(1);
});