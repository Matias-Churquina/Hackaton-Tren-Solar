/**
 * Datos SINTÉTICOS para la demo. No representan estadísticas reales.
 * Todos los incidentes se crean con `sintetico = true`.
 */
import {
  Categoria,
  FranjaHoraria,
  PrismaClient,
  Role,
  TipoZona,
  Zona,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

let semilla = 42;
function rand(): number {
  semilla = (semilla * 1664525 + 1013904223) % 4294967296;
  return semilla / 4294967296;
}
function elegir<T>(items: [T, number][]): T {
  const total = items.reduce((a, [, w]) => a + w, 0);
  let r = rand() * total;
  for (const [item, w] of items) {
    if ((r -= w) <= 0) return item;
  }
  return items[items.length - 1][0];
}

const zonas: {
  nombre: string;
  localidad: string;
  tipo: TipoZona;
  poblacion: number;
  lat: number;
  lng: number;
  peso: number;
}[] = [
  {
    nombre: 'Centro',
    localidad: 'San Salvador de Jujuy',
    tipo: 'BARRIO',
    poblacion: 35000,
    lat: -24.1858,
    lng: -65.2995,
    peso: 9,
  },
  {
    nombre: 'Alto Comedero',
    localidad: 'San Salvador de Jujuy',
    tipo: 'BARRIO',
    poblacion: 100000,
    lat: -24.231,
    lng: -65.265,
    peso: 14,
  },
  {
    nombre: 'Gorriti',
    localidad: 'San Salvador de Jujuy',
    tipo: 'BARRIO',
    poblacion: 18000,
    lat: -24.196,
    lng: -65.307,
    peso: 4,
  },
  {
    nombre: 'Ciudad de Nieva',
    localidad: 'San Salvador de Jujuy',
    tipo: 'BARRIO',
    poblacion: 22000,
    lat: -24.173,
    lng: -65.306,
    peso: 4,
  },
  {
    nombre: 'Los Perales',
    localidad: 'San Salvador de Jujuy',
    tipo: 'BARRIO',
    poblacion: 20000,
    lat: -24.204,
    lng: -65.278,
    peso: 5,
  },
  {
    nombre: 'Mariano Moreno',
    localidad: 'San Salvador de Jujuy',
    tipo: 'BARRIO',
    poblacion: 25000,
    lat: -24.215,
    lng: -65.287,
    peso: 6,
  },
  {
    nombre: 'Cuyaya',
    localidad: 'San Salvador de Jujuy',
    tipo: 'BARRIO',
    poblacion: 15000,
    lat: -24.199,
    lng: -65.296,
    peso: 3,
  },
  {
    nombre: 'Palpalá',
    localidad: 'Palpalá',
    tipo: 'MUNICIPIO',
    poblacion: 60000,
    lat: -24.256,
    lng: -65.211,
    peso: 6,
  },
  {
    nombre: 'Perico',
    localidad: 'Perico',
    tipo: 'MUNICIPIO',
    poblacion: 55000,
    lat: -24.382,
    lng: -65.113,
    peso: 6,
  },
  {
    nombre: 'Libertador Gral. San Martín',
    localidad: 'Libertador Gral. San Martín',
    tipo: 'MUNICIPIO',
    poblacion: 50000,
    lat: -23.807,
    lng: -64.789,
    peso: 5,
  },
  {
    nombre: 'Humahuaca',
    localidad: 'Humahuaca',
    tipo: 'MUNICIPIO',
    poblacion: 12000,
    lat: -23.205,
    lng: -65.35,
    peso: 1,
  },
  {
    nombre: 'La Quiaca',
    localidad: 'La Quiaca',
    tipo: 'MUNICIPIO',
    poblacion: 17000,
    lat: -22.105,
    lng: -65.593,
    peso: 2,
  },
];

const categorias: [Categoria, number][] = [
  ['ROBO', 30],
  ['HURTO', 28],
  ['HURTO_VEHICULO', 8],
  ['LESIONES', 10],
  ['VIOLENCIA_GENERO', 8],
  ['VIOLENCIA_INTRAFAMILIAR', 8],
  ['ESTAFA_ONLINE', 7],
  ['HOMICIDIO', 1],
];

const franjasPorCategoria: Partial<
  Record<Categoria, [FranjaHoraria, number][]>
> = {
  ROBO: [
    ['MADRUGADA', 2],
    ['MANANA', 1],
    ['TARDE', 3],
    ['NOCHE', 5],
  ],
  VIOLENCIA_INTRAFAMILIAR: [
    ['MADRUGADA', 2],
    ['MANANA', 1],
    ['TARDE', 2],
    ['NOCHE', 5],
  ],
};
const franjasDefault: [FranjaHoraria, number][] = [
  ['MADRUGADA', 1],
  ['MANANA', 2],
  ['TARDE', 3],
  ['NOCHE', 3],
];

const reglas = [
  {
    categoria: 'ROBO',
    franja: 'NOCHE',
    umbralTasa: 0.8,
    accion:
      'Mejorar la iluminación pública y reforzar el patrullaje focal nocturno en calles y paradas clave.',
    evidencia:
      'La mejora de iluminación pública se asocia con reducciones de ~20% en delitos.',
  },
  {
    categoria: 'HURTO',
    franja: 'TARDE',
    umbralTasa: 0.8,
    accion:
      'Campañas de prevención en comercios y paradas de colectivo; cámaras comunitarias de bajo costo.',
    evidencia: 'Prevención situacional en puntos de alta afluencia.',
  },
  {
    categoria: 'HURTO_VEHICULO',
    franja: null,
    umbralTasa: 0.3,
    accion: 'Estacionamientos vigilados e iluminados; marcado de autopartes.',
    evidencia: 'Vigilancia natural y reducción de oportunidad.',
  },
  {
    categoria: 'VIOLENCIA_GENERO',
    franja: null,
    umbralTasa: 0.3,
    accion:
      'Reforzar asistencia social, líneas de ayuda (144) y corredores seguros para mujeres.',
    evidencia: 'Atención temprana y redes de apoyo reducen la revictimización.',
  },
  {
    categoria: 'VIOLENCIA_INTRAFAMILIAR',
    franja: null,
    umbralTasa: 0.3,
    accion:
      'Difundir servicios de asistencia a víctimas y articular con salud y desarrollo social.',
    evidencia: 'Detección temprana desde salud pública y redes comunitarias.',
  },
  {
    categoria: 'LESIONES',
    franja: 'NOCHE',
    umbralTasa: 0.3,
    accion:
      'Transporte nocturno seguro y presencia preventiva en zonas de esparcimiento.',
    evidencia: 'Prevención situacional en horarios de mayor riesgo.',
  },
  {
    categoria: 'ESTAFA_ONLINE',
    franja: null,
    umbralTasa: 0.2,
    accion:
      'Talleres de ciberseguridad para adultos mayores e información sobre cómo denunciar.',
    evidencia: 'Educación preventiva frente a delitos emergentes.',
  },
] as const;

const servicios = [
  {
    nombre: 'Línea 144 — Violencia de género',
    tipo: 'Línea de ayuda',
    contacto: '144 (24 h)',
    zona: 'Centro',
  },
  {
    nombre: 'Centro de Asistencia a la Víctima',
    tipo: 'Asistencia legal y psicológica',
    contacto: 'Consultar en Fiscalía',
    zona: 'Centro',
  },
  {
    nombre: 'Centro de Salud Alto Comedero',
    tipo: 'Atención sanitaria',
    contacto: 'Guardia 24 h',
    zona: 'Alto Comedero',
  },
  {
    nombre: 'Oficina de la Mujer Palpalá',
    tipo: 'Asistencia social',
    contacto: 'Municipalidad de Palpalá',
    zona: 'Palpalá',
  },
  {
    nombre: 'Hospital de Perico',
    tipo: 'Atención sanitaria',
    contacto: 'Guardia 24 h',
    zona: 'Perico',
  },
];

async function main() {
  const password = process.env.SEED_PASSWORD ?? 'demo1234';
  const passwordHash = await bcrypt.hash(password, 10);
  for (const [email, nombre, role] of [
    ['admin@demo.local', 'Admin Demo', Role.ADMIN],
    ['analista@demo.local', 'Analista Demo', Role.ANALISTA],
  ] as const) {
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, nombre, role, passwordHash },
    });
  }

  await prisma.incidente.deleteMany();
  await prisma.servicioAsistencia.deleteMany();
  await prisma.recomendacion.deleteMany();
  await prisma.zona.deleteMany();

  const creadas: Zona[] = [];
  for (const { peso: _peso, ...z } of zonas) {
    creadas.push(await prisma.zona.create({ data: z }));
  }

  const hoy = new Date();
  const data = [];
  for (let n = 0; n < 4000; n++) {
    const idx = zonas.indexOf(elegir(zonas.map((z) => [z, z.peso])));
    const zona = creadas[idx];
    const categoria = elegir(categorias);
    const franja = elegir(franjasPorCategoria[categoria] ?? franjasDefault);
    const diasAtras = Math.floor(rand() ** 0.8 * 365);
    const fecha = new Date(hoy.getTime() - diasAtras * 86400000);
    data.push({
      categoria,
      franja,
      fecha,
      zonaId: zona.id,
      lat: zona.lat + (rand() - 0.5) * 0.02,
      lng: zona.lng + (rand() - 0.5) * 0.02,
      sintetico: true,
    });
  }
  await prisma.incidente.createMany({ data });
  await prisma.recomendacion.createMany({ data: [...reglas] });
  await prisma.servicioAsistencia.createMany({
    data: servicios.map(({ zona, ...s }) => ({
      ...s,
      zonaId: creadas.find((z) => z.nombre === zona)!.id,
    })),
  });

  console.log(
    `Seed sintético: ${creadas.length} zonas, ${data.length} incidentes, ${reglas.length} reglas.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
