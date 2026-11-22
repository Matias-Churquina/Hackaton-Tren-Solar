# Plan del proyecto — Inteligencia territorial y reportes ciudadanos (Jujuy)

> Entrega: **hoy (22/11/2026)**. Sin requisitos formales del jurado.
> Herramientas: **Spec Kit** (`.specify/` + `specs/`) para especificar y **GitHub Issues/Projects** para el seguimiento.
> Especificación detallada: [`specs/001-tickets-ciudadanos/spec.md`](../specs/001-tickets-ciudadanos/spec.md).

## 1. Visión

Una plataforma web que combina **datos oficiales agregados** (SNIC) con **reportes
ciudadanos** para construir un mapa de calor del delito en Jujuy, un dashboard
estadístico y recomendaciones de prevención situacional. Quien sufrió un delito o un
abuso puede reportarlo, de forma **anónima** o pidiendo que **alguien la contacte**.
El caso se deriva al **Ministerio de Salud** o a la **Policía** según la categoría.

## 2. Estado actual

| Pieza | Estado |
|---|---|
| Documentación, AGENTS.md, reglas de merge, CI | Mergeado (PR #1) |
| Backend NestJS + Prisma: heatmap, tendencias, recomendaciones, JWT 3 roles, Socket.IO | Mergeado (PR #2) |
| Arreglos del review automático de PR #2 (rate limit en login, límite de body, CORS de WS, ventanas de meses) | Rama `fix/backend-review-findings`, falta PR |
| Frontend React + Vite: mapa, panel, login, directorio | Rama `feat/frontend-react-vite`, falta PR |
| Tickets ciudadanos, operadores, modelo de negocio | **Este plan** |

## 3. Decisiones tomadas

| # | Tema | Decisión |
|---|---|---|
| 1 | Herramientas | Spec Kit + `PLAN.md` + GitHub Issues/Projects |
| 2 | Formulario | Público, sin cuenta |
| 3 | Datos según agravante | **Robo, hurto, hurto de vehículo, lesiones, homicidio, estafa:** datos mínimos obligatorios (nombre y un contacto) más una declaración jurada de veracidad, aunque no se haga la denuncia. **Abuso sexual, violencia de género, violencia intrafamiliar:** se permite el modo **anónimo**. |
| 4 | Roles | `PUBLICO` (reporta sin cuenta) · `CIUDADANO` (con cuenta: análisis de su zona y contacto con empresas de seguridad) · `OPERADOR_SALUD` · `OPERADOR_POLICIA` (cada uno ve solo sus tickets) · `ANALISTA` (todo agregado) · `ADMIN` (gestiona) |
| 5 | Derivación | Automática por categoría: abuso sexual → **Salud y Policía**; violencia de género e intrafamiliar → **Policía**, con recursos de Salud; robo, hurto, lesiones, homicidio, estafa → **Policía** |
| 6 | Categorías | Las del SNIC que ya están en el sistema, más `ABUSO_SEXUAL`. Acoso, violencia institucional y maltrato infantil quedan **fuera de alcance** |
| 7 | Ubicación | Se guarda la ubicación que marca la persona (uso interno de operadores). En el mapa y en las estadísticas se muestra solo **agregada por celda** |
| 8 | Adjuntos | **No** en el MVP (default recomendado) |
| 9 | Víctima o testigo | Se pregunta (default) |
| 10 | Contacto | Nombre, teléfono o email, horario preferido. **Sin DNI** (default) |
| 11 | Anónimo → denuncia | Si la persona marca "quiero denunciar", el ticket pasa a **con contacto** para que un operador la oriente |
| 12 | Anónimo sin denuncia | Envío sin seguimiento ni respuesta |
| 13 | Estados del ticket con contacto | `NUEVO → CONTACTADO → DERIVADO → CERRADO`, con notas internas del operador |
| 14 | Mapa | **Una sola capa** que combina datos oficiales y reportes ciudadanos. Los reportes entran **directo**, sin validación previa |
| 15 | Umbral mínimo | **Sin mínimo** (ver riesgo R1) |
| 16 | Retención | **Borrado lógico** de los datos de contacto (ver riesgo R3) |
| 17 | Datos de demo | Tickets **sintéticos**, marcados con `sintetico = true` |

## 4. Riesgos que hay que tener en cuenta

| # | Riesgo | Mitigación propuesta (no bloquea la entrega) |
|---|---|---|
| R1 | Sin umbral mínimo, en una zona con pocos casos un solo reporte de abuso puede **identificar a la víctima** | Usar la grilla de ~1 km² (nunca el punto exacto), mostrar intensidad y no conteos individuales, y mantener `MIN_COUNT` configurable (default 1) para activarlo después |
| R2 | Con entrada directa y sin validación se pueden **inflar zonas** con reportes falsos o estigmatizar barrios | Declaración jurada, rate limit por IP, captcha y una etiqueta "incluye reportes ciudadanos no verificados" en el mapa |
| R3 | Con borrado lógico el dato sigue existiendo. La Ley 25.326 (art. 16) da derecho a la **supresión** | Borrado lógico por defecto, más supresión física cuando la persona lo pide o al cumplirse el plazo de retención |
| R4 | Abuso y violencia son **datos sensibles** (art. 7) | Cifrar los datos de contacto en reposo, acceso solo para el operador asignado y auditoría de accesos |
| R5 | Conflicto de interés: una empresa de seguridad gana más cuanto más miedo haya | Las empresas ven solo datos agregados, nunca datos personales ni tickets. Transparencia sobre quién paga |

## 5. Modelo de negocio

**Principio:** la ciudadanía nunca paga por reportar ni por pedir ayuda, y **ningún
dato personal se comparte con empresas privadas**. Lo que se vende es el **análisis
agregado** y la **conexión voluntaria**.

### 5.1 Segmentos de clientes

| Segmento | Ejemplos | Qué compra |
|---|---|---|
| Empresas de seguridad privada (B2B) | Tiempo Seguridad S.R.L., Boxer S.A., Clarmi Seguridad S.R.L., Seguridad del Valle S.R.L., Seguridad Privada Integral S.R.L., S.P.E. Seguridad Privada Eficiente S.R.L., Agencia Integral de Seguridad e Investigaciones Security S.R.L. | Dashboard de inteligencia territorial, alertas por zona, perfil destacado en el directorio y solicitudes de contacto de ciudadanos que lo pidieron |
| Estado (B2G) | Ministerio de Seguridad, Ministerio de Salud, municipios | Licencia del panel de operadores y del observatorio, reportes para políticas públicas |
| Otros B2B (fase 2) | Aseguradoras, inmobiliarias, comercios, consorcios | Informes de riesgo por zona (agregados) |
| Ciudadanía (B2C) | Vecinos y vecinas con cuenta | Gratis: reportar, ver el mapa, análisis de su zona, alertas |

### 5.2 Fuentes de ingreso (hipótesis para validar)

1. **Suscripción SaaS para empresas de seguridad**, con planes por cantidad de zonas: dashboard agregado, tendencias, recomendaciones, exportes y alertas en tiempo real.
2. **Solicitudes de contacto con consentimiento (lead generation):** un `CIUDADANO` pide "quiero que una empresa me contacte para evaluar la seguridad de mi casa". Solo con ese consentimiento explícito se le pasa a la empresa elegida el contacto que la persona decidió compartir. Se cobra por solicitud o va incluido en el plan.
3. **Directorio destacado:** las empresas habilitadas por la Policía de la Provincia aparecen en el análisis de zona (marcadas como "patrocinado").
4. **Licencia B2G** para Salud y Policía: panel de operadores, derivación y estadísticas.
5. **Informes a medida** para aseguradoras e inmobiliarias (fase 2).

### 5.3 Cómo se lo vendemos a la gente (adopción B2C)

- **Propuesta de valor:** "Conocé la seguridad de tu barrio y pedí ayuda en 1 minuto, de forma anónima si lo necesitás".
- **Gancho con cuenta:** un análisis gratuito de la zona donde vivís (tendencia, horarios de más riesgo, recomendaciones) y alertas cuando sube un indicador.
- **Canales:** centros vecinales, grupos de WhatsApp barriales, escuelas y centros de salud (cartelería con QR), redes de la provincia y del municipio, y radios locales.
- **Confianza:** sello "tus datos no se venden", aviso de privacidad claro y un aliado institucional (Ministerio de Salud y Policía).
- **Métricas:** reportes por semana, porcentaje con contacto, tiempo hasta el primer contacto, ciudadanos registrados y conversión de solicitudes a empresas.

### 5.4 Lienzo resumido

| Bloque | Contenido |
|---|---|
| Propuesta de valor | Ciudadanía: ayuda y conocimiento de su zona. Empresas: inteligencia territorial accionable. Estado: datos que la denuncia no capta (subregistro) |
| Canales | Web responsive, QR en territorio, ventas directas a las 7 empresas, convenios con ministerios |
| Relación | Autoservicio (B2C), gestor de cuenta (B2B/B2G) |
| Recursos clave | Datos agregados, plataforma, alianzas institucionales |
| Socios | Ministerio de Salud, Policía de Jujuy, municipios, ONGs de asistencia a víctimas |
| Costos | Hosting (Railway/Vercel), desarrollo, soporte de operadores, cumplimiento legal |

## 6. Lógica de negocio

### 6.1 Alta del ticket (formulario público)

| Categoría | Modo | Datos obligatorios |
|---|---|---|
| `ABUSO_SEXUAL`, `VIOLENCIA_GENERO`, `VIOLENCIA_INTRAFAMILIAR` | Anónimo permitido | Categoría, ubicación, fecha/franja, víctima o testigo |
| `ROBO`, `HURTO`, `HURTO_VEHICULO`, `LESIONES`, `HOMICIDIO`, `ESTAFA_ONLINE` | Con contacto | Lo anterior + nombre, teléfono o email, horario preferido y declaración jurada aceptada |

- Validaciones: ubicación dentro de Jujuy, rate limit de 5 tickets por IP por hora, sin adjuntos.
- Un ticket anónimo con "quiero denunciar" pide los datos de contacto y pasa a modo con contacto.
- El ticket anónimo es solo un envío: no tiene estados ni respuesta.

### 6.2 Derivación automática por categoría

- `ABUSO_SEXUAL` → Salud y Policía.
- Resto de categorías → Policía (en violencia de género e intrafamiliar se muestran recursos de Salud).
- Al crearse, se emite un aviso por Socket.IO a los operadores del organismo destino, sin datos personales.

### 6.3 Ciclo de vida del ticket con contacto

`NUEVO → CONTACTADO → DERIVADO → CERRADO`

- Solo el operador del organismo destino cambia el estado y agrega notas internas.
- Cada cambio queda auditado (quién y cuándo).

### 6.4 Quién ve qué

| Rol | Ve |
|---|---|
| `PUBLICO` | Mapa agregado, formulario, directorio |
| `CIUDADANO` | Lo anterior + análisis de su zona + solicitud de contacto a una empresa |
| `OPERADOR_SALUD` / `OPERADOR_POLICIA` | Solo los tickets de su organismo, con el contacto descifrado |
| `ANALISTA` | Todo agregado: tendencias y recomendaciones |
| `ADMIN` | Usuarios, reglas, empresas, cargas oficiales |
| Empresa de seguridad | Dashboard agregado de sus zonas + solicitudes de contacto con consentimiento |

Las empresas nunca ven tickets ni datos personales.

### 6.5 Mapa y estadísticas

- Una sola capa: incidentes oficiales + tickets, agregados en celdas de ~1 km².
- Indicadores: conteo, tasa por 1.000 habitantes, variación porcentual contra el período anterior, picos por franja horaria y recomendaciones situacionales.
- Sin umbral mínimo (`MIN_COUNT=1`, configurable) y leyenda "incluye reportes ciudadanos no verificados".

### 6.6 Solicitud de contacto con una empresa (`CIUDADANO`)

1. El ciudadano elige una empresa del directorio y marca el consentimiento explícito.
2. Se crea una `SolicitudContactoEmpresa` con solo los datos que eligió compartir.
3. Solo esa empresa la recibe. La solicitud se cobra por unidad o va incluida en el plan.

### 6.7 Datos

- Contacto cifrado en reposo.
- Borrado lógico por defecto; borrado físico si la persona pide la supresión (Ley 25.326, art. 16).
- Datos de demo sintéticos, marcados con `sintetico = true`.

## 7. Alcance para la entrega de hoy (MVP)

Prioridad P0 (demo):
1. Mergear los arreglos de review del backend y el frontend existente.
2. Modelo `Ticket` en Prisma (categoría, modo anónimo o con contacto, víctima o testigo, ubicación, celda, franja, estado, organismo destino, `sintetico`, `deletedAt`) más `ContactoTicket` cifrado y `NotaTicket`.
3. `POST /api/tickets` público, con reglas por categoría, declaración jurada y rate limit.
4. Derivación automática a `OPERADOR_SALUD` u `OPERADOR_POLICIA`, panel de operador con estados y notas, y notificación por Socket.IO.
5. Heatmap y tendencias combinando incidentes oficiales y tickets, en una capa.
6. Formulario público de reporte en el frontend (pasos: categoría → ubicación en el mapa → detalle → contacto si corresponde → confirmación).
7. Seed de tickets sintéticos.

Prioridad P1 (si alcanza el tiempo):
8. Rol `CIUDADANO`: registro, análisis de su zona y botón "quiero que una empresa me contacte" con consentimiento.
9. Directorio de empresas de seguridad (datos de demo).
10. Deploy en Railway y Vercel.

Fuera de alcance: adjuntos, categorías nuevas (acoso, violencia institucional, maltrato infantil), pagos, MercadoPago, OSRM.

## 8. Seguimiento

Cada ítem del §7 es un **issue** de GitHub en el Project del repo, con una rama `feat/…` o `fix/…` y un PR propio, según `CONTRIBUTING.md`.
