import { Module } from '@nestjs/common';
import { RealtimeModule } from '../realtime/realtime.module';
import { IncidentesController } from './incidentes.controller';
import { IncidentesService } from './incidentes.service';

@Module({
  imports: [RealtimeModule],
  controllers: [IncidentesController],
  providers: [IncidentesService],
  exports: [IncidentesService],
})
export class IncidentesModule {}
