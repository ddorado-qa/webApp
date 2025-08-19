#!/bin/bash
set -e

# Lanzar Xvfb en :99
Xvfb :99 -screen 0 1280x720x24 &

# Exportar DISPLAY
export DISPLAY=:99

# Lanzar un window manager (fluxbox)
fluxbox &

# Lanzar VNC server en el mismo display
x11vnc -display :99 -nopw -forever -shared -rfbport 5900 &

# Lanzar noVNC en 8080 apuntando al VNC
websockify --web=/usr/share/novnc 8080 localhost:5900 &

# Esperar unos segundos para levantar servicios
sleep 5

# Ejecutar tests Playwright en modo headed
npx playwright test --reporter=list --headed
