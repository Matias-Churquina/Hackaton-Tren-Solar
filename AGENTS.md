# AGENTS.md

Guía obligatoria para agentes de IA (Devin, Claude Code, Copilot) y personas que codifican en este repositorio.

**Antes de escribir código, leer en este orden:**
1. [docs/PLAN.md](docs/PLAN.md): decisiones, modelo de datos, API, pantallas y **orden de tareas (§7)**. Es la fuente de verdad.
2. [specs/001-tickets-ciudadanos/spec.md](specs/001-tickets-ciudadanos/spec.md): user stories y requisitos funcionales.
3. [CONTRIBUTING.md](CONTRIBUTING.md): ramas, commits, PR y merge.
4. [.specify/memory/constitution.md](.specify/memory/constitution.md): principios no negociables.

Si este archivo y `docs/PLAN.md` se contradicen, manda `docs/PLAN.md`, y hay que corregir este archivo en el mismo PR.

## Producto en una línea

Mapa de calor y estadísticas del delito en la **ciudad de San Salvador de Jujuy**, que combina datos oficiales con reportes ciudadanos (anónimos o con contacto) derivados a **Salud** o **Policía**.

## Alcance

- **Dentro:** ciudad de San Salvador de Jujuy; formulario público de tickets; derivación; panel de operadores; mapa KDE; estadísticas; panel ADMIN; precarga de datos ficticios.
- **Fuera:** resto de la provincia, empresas de seguridad (rol, directorio, contacto), adjuntos, pagos/MercadoPago, OSRM, categorías nuevas (acoso, violencia institucional, maltrato infantil).

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript + Vite · Tailwind v3 + `src/styles/figma.css` · shadcn/ui (Radix) · React Router v6 · React-Leaflet 4 + `leaflet.heat` · Recharts · React Hook Form + Zod · Axios · socket.io-client · Lucide · Sonner |
| Backend | NestJS 10 + TypeScript · **Prisma 5 + MySQL 8** · JWT + Passport · bcrypt · `@nestjs/throttler` · Socket.IO · Swagger · class-validator |
| Infra | Docker (`mysql:8`) · Railway (API + MySQL) · Vercel (frontend) · GitHub Actions |

No usar React 19, React-Leaflet 5, Tailwind v4, TypeORM ni PostgreSQL.

## Estructura objetivo

```
backend/
  prisma/schema.prisma        # único esquema; migraciones en prisma/migrations
  prisma/seed.ts              # solo en T013
  src/
    main.ts                   # prefijo /api, Swagger /api/docs, body 5 MB, CORS múltiple
    prisma/                   # PrismaService
    common/                   # guards, decoradores @Roles, crypto (AES-256-GCM), geo (punto en polígono, grilla)
    auth/  users/  barrios/  categorias/  tickets/  operador/
    mapa/  estadisticas/  recomendaciones/  servicios/  admin/  realtime/
  test/                       # e2e con supertest contra MySQL
frontend/
  src/
    main.tsx  App.tsx  routes.tsx
    styles/figma.css          # tokens de diseño (variables RGB para Tailwind)
    components/ui/            # componentes shadcn/ui (generados, no editar a mano salvo estilo)
    components/               # componentes compartidos (Mapa, Leyenda, Layout…)
    features/                 # mapa/ reportar/ operador/ estadisticas/ admin/ auth/
    lib/api.ts  lib/socket.ts # Axios con interceptor JWT, cliente Socket.IO
    hooks/
docs/  specs/  .specify/  .github/
```

Cada módulo de NestJS lleva `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/` y `*.spec.ts`.

## Puesta en marcha

```bash
docker run -d --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=jujuy mysql:8
cd backend && npm ci && cp .env.example .env && npx prisma migrate dev && npm run start:dev
cd frontend && npm ci && cp .env.example .env && npm run dev
```

### Variables de entorno

| Variable | App | Ejemplo / nota |
|---|---|---|
| `DATABASE_URL` | backend | `mysql://root:root@localhost:3306/jujuy` |
| `JWT_SECRET` | backend | cadena larga aleatoria |
| `JWT_EXPIRES_IN` | backend | `8h` |
| `ENCRYPTION_KEY` | backend | 32 bytes en base64 (`openssl rand -base64 32`) para cifrar contactos |
| `CORS_ORIGIN` | backend | `http://localhost:5173` (varios separados por comas) |
| `MIN_COUNT` | backend | `1` |
| `PORT` | backend | `3000` |
| `VITE_API_URL` | frontend | `http://localhost:3000/api` |
| `VITE_WS_URL` | frontend | `http://localhost:3000` |

Toda variable nueva va a `.env.example` y a esta tabla.

## Comandos de verificación

| App | Comandos que deben pasar antes de abrir el PR |
|---|---|
| `backend/` | `npm run lint` · `npm run build` · `npm test` · `npx prisma validate` · `npm run test:e2e` (si hay e2e) |
| `frontend/` | `npm run lint` · `npm run typecheck` · `npm run build` |

Otros: `npx prisma migrate dev --name <nombre>` (cambio de esquema), `npm run seed` (desde T013), Swagger en `http://localhost:3000/api/docs`, app en `http://localhost:5173`.

## Flujo de trabajo por tarea

1. Elegir la próxima tarea de `docs/PLAN.md` §7 **cuyas dependencias estén mergeadas**. Si trabajan dos personas, cada una toma tareas distintas (las marcadas ∥) y lo avisa en el issue.
2. `git checkout main && git pull && git checkout -b <rama de la tabla §7>`.
3. Implementar **solo** esa tarea. Si aparece otro cambio, va en otra rama.
4. Escribir tests junto con el código.
5. Correr la verificación de la app tocada.
6. Commits en Conventional Commits (`feat(backend): …`), PR contra `main` con la plantilla, enlazando el issue.
7. Marcar la tarea en `specs/001-tickets-ciudadanos/tasks.md` en el mismo PR.

**Hecho** = criterio de la columna "Hecho cuando" de §7 + CI verde + docs actualizadas.

## Reglas de código

### Generales
1. TypeScript estricto, sin `any` salvo justificación en el PR.
2. Textos de UI, mensajes de error y nombres de dominio en **español** (`Ticket`, `Barrio`, `organismo`); código de infraestructura en inglés si es convención del framework.
3. Dependencias estables y justificadas en el PR. Nada que no esté en el stack sin preguntar.
4. Sin código muerto, sin `console.log` en commits.

### Backend
5. **Prisma es el único acceso a datos.** Sin SQL crudo salvo justificación. Cambios de esquema solo en `schema.prisma` con su migración. No editar migraciones ya mergeadas.
6. **MySQL:** lat/lng como `Decimal(9,6)`; textos largos con `@db.Text`; polígonos como `Json`. Sin tipos espaciales: punto en polígono y grilla se calculan en `common/geo`.
7. Prefijo `/api`. Cada endpoint con DTO de `class-validator` y decoradores de Swagger.
8. Auth: `JwtAuthGuard` + `RolesGuard` + `@Roles(...)`. Roles: `CIUDADANO`, `OPERADOR_SALUD`, `OPERADOR_POLICIA`, `ANALISTA`, `ADMIN` (lo público va sin guard). Contraseñas con bcrypt.
9. Login con throttling de 5 intentos por minuto; `POST /api/tickets` con 5 por IP por hora.
10. Socket.IO: `ticket:nuevo` solo a la sala del organismo y sin datos personales; `mapa:actualizado` a todos con conteo y timestamp.
11. Fechas: meses completos y resta de meses sin desborde de día (ver `restarMeses`).

### Privacidad (Ley 25.326), no negociable
12. Ningún endpoint público ni evento de Socket.IO devuelve **coordenadas exactas, datos de contacto, relatos ni tickets individuales**. El mapa recibe puntos agrupados en una grilla de ~100 m.
13. Datos de contacto cifrados con AES-256-GCM (`common/crypto`); solo se descifran en `GET /api/operador/tickets/:id` para el organismo derivado, y el acceso se audita.
14. Nunca loguear datos de contacto ni relatos.
15. Sin perfilamiento: las recomendaciones son reglas situacionales explicables, sin predicción sobre personas.
16. Todo dato ficticio lleva `sintetico = true`.

### Datos de demo
17. **No crear seed ni datos de demo antes de T013.** Los tests usan fixtures propios dentro de `test/` o del `*.spec.ts`.

### Frontend
18. Componentes en `PascalCase.tsx`, un componente por archivo. Lógica de datos en hooks (`useMapaCalor`, `useTickets`…).
19. Estilos solo con Tailwind + tokens de `figma.css`; componentes base de shadcn/ui. Íconos de Lucide.
20. Formularios con React Hook Form + Zod; los esquemas Zod reflejan los DTO del backend.
21. Mapa: `leaflet.heat` con rampa de 10 clases de verde a rojo, leyenda Baja/Media/Alta, norte, escala y fuente "Datos oficiales + reportes ciudadanos no verificados" (ver `docs/PLAN.md` §6.5). Sin marcadores de hechos.
22. Accesible: labels en todos los inputs, contraste AA, navegable con teclado, responsive (mobile first: el formulario se usa desde el celular).
23. El formulario muestra siempre los recursos de urgencia (911, 144, 102) y aclara que **no es una denuncia formal**.

## Git

- Nunca commitear ni pushear a `main`; nunca `force-push` a `main`.
- Nunca commitear `.env`, claves ni datos reales de personas.
- Mantener la documentación al día: si cambia un comando, endpoint o variable, actualizar este archivo o `docs/`.

## Cuándo preguntar

Si `docs/PLAN.md` no cubre una decisión de producto, privacidad o modelo de datos, **preguntar antes de inventar** y dejar la respuesta registrada en `docs/PLAN.md` §3.
