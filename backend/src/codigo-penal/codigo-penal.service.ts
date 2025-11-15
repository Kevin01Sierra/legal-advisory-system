import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Articulo } from './entities/articulo.entity';

@Injectable()
export class CodigoPenalService implements OnModuleInit {
  private readonly logger = new Logger(CodigoPenalService.name);

  constructor(
    @InjectRepository(Articulo)
    private articuloRepository: Repository<Articulo>,
  ) {}

  async onModuleInit() {
    // Verificar si ya hay artículos cargados
    const count = await this.articuloRepository.count();
    if (count === 0) {
      this.logger.warn(
        '⚠️ No hay artículos en la BD. Ejecutar script de carga.',
      );
    } else {
      this.logger.log(`✅ ${count} artículos del Código Penal en BD`);
    }
  }

  async cargarArticulosIniciales() {
    // Este método se llamará desde un script de inicialización
    // Para cargar los artículos del PDF del Código Penal
    this.logger.log('Iniciando carga de artículos...');
  }
}