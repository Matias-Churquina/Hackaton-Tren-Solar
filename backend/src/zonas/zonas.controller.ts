import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('zonas')
@Controller('zonas')
export class ZonasController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  findAll() {
    return this.prisma.zona.findMany({
      orderBy: [{ localidad: 'asc' }, { nombre: 'asc' }],
    });
  }
}
