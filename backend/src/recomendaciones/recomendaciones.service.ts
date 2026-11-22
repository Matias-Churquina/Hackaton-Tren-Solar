import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { evaluarReglas } from './reglas';

const VENTANA_MESES = 3;

@Injectable()
export class RecomendacionesService {
  private readonly minCount: number;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService,
  ) {
    this.minCount = Number(config.get('MIN_COUNT', 5));
  }

  reglas() {
    return this.prisma.recomendacion.findMany({ orderBy: { id: 'asc' } });
  }

  async sugerencias() {
    const desde = new Date();
    desde.setUTCMonth(desde.getUTCMonth() - VENTANA_MESES);
    const [grupos, reglas, zonas] = await Promise.all([
      this.prisma.incidente.groupBy({
        by: ['zonaId', 'categoria', 'franja'],
        where: { fecha: { gte: desde } },
        _count: { _all: true },
      }),
      this.prisma.recomendacion.findMany({ where: { activa: true } }),
      this.prisma.zona.findMany(),
    ]);
    const conteos = grupos.map((g) => ({
      zonaId: g.zonaId,
      categoria: g.categoria,
      franja: g.franja,
      count: g._count._all,
    }));
    return evaluarReglas(conteos, reglas, zonas, this.minCount);
  }
}
