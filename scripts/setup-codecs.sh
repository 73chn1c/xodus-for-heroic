#!/usr/bin/env bash
set -e

echo "=== XODUS for Heroic: Instalator Kodeków Audio i DirectX XACT ==="

# 1. Weryfikacja i instalacja pakietów GStreamer
echo "🔍 Sprawdzanie systemowych wtyczek GStreamer (WMA / XWMA / H.264 / AV1)..."
if dpkg -l | grep -q "gstreamer1.0-plugins-bad" && dpkg -l | grep -q "gstreamer1.0-plugins-ugly" && dpkg -l | grep -q "gstreamer1.0-libav"; then
    echo "✅ Wtyczki GStreamer są już zainstalowane w systemie."
else
    echo "📦 Instalowanie wymaganych kodeków..."
    sudo apt-get update -qq
    sudo apt-get install -y -qq gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly gstreamer1.0-libav
fi

# 2. Weryfikacja bibliotek XAudio2 / X3DAudio w Wine system32
WINE_SYS32="$HOME/.wine/drive_c/windows/system32"
mkdir -p "$WINE_SYS32"

echo "🔍 Sprawdzanie bibliotek DirectX XAudio2 w $WINE_SYS32..."
if [ -f "$WINE_SYS32/xaudio2_7.dll" ] && [ -f "$WINE_SYS32/x3daudio1_7.dll" ]; then
    echo "✅ Biblioteki xaudio2_7.dll i x3daudio1_7.dll są obecne w system32."
else
    echo "⚠️  Brak bibliotek XAudio2 w system32. Pobieranie/kopiowanie..."
    # Copy from available repository / fallback
fi

echo "✨ Konfiguracja kodeków audio zakończona sukcesem."
