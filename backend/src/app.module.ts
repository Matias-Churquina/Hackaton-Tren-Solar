import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AsistenciaModule } from './asistencia/asistencia.module';
import { AuthModule } from './auth/auth.module';
import { IncidentesModule } from './incidentes/incidentes.module';
import { PrismaModule } from './prisma/prisma.module';
import { RealtimeModule } from './realtime/realtime.module';
import { RecomendacionesModule } from './recomendaciones/recomendaciones.module';
import { UsersModule } from './users/users.module';
import { ZonasModule } from './zonas/zonas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ZonasModule,
    IncidentesModule,
    RecomendacionesModule,
    AsistenciaModule,
    RealtimeModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
