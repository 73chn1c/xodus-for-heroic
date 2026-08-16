# Architektura XODUS for Heroic

**XODUS for Heroic** to samodzielny most integrujący ekosystem **Xbox Game Pass dla PC (MSIXVC / GDK)** z **Heroic Games Launcher** na systemach Linux.

---

## 1. Schemat Przepływu Danych

```text
+-------------------------------------------------------------+
|                Xbox Live Cloud / MS Store CDN               |
+-------------------------------------------------------------+
                              |
                              v  (MSIXVC Encrypted Packages)
+-------------------------------------------------------------+
|                   XODUS Engine / libmsixvc                  |
|    - Odszyfrowywanie bloków (AES-XTS)                       |
|    - Ekstrakcja struktury plików gry i MicrosoftGame.config |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                     xodus-for-heroic                        |
|    - Skanowanie manifestów (XodusDetector)                  |
|    - Inteligentny wybór binarek (ExecutableResolver)        |
|    - Zarządzanie runnerem Proton GDK (ProtonGdkManager)     |
|    - Wstrzykiwanie flag DLL/audio (AudioCodecFixer)         |
|    - Konfiguracja Heroic GamesConfig (HeroicLibrary)        |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                  Heroic Games Launcher                      |
|    - UI Biblioteki, uruchamianie, tracking czasu gry        |
|    - Izolacja prefiksów Wine / Proton                       |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|               Proton-XODUS-GDK / Wine Runtime               |
|    - xgameruntime.dll:                                      |
|        • XGameSave (zapisy na dysku)                        |
|        • XUser (autentykacja SISU / tokeny)                 |
|        • XGameUi / XStore / XAccessibility / XNetworking    |
|    - GStreamer + XAudio2: pełne wsparcie audio (.fuz/.ba2)  |
|    - DXVK / VKD3D-Proton (Direct3D 11/12 -> Vulkan)         |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                         GRA GDK                             |
|          (Fallout 4, Lies of P, Forza, Starfield...)        |
+-------------------------------------------------------------+
```

---

## 2. Główne Moduły

### `XodusDetector` (`src/core/xodus-detector.ts`)
- Analizuje manifest `MicrosoftGame.config`.
- Ekstrahuje TitleId, DisplayName, wersję, ikony i listę plików wykonywalnych.
- Skanuje standardowe katalogi gier (`~/Games/Heroic`, `~/Games/Xbox`, `~/.wine/drive_c/Program Files/WindowsApps`).

### `ExecutableResolver` (`src/core/executable-resolver.ts`)
- Filtruje launchery (`Fallout4Launcher.exe`, `Launcher.exe`, `Setup.exe`), telemetry stubs i crash reportery.
- Przeprowadza ocenę wagową (rozmiar binarki, dopasowanie nazwy katalogu) i wybiera właściwy plik gry.

### `ProtonGdkManager` (`src/core/proton-gdk-manager.ts`)
- Weryfikuje instalację runnera `Proton-XODUS-GDK`.
- Sprawdza integralność `xgameruntime.dll` (fizyczny silnik zapisu, asynchroniczny potok UI/Store/Networking).
- Generuje optymalne zmienne środowiskowe (`WINEDLLOVERRIDES`, `PULSE_LATENCY_MSEC`, `DXVK_ENABLE_NVAPI`).

### `AudioCodecFixer` (`src/core/audio-codec-fixer.ts`)
- Sprawdza obecność wtyczek GStreamer (`ugly`, `bad`, `libav`) w systemie Linux.
- Wdraża natywne biblioteki Microsoft DirectX XACT (`xaudio2_7.dll`, `x3daudio1_7.dll`).
- Tworzy dowiązania dla wersji językowych archiwów audio (`Fallout4 - Voices_pl.ba2` -> `Fallout4 - Voices.ba2`).
- Włącza napisy dialogowe w plikach `.ini`.

### `HeroicLibrary` (`src/core/heroic-library.ts`)
- Generuje konfiguracje `~/.config/heroic/GamesConfig/<game-id>.json`.
- Integruje parametry runnera, flagi DXVK/VKD3D i parametry audio bezpośrednio z Heroic.
