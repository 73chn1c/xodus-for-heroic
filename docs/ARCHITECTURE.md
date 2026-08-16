# Architecture of XODUS for Heroic

<p align="center">
  <a href="ARCHITECTURE.md"><b>English</b></a> •
  <a href="ARCHITECTURE.pl.md"><b>Polski</b></a>
</p>

**XODUS for Heroic** is a standalone bridge and library manager integrating the **Xbox Game Pass for PC (MSIXVC / GDK)** ecosystem with the **Heroic Games Launcher** on Linux.

---

## 1. Data Flow Diagram

```text
+-------------------------------------------------------------+
|                Xbox Live Cloud / MS Store CDN               |
+-------------------------------------------------------------+
                              |
                              v  (MSIXVC Encrypted Packages)
+-------------------------------------------------------------+
|                   XODUS Engine / libmsixvc                  |
|    - Block Decryption (AES-XTS)                             |
|    - Package extraction & MicrosoftGame.config parsing      |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                     xodus-for-heroic                        |
|    - Manifest Scanner (XodusDetector)                       |
|    - Smart Binary Heuristics (ExecutableResolver)           |
|    - Proton GDK Runner Manager (ProtonGdkManager)           |
|    - Audio/DLL Environment Injector (AudioCodecFixer)       |
|    - Heroic GamesConfig Generator (HeroicLibrary)           |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                  Heroic Games Launcher                      |
|    - Library UI, Game Launching, Playtime Tracking          |
|    - Wine / Proton Prefix Isolation                         |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|               Proton-XODUS-GDK / Wine Runtime               |
|    - xgameruntime.dll:                                      |
|        • XGameSave (physical disk engine)                   |
|        • XUser (SISU auth / token signature provider)       |
|        • XGameUi / XStore / XAccessibility / XNetworking    |
|    - GStreamer + XAudio2: full audio support (.fuz/.ba2)    |
|    - DXVK / VKD3D-Proton (Direct3D 11/12 -> Vulkan)         |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                         GDK GAME                            |
|          (Fallout 4, Lies of P, Forza, Starfield...)        |
+-------------------------------------------------------------+
```

---

## 2. Core Modules

### `XodusDetector` (`src/core/xodus-detector.ts`)
- Parses `MicrosoftGame.config` manifests.
- Extracts TitleId, DisplayName, version, icon assets, and declared executable targets.
- Discovers Game Pass installations across standard Linux paths (`~/Games/Heroic`, `~/Games/Xbox`, `~/.wine/drive_c/Program Files/WindowsApps`).

### `ExecutableResolver` (`src/core/executable-resolver.ts`)
- Evaluates `.exe` files in game root directories.
- Deprioritizes helper tools (`*Launcher.exe`, `*Setup.exe`, crash reporters, anti-cheat stubs) and selects the native game binary.

### `ProtonGdkManager` (`src/core/proton-gdk-manager.ts`)
- Verifies installation of the `Proton-XODUS-GDK` runner.
- Audits `xgameruntime.dll` physical save implementation and asynchronous pipeline completeness.
- Constructs fine-tuned execution environments (`WINEDLLOVERRIDES`, `PULSE_LATENCY_MSEC`, `DXVK_ENABLE_NVAPI`).

### `AudioCodecFixer` (`src/core/audio-codec-fixer.ts`)
- Verifies system GStreamer plugins (`ugly`, `bad`, `libav`) on Debian/Ubuntu/Arch.
- Deploys Microsoft DirectX XACT libraries (`xaudio2_7.dll`, `x3daudio1_7.dll`).
- Creates aliases for localized audio archives (`Fallout4 - Voices_pl.ba2` -> `Fallout4 - Voices.ba2`).
- Configures subtitle options in user INI documents.

### `HeroicLibrary` (`src/core/heroic-library.ts`)
- Writes Heroic JSON configurations to `~/.config/heroic/GamesConfig/<game-id>.json`.
- Integrates runner parameters, DXVK/VKD3D flags, and audio overrides directly into Heroic.
