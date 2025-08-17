# Microapp Starter (Full stack + Playwright + Docker)

Instrucciones rápidas:

1. Construir y levantar todo (recomendado):
   ```bash
   docker-compose build --no-cache
   docker-compose up
Qué hace cada servicio:

backend: Express + SQLite en puerto 4000.

frontend: React + Vite en puerto 3000. Usa VITE_API_URL para conectar con backend (en docker-compose apunta a http://backend:4000).

tests: Contenedor con Playwright que ejecuta npx playwright test apuntando a http://frontend:3000.

Notas importantes:

No montamos los tests en el contenedor para evitar sobrescribir node_modules de la build. Si editas tests localmente y quieres que el contenedor los vea, modifica docker-compose.yml (pero ten cuidado con node_modules).

Si desarrollas localmente sin docker, instala dependencias en cada carpeta (npm install) y lanza backend + frontend manualmente.

Si aparecen errores de módulos nativos (esbuild, sqlite3, etc.), asegúrate de reconstruir imágenes sin cache:
docker-compose build --no-cache

Comandos útiles:

Ver logs: docker-compose logs -f

Ejecutar tests manualmente dentro del contenedor (si ya está construido):
docker-compose run --rm tests npx playwright test
