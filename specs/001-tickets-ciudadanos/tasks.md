# Tasks: Tickets ciudadanos

Cada tarea corresponde a un issue de GitHub y a una rama propia. Orden, ramas y dependencias: [`docs/PLAN.md` §7](../../docs/PLAN.md).

## P0, entrega de hoy
- [ ] T001 Reset del backend: NestJS limpio, Prisma con MySQL 8, Docker, `.env.example`, CI con servicio MySQL
- [ ] T002 Base del frontend: Vite + Tailwind + `figma.css` + shadcn/ui, router, layout, Axios
- [ ] T003 Esquema Prisma completo (`User`, `Barrio`, `CategoriaConfig`, `Incidente`, `Ticket`, `TicketDerivacion`, `ContactoTicket`, `NotaTicket`, `HistorialEstado`, `ServicioAsistencia`, `ReglaRecomendacion`) y migración
- [ ] T004 Auth JWT por roles, throttling en login, CRUD de usuarios (ADMIN)
- [ ] T005 Tickets: `POST /api/tickets` público, reglas por categoría, declaración jurada, cifrado, derivación, Socket.IO
- [ ] T006 Mapa de calor agrupado (~100 m), estadísticas y recomendaciones
- [ ] T007 Endpoints de operador: bandeja, estados, notas, auditoría
- [ ] T008 Endpoints de admin: barrios, categorías, servicios, reglas, carga masiva, supresión
- [ ] T009 Frontend: mapa KDE, leyenda, filtros, panel lateral, tiempo real
- [ ] T010 Frontend: formulario público por pasos
- [ ] T011 Frontend: panel de operador
- [ ] T012 Frontend: estadísticas y panel admin
- [ ] T013 Precarga de datos ficticios (solo con la lógica completa)
- [ ] T014 Deploy en Railway (backend + MySQL) y Vercel
- [x] T015 Pitch y guion de la demo (`docs/PITCH.md`)

## P1, si alcanza el tiempo
- [ ] T016 Rol `CIUDADANO`: registro y análisis de toda la ciudad (`/estadisticas`)

## Fuera de alcance
Resto de la provincia (el alcance es la ciudad de San Salvador de Jujuy), empresas de seguridad (rol, directorio, solicitudes de contacto), adjuntos, pagos, OSRM.
