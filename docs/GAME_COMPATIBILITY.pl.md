# Kompatybilność Gier Xbox Game Pass na Linuxie

| Gra | Status | Runner | Dźwięk / Dialogi | Zapisy na dysku | Wymagane flagi / uwagi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Fallout 4 (Game Pass)** | 🟢 Działa w 100% | Proton-XODUS-GDK | ✅ GStreamer + Voices alias | ✅ `XGameSave` w `My Games\Fallout4 MS\Saves` | Pominięcie launchera (`Fallout4.exe`), polskie audio `.ba2` |
| **Fallout 3 (Game Pass)** | 🟢 Działa w 100% | Proton-XODUS-GDK | ✅ Natywny DirectSound | ✅ Włączone | Czyste wyjście kodem 0 |
| **Moving Out** | 🟢 Działa w 100% | Proton-XODUS-GDK | ✅ Unity Audio | ✅ Włączone | Wymaga domyślnego portu sieciowego UDP 3074 |
| **Overcooked! 2** | 🟢 Działa w 100% | Proton-XODUS-GDK | ✅ Unity Audio | ✅ Włączone | Obsługa kontrolerów przez Wine / SDL |
| **RollerCoaster Tycoon 3**| 🟢 Działa w 100% | Proton-XODUS-GDK | ✅ DirectSound | ✅ Włączone | Direct3D 9 -> Vulkan (DXVK) |
| **Lies of P / Forza Horizon** | 🟢 Zgodne | Proton-XODUS-GDK | ✅ XAudio2 | ✅ Włączone | Obsługa `XDisplayTryEnableHdrMode` (Disabled fallback) |

---

## Zalecana konfiguracja środowiska (Zautomatyzowana w `xodus-heroic`)

```bash
export WINEDLLOVERRIDES="winegstreamer=d;xaudio2_7=n,b;x3daudio1_7=n,b;xgameruntime=n,b"
export PULSE_LATENCY_MSEC="60"
export DXVK_ENABLE_NVAPI="1"
export VKD3D_CONFIG="dxr11"
export PROTON_ENABLE_NVAPI="1"
export WINEDEBUG="-all,fixme-all"
```
