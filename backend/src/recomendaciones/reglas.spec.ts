import { evaluarReglas, Regla } from './reglas';

const zonas = [{ id: 1, nombre: 'Centro', localidad: 'SSJ', poblacion: 10000 }];
const regla: Regla = {
  id: 1,
  categoria: 'ROBO',
  franja: 'NOCHE',
  umbralTasa: 1,
  accion: 'Mejorar iluminación',
  evidencia: 'Iluminación reduce ~20% los delitos',
};

describe('evaluarReglas', () => {
  it('sugiere la acción cuando se supera el umbral', () => {
    const res = evaluarReglas(
      [{ zonaId: 1, categoria: 'ROBO', franja: 'NOCHE', count: 20 }],
      [regla],
      zonas,
      5,
    );
    expect(res).toHaveLength(1);
    expect(res[0].tasaPorMil).toBe(2);
  });

  it('respeta la franja horaria de la regla', () => {
    const res = evaluarReglas(
      [{ zonaId: 1, categoria: 'ROBO', franja: 'MANANA', count: 20 }],
      [regla],
      zonas,
      5,
    );
    expect(res).toHaveLength(0);
  });

  it('no sugiere nada bajo el conteo mínimo', () => {
    const res = evaluarReglas(
      [{ zonaId: 1, categoria: 'ROBO', franja: 'NOCHE', count: 3 }],
      [{ ...regla, umbralTasa: 0.1 }],
      zonas,
      5,
    );
    expect(res).toHaveLength(0);
  });
});
