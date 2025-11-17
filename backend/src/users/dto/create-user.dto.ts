import { IsEmail, IsString, MinLength, IsOptional, MaxLength } from 'class-validator';

/**
 * DTO para crear un usuario
 * Usado internamente por el sistema (no necesariamente desde el registro público)
 */
export class CreateUserDto {
  @IsEmail({}, { message: 'Email inválido' })
  @MaxLength(100, { message: 'El email no puede exceder 100 caracteres' })
  email: string;

  @IsString({ message: 'El nombre debe ser un texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  name: string;

  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(50, { message: 'La contraseña no puede exceder 50 caracteres' })
  password: string;
}