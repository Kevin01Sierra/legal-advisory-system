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
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5433', 10),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'password',
      database: process.env.DB_DATABASE ?? 'edutrack',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo para desarrollo, en producción usar migraciones
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