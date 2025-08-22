
# Makefile para gestionar microApp (frontends, backends, tests QA)
# Mantiene install, hot y watch. Añade: monitor, test, report, report-open

# Variables
FRONTS = dashboard-mfe admin-mfe
BACKS  = users-api items-api api-gateway reporter
SERVICES = $(FRONTS) $(BACKS)
TESTS = microapp-tests

.PHONY: all install up logs restart clean rebuild watch hot monitor test test-ui report report-open

# Instala npm dependencies en todos los servicios
install:
	@echo "Instalando dependencias en todos los servicios..."
	@for service in $(SERVICES); do \
		if [ -f $$service/package.json ]; then \
			echo "Instalando $$service..."; \
			(cd $$service && npm install); \
		fi \
	done

# Levanta todos los contenedores en background
up:
	@echo "Levantando contenedores..."
	docker-compose up -d --build

# Monitorea logs de todos los servicios o de uno específico
logs:
	@echo "Mostrando logs de todos los servicios..."
	docker-compose logs -f

logs-%:
	@echo "Mostrando logs de servicio $*..."
	docker-compose logs -f $*

# Reinicia todos los contenedores
restart:
	@echo "Reiniciando todos los contenedores..."
	docker-compose restart

# Reinicia un servicio específico
restart-%:
	@echo "Reiniciando servicio $*..."
	docker-compose restart $*

# Limpieza completa de contenedores, imágenes intermedias y volúmenes
clean:
	@echo "Deteniendo y eliminando contenedores y volúmenes..."
	docker-compose down -v --remove-orphans
	@echo "Eliminando imágenes intermedias de Docker..."
	docker system prune -af

# Reconstruye todo desde cero (clean + install + up)
rebuild: clean install up
	@echo "Reconstrucción completa terminada."

# Hot-reload para frontends y backends
hot:
	@echo "Iniciando hot-reload de todos los servicios..."
	@for dir in $(FRONTS) $(BACKS); do \
		if [ -d $$dir ]; then \
			if echo $(FRONTS) | grep -w $$dir > /dev/null; then \
				echo "Hot-reload frontend $$dir con Vite..."; \
				(cd $$dir && npm run dev) & \
			else \
				echo "Hot-reload backend $$dir con nodemon..."; \
				(cd $$dir && npx nodemon --watch src --ext js,ts,json --exec "node ./src/index.js") & \
			fi \
		fi \
	done
	@wait

# Watch para frontends con reinicio automático de contenedor
watch:
	@echo "Watch de frontends activado..."
	@for dir in $(FRONTS); do \
		if [ -d $$dir ]; then \
			echo "Watch activo para $$dir..."; \
			fswatch -o $$dir | while read num; do \
				echo "Cambio detectado en $$dir, instalando dependencias y reiniciando contenedor..."; \
				(cd $$dir && npm install); \
				docker-compose restart $$dir; \
			done & \
		fi \
	done
	@wait

# === NUEVOS TARGETS ===

# Estado y logs tail
monitor:
	@echo "=== STATUS ==="
	docker-compose ps
	@echo "=== LOGS (CTRL+C para salir)==="
	docker-compose logs -f

# Ejecuta los tests UI dentro del contenedor QA con entorno gráfico
test-ui:
	docker-compose run --service-ports --rm tests \
		bash /app/entrypoint.sh npx playwright test --ui

# Alternativa: levantar imagen con puertos publicados manualmente (VNC + noVNC)
test-ui-run:
	docker run --rm -p 5900:5900 -p 8080:8080 \
		-e BASE_URL=http://localhost:3000 \
		--name microapp-tests-local \
		microapp-tests:latest \
		bash /app/entrypoint.sh npx playwright test --ui

# Genera reportes HTML de Playwright
report:
	docker-compose run --rm tests npx playwright test --reporter=html

report-open:
	open ./tests/playwright-report/index.html

