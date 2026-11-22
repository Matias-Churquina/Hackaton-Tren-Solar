import { Module } from '@nestjs/common';
import { AsistenciaController } from './asistencia.controller';

@Module({ controllers: [AsistenciaController] })
export class AsistenciaModule {}
