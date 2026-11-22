# AGENTS.md

Guía para agentes de IA (y humanos) que trabajan en este repositorio.
La documentación funcional está en [docs/DOCUMENTACION.md](docs/DOCUMENTACION.md).
Las reglas de ramas, merge y verificación están en [CONTRIBUTING.md](CONTRIBUTING.md) y son obligatorias.

## Estructura

```
backend/    NestJS + Prisma + MySQL 8 (API REST, auth JWT, Socket.IO, Swagger)
frontend/   React 18 + Vite + TypeScript + Tailwind + Leaflet
docs/       Documentación del proyecto
.github/    CI (GitHub Actions) y plantilla de PR
```

## Requisitos

- Node.js 20 LTS y npm
- MySQL 8 (local o Docker: `docker run -d --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=jujuy mysql:8`)
- Plan y orden de tareas: [docs/PLAN.md](docs/PLAN.md)

## Comandos

### Backend (`cd backend`)

| Acción | Comando |
|---|---|
| Instalar | `npm ci` |
| Variables | `cp .env.example .env` |
| Migrar DB | `npx prisma migrate dev` |
| Datos sintéticos | `npm run seed` |
| Desarrollo | `npm run start:dev` (API en `:3000`, Swagger en `/api/docs`) |
| Lint | `npm run lint` |
| Tipos/compilar | `npm run build` |
| Tests | `npm test` |

### Frontend (`cd frontend`)

| Acción | Comando |
|---|---|
| Instalar | `npm ci` |
| Variables | `cp .env.example .env` |
| Desarrollo | `npm run dev` (Vite en `:5173`) |
| Lint | `npm run lint` |
| Tipos | `npm run typecheck` |
| Build | `npm run build` |

## Reglas para agentes

1. **Una rama por cambio**, creada desde `main` actualizado. Nunca commitear ni pushear directo a `main`.
2. Antes de abrir o actualizar un PR, correr en cada app tocada: `lint`, `typecheck`/`build` y `test`. Todo debe pasar.
3. **ORM: Prisma.** No agregar TypeORM ni SQL crudo salvo justificación en el PR. Todo cambio de esquema va en `backend/prisma/schema.prisma` con su migración (`npx prisma migrate dev --name <nombre>`). No editar migraciones ya mergeadas.
4. **Privacidad (Ley 25.326):** nunca exponer incidentes individuales, direcciones exactas ni datos personales. Los endpoints públicos devuelven solo agregados que superen `MIN_COUNT`. Los datos sintéticos deben quedar marcados (`sintetico = true`).
5. **No perfilamiento:** las recomendaciones son reglas situacionales (iluminación, patrullaje focal, transporte seguro, asistencia). No agregar predicción sobre personas.
6. **Auth:** proteger endpoints con `JwtAuthGuard` + `@Roles(...)`. Roles válidos: `PUBLICO`, `ANALISTA`, `ADMIN`. Contraseñas siempre con bcrypt.
7. **Secretos:** nunca commitear `.env` ni claves. Agregar variables nuevas a `.env.example` y a `docs/DOCUMENTACION.md`.
8. **Estilo:** TypeScript estricto, sin `any` salvo justificación. Seguir las convenciones existentes del módulo. Componentes React en `PascalCase.tsx`; estilos con Tailwind y tokens de `figma.css`.
9. **Dependencias:** usar versiones estables. Justificar en el PR cualquier dependencia nueva.
10. Mantener la documentación al día: si cambia un comando, endpoint o variable, actualizar este archivo o `docs/`.
