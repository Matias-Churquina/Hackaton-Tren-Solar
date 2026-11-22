# Documentación — Inteligencia territorial para la prevención del delito (Jujuy)

## 1. Problema

En Jujuy no hay un portal abierto con estadísticas delictivas detalladas. La fuente
oficial es el **SNIC** (Ministerio de Seguridad de la Nación), que agrega denuncias
por provincia y departamento. Estas cifras tienen **subregistro** (DiPEC): muchos
delitos no se denuncian y la proporción varía por zona y año. Además, las zonas
más patrulladas generan más denuncias registradas (sesgo de reporte policial).

## 2. Propuesta

Plataforma web de **inteligencia territorial proactiva**: mapa de calor de
incidentes agregados + panel de tendencias + recomendaciones de **prevención
situacional** (iluminación, transporte seguro, corredores seguros, cámaras
comunitarias, asistencia a víctimas). **No** hace perfilamiento de personas ni
predicciones de culpabilidad.

### Pitch (1 minuto)

Un mapa interactivo con un panel de indicadores y un "asistente" que sugiere
acciones situacionales basadas en evidencia, con datos oficiales agregados
(completados con datos sintéticos para la demo), filtros por tipo de incidente y
normalización por población, respetando la Ley 25.326.

## 3. Alcance del MVP (hackatón)

| Módulo | Descripción |
|---|---|
| Mapa de calor | Capas por tipo de incidente, período (3/6/12 meses), conteo absoluto o tasa por 1.000 hab. |
| Panel de tendencias | Series mensuales por delito y zona, Δ% vs período anterior, detección de picos. |
| Recomendaciones | Reglas heurísticas (no IA predictiva): patrón detectado → acción preventiva sugerida. |
| Filtros | Tipo, franja horaria, género de víctima, tipo de arma (si los datos lo permiten). |
| Directorio de asistencia | Servicios de apoyo a víctimas por zona (refugios, atención psicológica, legal). |
| Tiempo real | Notificación por WebSocket cuando se cargan datos nuevos o se dispara una alerta. |

**Datos:** sintéticos, realistas y **etiquetados como sintéticos**, con
coordenadas dentro de las ciudades principales (San Salvador de Jujuy, Palpalá,
Perico, Humahuaca, etc.).

## 4. Categorías y granularidad

- **Contra las personas:** homicidios, lesiones, violencia de género, violencia intrafamiliar.
- **Contra la propiedad:** robos, hurtos, hurto de vehículos.
- **Emergentes:** estafas online.
- **Espacial:** departamento / municipio / barrio, o celdas de ~1 km².
- **Temporal:** mensual o trimestral (público: trimestral o anual).

## 5. Fuentes de datos

| Fuente | Uso | Disponibilidad |
|---|---|---|
| SNIC (denuncias policiales) | Conteo oficial por tipo, mes y departamento | Pública, agregada |
| Encuesta Nacional de Victimización (INDEC 2017) | Calibrar subregistro | Pública, provincial |
| 911 provincial | Volumen y franja horaria de alertas | No abierta |
| SAME 107 / hospitales | Proxy de violencia grave no denunciada | Confidencial |
| Ministerio Público / Poder Judicial | Tendencias de causas | Interna |
| Medios / mapas ciudadanos | Complemento cualitativo | Pública, con sesgo |

## 6. Privacidad y estigmatización

- **Agregación** espacial y temporal; nunca incidentes individuales ni direcciones exactas.
- **Umbral mínimo** (k-anonimato): una celda/zona solo se muestra si supera `MIN_COUNT` incidentes.
- **Anonimización:** sin datos personales ni sensibles (Ley 25.326, Hábeas Data).
- **Acceso por roles:** el público ve datos muy agregados; analistas ven más detalle, también agregado.
- **Gobernanza:** responsable de la plataforma (p. ej. Observatorio de Seguridad provincial), auditoría y canal de reclamos.

## 7. Roles

| Rol | Acceso |
|---|---|
| `PUBLICO` | Mapa agregado (trimestral, umbral alto), directorio de asistencia. Sin login. |
| `ANALISTA` | Mapa y panel con mayor detalle (mensual), filtros avanzados, recomendaciones. |
| `ADMIN` | Todo lo anterior + carga de datos, gestión de usuarios y reglas. |

## 8. Stack

### Frontend (`frontend/`)
- React 18 + TypeScript + Vite
- Tailwind CSS v3 + sistema propio `src/styles/figma.css` (tokens de diseño)
- React Router v6
- Leaflet + React-Leaflet (mapa y heatmap)
- socket.io-client (tiempo real)
- Axios
- Lucide (íconos)

### Backend (`backend/`)
- NestJS + TypeScript
- **Prisma ORM** + PostgreSQL (reemplaza a TypeORM)
- JWT + Passport (auth, 3 roles)
- Socket.IO gateway (WebSockets)
- Swagger (docs en `/api/docs`)
- bcrypt (hash de contraseñas)

### Servicios externos
- Carto/OSM (tiles del mapa)
- OSRM, MercadoPago Checkout Pro y Geolocation API: **pendientes de definir** su
  uso en este proyecto; no están integrados.

### Infraestructura
- Railway (backend + PostgreSQL)
- Vercel (frontend)
- GitHub Actions (CI)

## 9. Arquitectura

```
[Vercel] React SPA ──HTTP (Axios)──▶ [Railway] NestJS API ──Prisma──▶ PostgreSQL
        ▲                                   │
        └────────── Socket.IO ◀─────────────┘
        └── tiles Carto/OSM
```

### Modelo de datos (Prisma)

- `User` — email, passwordHash (bcrypt), role (`PUBLICO | ANALISTA | ADMIN`).
- `Zona` — nombre, tipo (departamento/municipio/barrio), población, centroide (lat/lng).
- `Incidente` — categoría, fecha, franja horaria, lat/lng aproximada, zona, `sintetico: boolean`.
- `Recomendacion` — regla (categoría + condición), acción sugerida, evidencia.
- `ServicioAsistencia` — nombre, tipo, zona, contacto.

## 10. Variables de entorno

| Variable | Dónde | Descripción |
|---|---|---|
| `DATABASE_URL` | backend | Cadena de conexión PostgreSQL |
| `JWT_SECRET` | backend | Secreto para firmar tokens |
| `JWT_EXPIRES_IN` | backend | Duración del token (p. ej. `1d`) |
| `CORS_ORIGIN` | backend | URL del frontend |
| `MIN_COUNT` | backend | Umbral mínimo de incidentes para mostrar una zona |
| `VITE_API_URL` | frontend | URL base de la API |
| `VITE_WS_URL` | frontend | URL del servidor Socket.IO |

## 11. Métricas de validación

- Funcionamiento: tiempo de respuesta, carga de datos en tiempo real, claridad (encuesta a usuarios piloto).
- Consistencia: comparar heatmaps sintéticos con porciones hold-out.
- Impacto (post-hackatón): reducción de delitos en zonas intervenidas, índice de confianza ciudadana.

## 12. Aliados institucionales

Ministerio de Seguridad de Jujuy, Fiscalía/MPA, Ministerio de Salud, municipios,
comisarías, SAME, ONGs y universidades locales.
