import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string }) {
    console.log('🔐 JWT Payload recibido:', payload);

    // ✅ Buscar usuario por ID del token
    const user = await this.userRepository.findOne({ 
      where: { id: payload.sub } 
    });
    
    if (!user) {
      console.error('❌ Usuario no encontrado con ID:', payload.sub);
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (!user.isActive) {
      console.error('❌ Usuario inactivo:', payload.sub);
      throw new UnauthorizedException('Usuario inactivo');
    }

    console.log('✅ Usuario validado exitosamente:', {
      id: user.id,
      email: user.email,
      name: user.name
    });

    // ✅ CRÍTICO: Retornar objeto con ID explícito
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
    };
  }
}