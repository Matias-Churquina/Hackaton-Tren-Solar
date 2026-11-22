import { Categoria, FranjaHoraria } from '@prisma/client';
import { tasaPorMil } from '../incidentes/agregacion';

export interface Conteo {
  zonaId: number;
  categoria: Categoria;
  franja: FranjaHoraria;
  count: number;
}

export interface Regla {
  id: number;
  categoria: Categoria;
  franja: FranjaHoraria | null;
  umbralTasa: number;
  accion: string;
  evidencia: string;
}

export interface ZonaRef {
  id: number;
  nombre: string;
  localidad: string;
  poblacion: number;
}

export interface Sugerencia {
  zonaId: number;
  zona: string;
  localidad: string;
  categoria: Categoria;
  franja: FranjaHoraria | null;
  count: number;
  tasaPorMil: number;
  accion: string;
  evidencia: string;
}

/**
 * Prevención situacional por reglas: si la tasa de una categoría (y franja, si
 * la regla la define) en una zona supera el umbral, sugiere la acción.
 */
export function evaluarReglas(
  conteos: Conteo[],
  reglas: Regla[],
  zonas: ZonaRef[],
  minCount: number,
): Sugerencia[] {
  const sugerencias: Sugerencia[] = [];
  for (const zona of zonas) {
    for (const regla of reglas) {
      const count = conteos
        .filter(
          (c) =>
            c.zonaId === zona.id &&
            c.categoria === regla.categoria &&
            (regla.franja === null || c.franja === regla.franja),
        )
        .reduce((a, c) => a + c.count, 0);
      if (count < minCount) continue;
      const tasa = tasaPorMil(count, zona.poblacion);
      if (tasa < regla.umbralTasa) continue;
      sugerencias.push({
        zonaId: zona.id,
        zona: zona.nombre,
        localidad: zona.localidad,
        categoria: regla.categoria,
        franja: regla.franja,
        count,
        tasaPorMil: tasa,
        accion: regla.accion,
        evidencia: regla.evidencia,
      });
    }
  }
  return sugerencias.sort((a, b) => b.tasaPorMil - a.tasaPorMil);
}
