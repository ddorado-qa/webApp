#!/usr/bin/env bash
set -euo pipefail

# Silenciar avisos de Fluxbox creando un fichero de configuración completo antes de lanzarlo.
export DISPLAY=${DISPLAY:-:99}
export HOME=${HOME:-/root}
mkdir -p "$HOME/.fluxbox"

cat > "$HOME/.fluxbox/init" <<'EOF'
session.configVersion:     15
session.ignoreBorder:      false
session.forcePseudoTransparency: false
session.colorsPerChannel:  4
session.doubleClickInterval: 250
session.tabPadding:        0
session.styleOverlay:      false
session.slitlistFile:      ~/.fluxbox/slitlist
session.appsFile:          ~/.fluxbox/apps
session.tabsAttachArea:    Window
session.cacheLife:         5
session.cacheMax:          200
session.autoRaiseDelay:    250

session.screen0.opaqueMove:            true
session.screen0.fullMaximization:      false
session.screen0.maxIgnoreIncrement:    true
session.screen0.maxDisableMove:        false
session.screen0.maxDisableResize:      false
session.screen0.workspacewarping:      true
session.screen0.showwindowposition:    true
session.screen0.autoRaise:             false
session.screen0.clickRaises:           true
session.screen0.defaultDeco:           NORMAL
session.screen0.tab.placement:         TopLeft
session.screen0.windowMenu:            ~/.fluxbox/windowmenu
session.screen0.noFocusWhileTypingDelay: 0
session.screen0.workspaces:            1
session.screen0.edgeSnapThreshold:     10
session.screen0.window.focus.alpha:    255
session.screen0.window.unfocus.alpha:  200
session.screen0.menu.alpha:            255
session.screen0.menuDelay:             200
session.screen0.tab.width:             64
session.screen0.tooltipDelay:          500
session.screen0.allowRemoteActions:    true
session.screen0.clientMenu.usePixmap:  true
session.screen0.tabs.usePixmap:        true
session.screen0.tabs.maxOver:          false
session.screen0.tabs.intitlebar:       true
session.screen0.focusModel:            ClickFocus
session.screen0.tabFocusModel:         ClickToTabFocus
session.screen0.focusNewWindows:       true
session.screen0.focusSameHead:         false
session.screen0.rowPlacementDirection: LeftToRight
session.screen0.colPlacementDirection: TopToBottom
session.screen0.windowPlacement:       RowSmartPlacement
EOF

# Lanzar X virtual, Fluxbox, VNC y noVNC
if ! pgrep Xvfb >/dev/null 2>&1; then
  Xvfb "$DISPLAY" -screen 0 1920x1080x24 -ac +extension RANDR +extension RENDER +extension GLX &
  sleep 0.5
fi

fluxbox >/tmp/fluxbox.log 2>&1 &

# Arranca x11vnc en :99 y el proxy web noVNC en :8080 -> 5900
x11vnc -display "$DISPLAY" -forever -shared -nopw -rfbport 5900 -quiet >/tmp/x11vnc.log 2>&1 &
/usr/share/novnc/utils/novnc_proxy --vnc localhost:5900 --listen 8080 >/tmp/novnc.log 2>&1 &

# Ejecuta tus tests si existe script, si no, deja el contenedor vivo para debugging.
if [ -f /app/run-tests.sh ]; then
  bash /app/run-tests.sh
else
  echo "Entorno gráfico listo en VNC :5900 y noVNC :8080. Dejando el contenedor en primer plano."
  tail -f /dev/null
fi
