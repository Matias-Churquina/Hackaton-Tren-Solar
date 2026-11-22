import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  agregarEnGrilla,
  calcularTendencia,
  claveMes,
  tasaPorMil,
  ultimosMeses,
} from './agregacion';
import { CreateIncidenteDto } from './dto/create-incidente.dto';
import { FiltrosDto } from './dto/filtros.dto';

/** Tamaño de celda en grados (~2,2 km para el público, ~1,1 km para analistas). */
const CELDA_PUBLICA = 0.02;
const CELDA_ANALISTA = 0.01;

@Injectable()
export class IncidentesService {
  private readonly minCount: number;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService,
  ) {
    this.minCount = Number(config.get('MIN_COUNT', 5));
  }

  private where(f: FiltrosDto): Prisma.IncidenteWhereInput {
    const desde = new Date();
    desde.setUTCMonth(desde.getUTCMonth() - (f.meses ?? 12));
    return {
      fecha: { gte: desde },
      categoria: f.categoria,
      franja: f.franja,
      zonaId: f.zonaId,
    };
  }

  async heatmap(f: FiltrosDto, detallado: boolean) {
    const puntos = await this.prisma.incidente.findMany({
      where: this.where(f),
      select: { lat: true, lng: true },
    });
    const cellSize = detallado ? CELDA_ANALISTA : CELDA_PUBLICA;
    return {
      cellSize,
      minCount: this.minCount,
      celdas: agregarEnGrilla(puntos, cellSize, this.minCount),
    };
  }

  async porZona(f: FiltrosDto) {
    const [grupos, zonas] = await Promise.all([
      this.prisma.incidente.groupBy({
        by: ['zonaId'],
        where: this.where(f),
        _count: { _all: true },
      }),
      this.prisma.zona.findMany(),
    ]);
    const conteo = new Map(grupos.map((g) => [g.zonaId, g._count._all]));
    return zonas
      .map((z) => {
        const count = conteo.get(z.id) ?? 0;
        return {
          zonaId: z.id,
          nombre: z.nombre,
          localidad: z.localidad,
          lat: z.lat,
          lng: z.lng,
          poblacion: z.poblacion,
          count: count >= this.minCount ? count : null,
          tasaPorMil:
            count >= this.minCount ? tasaPorMil(count, z.poblacion) : null,
        };
      })
      .sort((a, b) => (b.tasaPorMil ?? -1) - (a.tasaPorMil ?? -1));
  }

  async tendencias(f: FiltrosDto) {
    // Solo meses completos: el mes en curso distorsionaría el Δ%.
    const hoy = new Date();
    const inicioMesActual = new Date(
      Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth()),
    );
    const n = f.meses ?? 12;
    const meses = ultimosMeses(
      n,
      new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() - 1)),
    );
    const desde = new Date(
      Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() - n),
    );
    const fechas = await this.prisma.incidente.findMany({
      where: {
        ...this.where(f),
        fecha: { gte: desde, lt: inicioMesActual },
      },
      select: { fecha: true },
    });
    const conteo = new Map<string, number>(meses.map((m) => [m, 0]));
    for (const { fecha } of fechas) {
      const k = claveMes(fecha);
      if (conteo.has(k)) conteo.set(k, (conteo.get(k) ?? 0) + 1);
    }
    return calcularTendencia(
      meses.map((mes) => ({ mes, count: conteo.get(mes) ?? 0 })),
    );
  }

  async crear(incidentes: CreateIncidenteDto[]) {
    const { count } = await this.prisma.incidente.createMany({
      data: incidentes.map((i) => ({
        ...i,
        fecha: new Date(i.fecha),
        sintetico: i.sintetico ?? true,
      })),
    });
    return { count };
  }
}
