#!/bin/bash
set -e

BASE_URL="https://download.boxhero.io/label-printer"

# macOS
DEST_MAC="resources/bin/darwin/label_printer"
mkdir -p "$(dirname "$DEST_MAC")"
curl -fSL -o "$DEST_MAC" "$BASE_URL/label_printer"
chmod +x "$DEST_MAC"
echo "Downloaded $DEST_MAC"

# Windows
DEST_WIN="resources/bin/win32/label_printer.exe"
mkdir -p "$(dirname "$DEST_WIN")"
curl -fSL -o "$DEST_WIN" "$BASE_URL/label_printer.exe"
echo "Downloaded $DEST_WIN"
