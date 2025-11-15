import { IsString, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class QueryDto {
  @IsString()
  @IsNotEmpty({ message: 'La consulta no puede estar vacía' })
  @MaxLength(1000, { message: 'La consulta no puede exceder 1000 caracteres' })
  query: string;

  @IsUUID()
  @IsOptional()
  conversationId?: string;
}