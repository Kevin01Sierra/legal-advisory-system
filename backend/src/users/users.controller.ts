import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Listar todos los usuarios (público)
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Buscar por nombre o email (público)
   */
  @Get('search')
  search(@Query('q') query: string) {
    if (!query) {
      return { message: 'Ingresa un término de búsqueda', data: [] };
    }
    return this.usersService.search(query);
  }

  /**
   * Buscar por email (público)
   */
  @Get('email')
  findByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  /**
   * Obtener perfil del usuario (requiere autenticación)
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}