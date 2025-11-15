import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodigoPenalService } from './codigo-penal.service';
import { Articulo } from './entities/articulo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Articulo])],
  providers: [CodigoPenalService],
  exports: [CodigoPenalService],
})
export class CodigoPenalModule {}