#!/usr/bin/env bash
set -euo pipefail

# EntryPoint robusto para entorno gráfico dentro del contenedor de tests.
# - Arranca Xvfb + fluxbox + x11vnc + noVNC (bind 0.0.0.0)
# - Si se lanza el comando con --ui, arranca el stack gráfico y
#   ejecuta el comando (Playwright UI) en background, tail de logs y espera.
# - Si no se pasa --ui y hay argumentos, ejecuta el comando normalmente (exec).
# - Si no hay argumentos, deja el stack gráfico arriba y mantiene el contenedor vivo.
#
# Nota operativa:
# - Para que VNC / noVNC estén accesibles desde tu Mac **usa docker-compose up** (o
#   docker-compose run --service-ports ...) para garantizar que los puertos del servicio
#   estén publicados en el host.
# - URLs habituales:
#     VNC:   vnc://localhost:5900
#     noVNC: http://localhost:8080/vnc.html?autoconnect=true

export DISPLAY=${DISPLAY:-:99}
export HOME=${HOME:-/root}
mkdir -p "$HOME/.fluxbox"

# Configuración mínima Fluxbox
cat > "$HOME/.fluxbox/init" <<'EOF'
session.configVersion: 15
session.screen0.workspaces: 1
session.screen0.defaultDeco: NORMAL
EOF

log_tail_files=(/tmp/playwright.log /tmp/novnc.log /tmp/x11vnc.log /tmp/fluxbox.log)

wait_for_x() {
  until xdpyinfo -display "$DISPLAY" >/dev/null 2>&1; do
    sleep 0.2
  done
}

start_graphics_stack() {
  echo "🔹 Iniciando entorno gráfico (Xvfb + Fluxbox + x11vnc + noVNC)..."

  # Xvfb
  if ! pgrep -x Xvfb >/dev/null 2>&1; then
    Xvfb "$DISPLAY" -screen 0 1920x1080x24 -ac +extension RANDR +extension RENDER +extension GLX >/tmp/xvfb.log 2>&1 &
  fi
  echo "⏳ Esperando a que Xvfb responda en ${DISPLAY}..."
  wait_for_x
  echo "✅ Xvfb listo"

  # Fluxbox
  if ! pgrep -x fluxbox >/dev/null 2>&1; then
    fluxbox >/tmp/fluxbox.log 2>&1 &
  fi
  echo "⏳ Esperando a que fluxbox arranque..."
  local tries=0
  while ! pgrep -x fluxbox >/dev/null 2>&1 && [ $tries -lt 50 ]; do
    sleep 0.1; tries=$((tries+1))
  done
  echo "✅ Fluxbox iniciado (logs: /tmp/fluxbox.log)"

  # x11vnc
  if ! pgrep -x x11vnc >/dev/null 2>&1; then
    x11vnc -display "$DISPLAY" -forever -shared -nopw -rfbport 5900 -listen 0.0.0.0 -quiet >/tmp/x11vnc.log 2>&1 &
    sleep 0.2
  fi
  echo "🔹 x11vnc iniciado en puerto 5900 (logs: /tmp/x11vnc.log)"

  # noVNC
  if ! pgrep -f novnc_proxy >/dev/null 2>&1; then
    if [ -x /usr/share/novnc/utils/novnc_proxy ]; then
      /usr/share/novnc/utils/novnc_proxy --vnc localhost:5900 --listen 0.0.0.0:8080 >/tmp/novnc.log 2>&1 &
    else
      websockify --web=/usr/share/novnc 8080 localhost:5900 >/tmp/novnc.log 2>&1 &
    fi
    sleep 0.2
  fi
  echo "🔹 noVNC iniciado en puerto 8080 (logs: /tmp/novnc.log)"

  echo "✅ Entorno gráfico listo"
  echo "✅ VNC:   vnc://localhost:5900"
  echo "✅ noVNC: http://localhost:8080/vnc.html?autoconnect=true"
}

safe_touch_and_tail() {
  for f in "${log_tail_files[@]}"; do
    : > "$f" 2>/dev/null || true
  done
  tail -F "${log_tail_files[@]}" &
  TAIL_PID=$!
}

# === Lógica principal ===
if [[ $# -gt 0 ]]; then
  if [[ "$*" == *"--ui"* ]]; then
    start_graphics_stack
    safe_touch_and_tail
    echo "👉 Ejecutando comando en background: $*"
    "$@" > /tmp/playwright.log 2>&1 &
    CMD_PID=$!
    wait $CMD_PID
    EXIT_CODE=$?
    echo "👉 Comando finalizado con código: $EXIT_CODE"
    exit $EXIT_CODE
  else
    exec "$@"
  fi
else
  start_graphics_stack
  safe_touch_and_tail
  echo "✅ Entorno gráfico corriendo. Manteniendo contenedor en primer plano."
  wait $TAIL_PID
fi
