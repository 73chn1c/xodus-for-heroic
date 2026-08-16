#!/usr/bin/env bash
set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BIN_DEST="$HOME/.local/bin"
DESKTOP_DEST="$HOME/.local/share/applications"

echo "=== Instalator XODUS for Heroic ==="
echo "Katalog projektu: $PROJECT_DIR"

mkdir -p "$BIN_DEST" "$DESKTOP_DEST"

# 1. Kompilacja TypeScript
echo "📦 Budowanie projektu..."
cd "$PROJECT_DIR"
npm run build

# 2. Tworzenie dowiązania symbolicznego w ~/.local/bin
echo "🔗 Instalowanie polecenia 'xodus-heroic' w $BIN_DEST..."
ln -sf "$PROJECT_DIR/bin/xodus-heroic-bridge.js" "$BIN_DEST/xodus-heroic"
chmod +x "$PROJECT_DIR/bin/xodus-heroic-bridge.js"

# 3. Tworzenie skrótu .desktop
echo "🖥️  Generowanie skrótu pulpitu w $DESKTOP_DEST..."
cat <<DESKTOP_EOF > "$DESKTOP_DEST/xodus-heroic.desktop"
[Desktop Entry]
Name=XODUS for Heroic (Sync & Doctor)
Comment=Automatyczna synchronizacja i optymalizacja gier Xbox Game Pass w Heroic Games Launcher
Exec=$BIN_DEST/xodus-heroic sync
Icon=heroic
Terminal=true
Type=Application
Categories=Game;Utility;
DESKTOP_EOF

echo "✨ Instalacja zakończona sukcesem!"
echo "Możesz teraz używać polecenia: xodus-heroic"
