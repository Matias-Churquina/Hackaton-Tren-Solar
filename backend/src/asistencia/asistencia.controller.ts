import { Controller, Get, Query } from '@nestjs/common';
import { ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

class AsistenciaQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  zonaId?: number;
}

@ApiTags('asistencia')
@Controller('asistencia')
export class AsistenciaController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  findAll(@Query() { zonaId }: AsistenciaQueryDto) {
    return this.prisma.servicioAsistencia.findMany({
      where: { zonaId },
      include: { zona: { select: { nombre: true, localidad: true } } },
      orderBy: { nombre: 'asc' },
    });
  }
}
