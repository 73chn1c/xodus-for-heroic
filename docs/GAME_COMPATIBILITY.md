# Xbox Game Pass on Linux - Compatibility Matrix

<p align="center">
  <a href="GAME_COMPATIBILITY.md"><b>English</b></a> •
  <a href="GAME_COMPATIBILITY.pl.md"><b>Polski</b></a>
</p>

| Game | Status | Runner | Audio / Dialogues | Disk Save Engine | Notes & Tweaks |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Fallout 4 (Game Pass)** | 🟢 100% Working | Proton-XODUS-GDK | ✅ GStreamer + Voices alias | ✅ `XGameSave` to `My Games\Fallout4 MS\Saves` | Launcher bypass (`Fallout4.exe`), `.ba2` voice alias |
| **Fallout 3 (Game Pass)** | 🟢 100% Working | Proton-XODUS-GDK | ✅ Native DirectSound | ✅ Enabled | Clean exit code 0 |
| **Moving Out** | 🟢 100% Working | Proton-XODUS-GDK | ✅ Unity Audio | ✅ Enabled | Default multiplayer UDP port 3074 |
| **Overcooked! 2** | 🟢 100% Working | Proton-XODUS-GDK | ✅ Unity Audio | ✅ Enabled | Wine / SDL controller support |
| **RollerCoaster Tycoon 3**| 🟢 100% Working | Proton-XODUS-GDK | ✅ DirectSound | ✅ Enabled | Direct3D 9 -> Vulkan (DXVK) |
| **Lies of P / Forza Horizon** | 🟢 Compatible | Proton-XODUS-GDK | ✅ XAudio2 | ✅ Enabled | `XDisplayTryEnableHdrMode` (Graceful disabled fallback) |

---

## Recommended Environment Flags (Automated in `xodus-heroic`)

```bash
export WINEDLLOVERRIDES="winegstreamer=d;xaudio2_7=n,b;x3daudio1_7=n,b;xgameruntime=n,b"
export PULSE_LATENCY_MSEC="60"
export DXVK_ENABLE_NVAPI="1"
export VKD3D_CONFIG="dxr11"
export PROTON_ENABLE_NVAPI="1"
export WINEDEBUG="-all,fixme-all"
```
