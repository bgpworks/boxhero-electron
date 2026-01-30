#!/bin/bash
set -euo pipefail

PROTOCOL="boxhero"
APP_NAME="boxhero-dev"
DESKTOP_FILE_PATH="$HOME/.local/share/applications/${APP_NAME}.desktop"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

[[ "$(uname)" != "Linux" ]] && { echo "Linux only. Exiting."; exit 0; }

ELECTRON_BIN="${PROJECT_DIR}/node_modules/electron/dist/electron"
[[ ! -x "$ELECTRON_BIN" ]] && { echo "Error: Run 'npm install' first."; exit 1; }

mkdir -p "$HOME/.local/share/applications"

cat > "$DESKTOP_FILE_PATH" << EOF
[Desktop Entry]
Name=BoxHero Dev
Exec=${ELECTRON_BIN} ${PROJECT_DIR} %u
Terminal=false
Type=Application
MimeType=x-scheme-handler/${PROTOCOL};
NoDisplay=true
EOF

xdg-mime default "${APP_NAME}.desktop" "x-scheme-handler/${PROTOCOL}"
update-desktop-database "$HOME/.local/share/applications" 2>/dev/null || true

echo "✓ Registered ${PROTOCOL}:// protocol"
echo "Test: xdg-open '${PROTOCOL}://goto?url=https://dev.boxhero.io'"
