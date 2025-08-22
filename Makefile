# Makefile para microApp con tests UI VNC/noVNC
# Limpia logs en consola, mantiene contenedor en primer plano, ejecuta Playwright UI

FRONTS = dashboard-mfe admin-mfe
BACKS  = users-api items-api api-gateway reporter
SERVICES = $(FRONTS) $(BACKS)
TESTS = microapp-tests

.PHONY: all install up logs restart clean rebuild watch hot monitor test test-ui report report-open

install:
	@echo "Instalando dependencias en todos los servicios..."
	@for service in $(SERVICES); do \
		if [ -f $$service/package.json ]; then \
			echo "Instalando $$service..."; \
			(cd $$service && npm install); \
		fi \
	done

up:
	@echo "Levantando contenedores..."
	docker-compose up -d --build

logs:
	@echo "Mostrando logs de todos los servicios..."
	docker-compose logs -f

logs-%:
	@echo "Mostrando logs de servicio $*..."
	docker-compose logs -f $*

restart:
	@echo "Reiniciando todos los contenedores..."
	docker-compose restart

restart-%:
	@echo "Reiniciando servicio $*..."
	docker-compose restart $*

clean:
	@echo "Deteniendo y eliminando contenedores y volúmenes..."
	docker-compose down -v --remove-orphans
	@echo "Eliminando imágenes intermedias de Docker..."
	docker system prune -af

rebuild: clean install up
	@echo "Reconstrucción completa terminada."

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

monitor:
	@echo "=== STATUS ==="
	docker-compose ps
	@echo "=== LOGS (CTRL+C para salir)==="
	docker-compose logs -f

test-ui:
	docker-compose run --service-ports --rm tests \
		bash /app/entrypoint_silence.sh npx playwright test --ui

test-ui-run:
	docker run --rm -p 5900:5900 -p 8080:8080 \
		-e BASE_URL=http://localhost:3000 \
		--name microapp-tests-local \
		microapp-tests:latest \
		bash /app/entrypoint.sh npx playwright test --ui

report:
	docker-compose run --rm tests npx playwright test --reporter=html

report-open:
	open ./tests/playwright-report/index.html
