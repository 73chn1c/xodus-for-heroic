# 🎮 XODUS for Heroic

<p align="center">
  <a href="README.md"><b>English</b></a> •
  <a href="README.pl.md"><b>Polski</b></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-GPL--3.0-blue.svg" alt="GPL-3.0 License" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6.svg?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Platform-Linux-FCC624.svg?logo=linux&logoColor=black" alt="Linux Gaming" />
  <img src="https://img.shields.io/badge/Heroic-Compatible-yellow.svg" alt="Heroic Compatible" />
  <img src="https://img.shields.io/badge/Proton-XODUS--GDK-purple.svg" alt="Proton GDK" />
</p>

> **A standalone bridge and library manager integrating Xbox Game Pass for PC (MSIXVC / Microsoft GDK) titles with Heroic Games Launcher on Linux.**

---

## ✨ Key Features

- 🔄 **Automatic Library Synchronization (`xodus-heroic sync`)**: Scans games decrypted by the XODUS engine, parses `MicrosoftGame.config` manifests, extracts TitleIds, icons, metadata, and generates ready-to-play Heroic launch configurations.
- 🎯 **Smart Executable Resolver (`ExecutableResolver`)**: Automatically bypasses splash launchers (`*Launcher.exe`, `*Setup.exe`, `CrashReport.exe`) in favor of the real native game executable.
- 🩺 **System Doctor Diagnostics (`xodus-heroic doctor`)**: Instantly verifies the health of your `Proton-XODUS-GDK` runner, `xgameruntime.dll` physical save engine, GStreamer plugins, and native DirectX XAudio2 libraries.
- 🔊 **Automated Audio & Subtitle Repair (`xodus-heroic fix-audio`)**: Fixes dialogue audio, creates missing localized voice aliases (`.ba2` / `.fuz`), installs XAudio2 DLLs, and enables in-game subtitles.
- 🚀 **Environment Optimization**: Automatically injects fine-tuned `WINEDLLOVERRIDES`, `PULSE_LATENCY_MSEC`, `DXVK_ENABLE_NVAPI`, and `VKD3D_CONFIG` settings.

---

## 📦 Quick Start & Installation

### 1. Clone and Install
```bash
git clone https://github.com/73chn1c/xodus-for-heroic.git
cd xodus-for-heroic
./scripts/install.sh
```

### 2. Configure Audio Codecs (One-time setup)
```bash
./scripts/setup-codecs.sh
```

---

## 🛠️ CLI Usage

```text
Available Commands:
  xodus-heroic sync            - Scans Game Pass titles and configures them in Heroic
  xodus-heroic doctor          - Runs a full diagnostic audit of Proton GDK, codecs, and libraries
  xodus-heroic fix-audio <dir> - Repairs audio, dialogues, and subtitles for a specific game directory
  xodus-heroic help            - Displays help information
```

### Examples:
```bash
# 1. Synchronize all installed Game Pass titles to Heroic:
xodus-heroic sync

# 2. Check that your Proton GDK gaming environment is healthy:
xodus-heroic doctor

# 3. Fix audio and missing dialogues in Fallout 4:
xodus-heroic fix-audio ~/Games/Heroic/Fallout4
```

---

## 🏗️ Architecture & Documentation

For a deep technical breakdown of the architecture, data flow, and GDK runtime integration, check out:
- 📖 [**Architecture Guide (docs/ARCHITECTURE.md)**](docs/ARCHITECTURE.md)
- 🎮 [**Game Compatibility Matrix (docs/GAME_COMPATIBILITY.md)**](docs/GAME_COMPATIBILITY.md)
- 🔧 [**Troubleshooting & FAQ (docs/TROUBLESHOOTING.md)**](docs/TROUBLESHOOTING.md)

---

## 📄 License

This project is licensed under the **GPL-3.0 License**. See [LICENSE](LICENSE) for details.
