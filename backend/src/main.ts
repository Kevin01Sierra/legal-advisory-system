import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173',
    credentials: true,
  });

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Prefijo global para API
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Servidor corriendo en: http://localhost:${port}/api`);
  console.log(`📚 Base de datos: PostgreSQL en puerto 5432`);
  console.log(`🤖 Modelo IA: gemini-2.5-flash`);
}

bootstrap();