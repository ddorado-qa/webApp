#!/usr/bin/env bash
set -euo pipefail

export DISPLAY=${DISPLAY:-:99}
export HOME=${HOME:-/root}
mkdir -p "$HOME/.fluxbox"

# Configuración mínima Fluxbox
cat > "$HOME/.fluxbox/init" <<'EOF'
session.configVersion: 15
session.screen0.workspaces: 1
session.screen0.defaultDeco: NORMAL
EOF

wait_for_x() {
  echo "⏳ Esperando a que Xvfb esté listo..."
  until xdpyinfo -display "$DISPLAY" >/dev/null 2>&1; do
    sleep 0.2
  done
  echo "✅ Xvfb listo"
}

wait_for_fluxbox() {
  echo "⏳ Esperando a que Fluxbox esté listo..."
  until pgrep -x fluxbox >/dev/null 2>&1 && xdpyinfo -display "$DISPLAY" >/dev/null 2>&1; do
    sleep 0.2
  done
  echo "✅ Fluxbox listo"
}

start_graphics_stack() {
  echo "🔹 Iniciando entorno gráfico (Xvfb + Fluxbox + x11vnc + noVNC)..."

  # Xvfb
  if ! pgrep -x Xvfb >/dev/null 2>&1; then
    Xvfb "$DISPLAY" -screen 0 1920x1080x24 -ac +extension RANDR +extension RENDER +extension GLX >/tmp/xvfb.log 2>&1 &
  fi
  wait_for_x

  # Fluxbox
  if ! pgrep -x fluxbox >/dev/null 2>&1; then
    fluxbox >/tmp/fluxbox.log 2>&1 &
  fi
  wait_for_fluxbox

  # Pausa opcional para que Fluxbox dibuje root window
  sleep 1

  # x11vnc
  if ! pgrep -x x11vnc >/dev/null 2>&1; then
    x11vnc -display "$DISPLAY" -forever -shared -nopw -rfbport 5900 -listen 0.0.0.0 -quiet -wait "$DISPLAY" >/tmp/x11vnc.log 2>&1 &
  fi

  # noVNC conectando a localhost:5900
  if ! pgrep -f novnc_proxy >/dev/null 2>&1; then
    /usr/share/novnc/utils/novnc_proxy --vnc localhost:5900 --listen 0.0.0.0:8080 >/tmp/novnc.log 2>&1 &
  fi

  echo "✅ Entorno gráfico listo para Playwright"
  echo "✅ VNC: vnc://localhost:5900"
  echo "✅ noVNC: http://localhost:8080/vnc.html?autoconnect=true"
}

# === Lógica principal ===
if [[ $# -gt 0 ]]; then
  # Si hay argumentos y contienen --ui, levanta entorno gráfico
  if [[ "$*" == *"--ui"* ]]; then
    start_graphics_stack
    # Espera un momento antes de ejecutar Playwright
    sleep 1
  fi
  echo "👉 Ejecutando comando: $*"
  exec "$@"
else
  # Sin argumentos: levantamos entorno gráfico y dejamos contenedor en primer plano
  start_graphics_stack
  echo "✅ Contenedor en primer plano. Manteniendo entorno gráfico..."
  tail -f /dev/null
fi
