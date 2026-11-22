# Tasks: Tickets ciudadanos

Cada tarea corresponde a un issue de GitHub y a una rama propia.

## P0 — Entrega de hoy
- [ ] T001 Mergear `fix/backend-review-findings` (rate limit en login, límite de body, CORS de WS, ventanas de meses)
- [ ] T002 Mergear `feat/frontend-react-vite` (mapa, panel, login, directorio)
- [ ] T003 Prisma: `Ticket`, `ContactoTicket`, `NotaTicket`, enums y `ABUSO_SEXUAL`; roles `OPERADOR_SALUD`, `OPERADOR_POLICIA`, `CIUDADANO`; migración
- [ ] T004 Backend: `POST /api/tickets` público con validación por categoría, declaración jurada, cifrado del contacto y rate limit
- [ ] T005 Backend: derivación automática y endpoints de operador (listado por organismo, cambio de estado, notas) más evento Socket.IO
- [ ] T006 Backend: heatmap, conteo por zona y tendencias combinando incidentes y tickets; `MIN_COUNT` configurable
- [ ] T007 Seed: tickets sintéticos y usuarios operador de demo
- [ ] T008 Frontend: formulario público de reporte por pasos con recursos de urgencia
- [ ] T009 Frontend: panel de operador (bandeja, detalle, estados, notas)
- [ ] T010 Frontend: leyenda "incluye reportes ciudadanos no verificados" y actualización en vivo del mapa

## P1 — Si alcanza el tiempo
- [ ] T011 Rol `CIUDADANO`: registro y análisis de su zona
- [ ] T012 Directorio de empresas de seguridad y solicitud de contacto con consentimiento
- [ ] T013 Deploy en Railway (backend + PostgreSQL) y Vercel (frontend)
- [ ] T014 Pitch: modelo de negocio y demo
