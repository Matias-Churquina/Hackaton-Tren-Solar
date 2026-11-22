import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { RecomendacionesService } from './recomendaciones.service';

@ApiTags('recomendaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ANALISTA, Role.ADMIN)
@Controller('recomendaciones')
export class RecomendacionesController {
  constructor(private readonly recomendaciones: RecomendacionesService) {}

  @Get()
  sugerencias() {
    return this.recomendaciones.sugerencias();
  }

  @Get('reglas')
  reglas() {
    return this.recomendaciones.reglas();
  }
}
