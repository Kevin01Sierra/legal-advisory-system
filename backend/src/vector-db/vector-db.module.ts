import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VectorDbService } from './vector-db.service';
import { Articulo } from '../codigo-penal/entities/articulo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Articulo])],
  providers: [VectorDbService],
  exports: [VectorDbService],
})
export class VectorDbModule {}