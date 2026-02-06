#!/bin/bash
set -euo pipefail

DESKTOP_FILE_PATH="$HOME/.local/share/applications/boxhero-dev.desktop"

[[ "$(uname)" != "Linux" ]] && { echo "Linux only. Exiting."; exit 0; }
[[ -f "$DESKTOP_FILE_PATH" ]] && rm "$DESKTOP_FILE_PATH"
update-desktop-database "$HOME/.local/share/applications" 2>/dev/null || true

echo "✓ Unregistered boxhero:// protocol"
