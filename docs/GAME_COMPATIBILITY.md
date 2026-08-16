# 🎮 Xbox Game Pass on Linux - Compatibility & Verification Matrix

<p align="center">
  <a href="GAME_COMPATIBILITY.md"><b>English</b></a> •
  <a href="GAME_COMPATIBILITY.pl.md"><b>Polski</b></a>
</p>

This document tracks tested Xbox Game Pass (MSIXVC / GDK) titles running on Linux through the **Proton-XODUS-GDK** runtime and the **xodus-for-heroic** bridge.

---

## 📊 Verified Titles Matrix

All titles listed below have been verified with complete startup, main menu rendering, audio playback, and GDK subsystem initialization on modern Linux environments (Kernel 6.x+, Wayland/X11, Mesa / NVIDIA).

| Game Title | Executable | Engine / Framework | Graphics API | Tested GDK Subsystems | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Brotato** | `Brotato.exe` | Godot 3.6.1 + GDK | Direct3D 12 (VKD3D) | `XTaskQueue`, `XNetworking`, `XGameSave v4`, `XUser` | **100% Working** |
| **Balatro** | `love.exe` | LÖVE 2D + GDK | Direct3D 11 (DXVK) | `XUser`, `Windows.Gaming.Input`, `XGameRuntime` | **100% Working** |
| **DREDGE** | `DREDGE.exe` | Unity (IL2CPP) | Direct3D 11 (DXVK) | `XUser`, `XStore`, `XAsync`, `XGameSave` | **100% Working** |
| **Inscryption** | `Inscryption.exe` | Unity (IL2CPP) | Direct3D 11 (DXVK) | `XUser`, `XAsync`, `XGameSave` | **100% Working** |
| **Donut County** | `DonutCounty.exe` | Unity (Mono) | Direct3D 11 (DXVK) | `XUser`, `XGameSave`, `XStore` | **100% Working** |
| **Neon Abyss** | `NeonAbyss.exe` | Unity (Mono BleedingEdge) | Direct3D 11 (DXVK) | `XUser`, `XGameSave`, `XStore` | **100% Working** |
| **Stardew Valley** | `Stardew Valley.exe` | .NET Core 6 / MonoGame | Direct3D 11 (DXVK) | `XUser`, `Windows.Gaming.Input`, `XGameSave` | **100% Working** |
| **Fallout 4** | `Fallout4.exe` | Creation Engine | Direct3D 11 (DXVK) | `XGameSave`, `XUser`, `XAudio2`, Subtitles/Voice | **100% Working** |

---

## 🔍 Technical Architecture & Subsystem Details

### 1. Microsoft GDK Subsystem Emulation (`xgameruntime.dll`)
* **`XTaskQueue`**: Supports automatic process queue initialization (`XTaskQueueGetCurrentProcessTaskQueue`) and asynchronous background dispatching via Windows ThreadPool (`QueueUserWorkItem`).
* **`XGameSave`**: Implements asynchronous container enumeration, blob reads/writes, quota queries, and maps saved games directly to standard Windows/Wine document locations (`Documents\My Games\...` or local profile directories). Supports `IXGameSaveImpl4` (`{ab4ae4fb-6508-4950-a032-45fd4bf8c43b}`).
* **`XNetworking`**: Properly implements connectivity hint tokens and network availability signaling, allowing titles with telemetry or multiplayer probes to initialize smoothly without timeouts.
* **`XUser` & `XStore`**: Provides non-blocking user profile resolution, dummy local users (`Player`, XUID `0x0009000000000001`), license queries, and entitled product detection.

### 2. Audio & Video Pipelines
* **Native XAudio2 / X3DAudio**: Required for low-latency spatial audio across games using DirectX audio engines.
* **GStreamer Plugin Suite**: (`gstreamer1.0-plugins-bad`, `gstreamer1.0-plugins-ugly`, `gstreamer1.0-libav`) used by Wine/Proton to decompress proprietary speech codecs (e.g. `.fuz` / WMA / XWMA in Bethesda titles).

---

## ⚙️ Recommended Environment Flags

The `xodus-heroic` tool automatically applies optimal environment configurations:

```bash
export WINEDLLOVERRIDES="winegstreamer=d;xaudio2_7=n,b;x3daudio1_7=n,b;xgameruntime=n,b;XGameRuntime=n,b;libHttpClient.GDK=n,b"
export PULSE_LATENCY_MSEC="60"
export DXVK_ENABLE_NVAPI="1"
export VKD3D_CONFIG="dxr11"
export PROTON_ENABLE_NVAPI="1"
export WINEDEBUG="-all,fixme-all"
```
