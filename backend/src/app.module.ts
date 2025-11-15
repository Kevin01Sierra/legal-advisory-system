import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LegalChatModule } from './legal-chat/legal-chat.module';
import { GeminiModule } from './gemini/gemini.module';
import { VectorDbModule } from './vector-db/vector-db.module';
import { CodigoPenalModule } from './codigo-penal/codigo-penal.module';

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configuración de TypeORM con PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development', // Solo en desarrollo
      logging: process.env.NODE_ENV === 'development',
    }),

    // Módulos de la aplicación
    AuthModule,
    UsersModule,
    LegalChatModule,
    GeminiModule,
    VectorDbModule,
    CodigoPenalModule,
  ],
})
export class AppModule {}