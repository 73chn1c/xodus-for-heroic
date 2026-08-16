# Xbox Game Pass on Linux - Compatibility & Verification

<p align="center">
  <a href="GAME_COMPATIBILITY.md"><b>English</b></a> •
  <a href="GAME_COMPATIBILITY.pl.md"><b>Polski</b></a>
</p>

This document details how Xbox Game Pass (GDK / MSIXVC) titles run on Linux using the Proton-XODUS-GDK runner and the bridge.

## Architecture Highlights

1. **GDK Subsystem Emulation (`xgameruntime.dll`)**:
   - `XGameSave`: Persistent blob storage mapped to user document directories.
   - `XUser`: SISU authentication and UTF-16 token exchange.
   - `XGameUi` / `XStore`: Non-blocking asynchronous licensing and UI dialog fallbacks.
   - `XNetworking`: Automatic multiplayer UDP port binding (3074).

2. **Audio & Media Pipeline**:
   - Native XAudio2 / X3DAudio DirectX libraries for low-latency spatial sound.
   - GStreamer (`plugins-bad`, `plugins-ugly`, `libav`) for in-game video and WMA/XWMA speech decoding.

---

## Recommended Environment Flags

The bridge automatically configures these flags for every detected title:

```bash
export WINEDLLOVERRIDES="winegstreamer=d;xaudio2_7=n,b;x3daudio1_7=n,b;xgameruntime=n,b"
export PULSE_LATENCY_MSEC="60"
export DXVK_ENABLE_NVAPI="1"
export VKD3D_CONFIG="dxr11"
export PROTON_ENABLE_NVAPI="1"
export WINEDEBUG="-all,fixme-all"
```
