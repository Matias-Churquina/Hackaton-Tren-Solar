# CLAUDE.md

Instrucciones para Claude Code. Las reglas del proyecto están en `AGENTS.md` y el plan en `docs/PLAN.md`: se importan acá y son obligatorias.

@AGENTS.md
@docs/PLAN.md

## Cómo trabajar en este repo

1. Al empezar, decir qué tarea de `docs/PLAN.md` §7 vas a hacer y confirmar que sus dependencias ya están en `main`.
2. Crear la rama indicada en la tabla §7 desde `main` actualizado. Una tarea por rama y por PR.
3. Planificar antes de editar (modo plan): listar archivos a crear o tocar y tests a escribir.
4. Implementar, testear y correr la verificación de `AGENTS.md` antes de proponer el commit.
5. Abrir el PR con `gh pr create` usando `.github/pull_request_template.md`.

## Herramientas recomendadas

| Herramienta | Uso en este repo | Instalación |
|---|---|---|
| Plugin `frontend-design` | Diseñar pantallas (§6.10 del plan) con buena calidad visual, respetando `figma.css` y shadcn/ui | `/plugin install frontend-design@claude-plugins-official` |
| Plugin `playwright` | Abrir `http://localhost:5173`, sacar capturas y verificar cada pantalla antes del PR | `/plugin install playwright@claude-plugins-official` |
| Plugin `figma` | Leer diseños y tokens si hay archivo de Figma | `/plugin install figma@claude-plugins-official` |
| MCP de shadcn/ui | Agregar componentes del registro (`button`, `dialog`, `form`, `table`…) | `npx shadcn@latest mcp init --client claude` dentro de `frontend/` |

Si el marketplace no aparece: `/plugin marketplace add anthropics/claude-plugins-official`.

## Verificación de UI

- Toda pantalla nueva se prueba con Playwright en 390 px (celular) y 1280 px (escritorio), y la captura va en el PR.
- El mapa se compara con la referencia de §6.5 del plan (rampa verde→rojo, leyenda, norte, escala, fuente).
- Revisar en DevTools → Network que ninguna respuesta pública tenga coordenadas exactas ni datos de contacto.

## No hacer

- No pushear a `main` ni mergear PRs.
- No crear datos de demo antes de T013.
- No agregar nada de empresas de seguridad ni del resto de la provincia.
- No instalar dependencias fuera del stack de `AGENTS.md` sin preguntar.
- No desactivar lint, tests ni reglas de TypeScript para que pase el CI.
