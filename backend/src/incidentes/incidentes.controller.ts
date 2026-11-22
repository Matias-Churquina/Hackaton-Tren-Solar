import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard, OptionalJwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsuarioAutenticado } from '../auth/jwt-payload';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreateIncidentesDto } from './dto/create-incidente.dto';
import { FiltrosDto } from './dto/filtros.dto';
import { IncidentesService } from './incidentes.service';

@ApiTags('incidentes')
@Controller('incidentes')
export class IncidentesController {
  constructor(
    private readonly incidentes: IncidentesService,
    private readonly realtime: RealtimeGateway,
  ) {}

  /** Público: celdas grandes. Analista/Admin: celdas más finas. Siempre agregado. */
  @ApiBearerAuth()
  @UseGuards(OptionalJwtAuthGuard)
  @Get('heatmap')
  heatmap(
    @Query() filtros: FiltrosDto,
    @Req() req: { user?: UsuarioAutenticado | null },
  ) {
    const detallado =
      req.user?.role === Role.ANALISTA || req.user?.role === Role.ADMIN;
    return this.incidentes.heatmap(filtros, detallado);
  }

  @Get('por-zona')
  porZona(@Query() filtros: FiltrosDto) {
    return this.incidentes.porZona(filtros);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ANALISTA, Role.ADMIN)
  @Get('tendencias')
  tendencias(@Query() filtros: FiltrosDto) {
    return this.incidentes.tendencias(filtros);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async crear(@Body() dto: CreateIncidentesDto) {
    const res = await this.incidentes.crear(dto.incidentes);
    this.realtime.notificarIncidentes(res.count);
    return res;
  }
}
