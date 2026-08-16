# 🎮 Xbox Game Pass na Linuxie - Matryca Kompatybilności i Weryfikacji

<p align="center">
  <a href="GAME_COMPATIBILITY.md"><b>English</b></a> •
  <a href="GAME_COMPATIBILITY.pl.md"><b>Polski</b></a>
</p>

Dokument zawiera zestawienie przetestowanych tytułów Xbox Game Pass (MSIXVC / GDK) działających na systemie Linux za pośrednictwem środowiska **Proton-XODUS-GDK** oraz mostu **xodus-for-heroic**.

---

## 📊 Tabela Zweryfikowanych Gier

Wszystkie poniższe tytuły zostały w 100% zweryfikowane pod kątem poprawnego uruchamiania, ładowania menu głównego, renderowania grafiki, obsługi dźwięku oraz poprawnej inicjalizacji podsystemów GDK.

| Tytuł Gry | Plik Wykonywalny | Silnik / Technologia | API Graficzne | Przetestowane Podsystemy GDK | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Brotato** | `Brotato.exe` | Godot 3.6.1 + GDK | Direct3D 12 (VKD3D) | `XTaskQueue`, `XNetworking`, `XGameSave v4`, `XUser` | **100% Działa** |
| **Balatro** | `love.exe` | LÖVE 2D + GDK | Direct3D 11 (DXVK) | `XUser`, `Windows.Gaming.Input`, `XGameRuntime` | **100% Działa** |
| **DREDGE** | `DREDGE.exe` | Unity (IL2CPP) | Direct3D 11 (DXVK) | `XUser`, `XStore`, `XAsync`, `XGameSave` | **100% Działa** |
| **Inscryption** | `Inscryption.exe` | Unity (IL2CPP) | Direct3D 11 (DXVK) | `XUser`, `XAsync`, `XGameSave` | **100% Działa** |
| **Donut County** | `DonutCounty.exe` | Unity (Mono) | Direct3D 11 (DXVK) | `XUser`, `XGameSave`, `XStore` | **100% Działa** |
| **Neon Abyss** | `NeonAbyss.exe` | Unity (Mono BleedingEdge) | Direct3D 11 (DXVK) | `XUser`, `XGameSave`, `XStore` | **100% Działa** |
| **Stardew Valley** | `Stardew Valley.exe` | .NET Core 6 / MonoGame | Direct3D 11 (DXVK) | `XUser`, `Windows.Gaming.Input`, `XGameSave` | **100% Działa** |
| **Fallout 4** | `Fallout4.exe` | Creation Engine | Direct3D 11 (DXVK) | `XGameSave`, `XUser`, `XAudio2`, Dialogi/Napisy | **100% Działa** |

---

## 🔍 Szczegóły Architektury i Podsystemów

### 1. Emulacja Podsystemu Microsoft GDK (`xgameruntime.dll`)
* **`XTaskQueue`**: Wspiera automatyczną inicjalizację domyślnej kolejki procesowej (`XTaskQueueGetCurrentProcessTaskQueue`) oraz asynchroniczne dysponowanie zadań roboczych w tle za pomocą puli wątków (`QueueUserWorkItem`).
* **`XGameSave`**: Obsługuje asynchroniczną enumerację kontenerów, odczyt/zapis danych i mapowanie stanów zapisu do standardowych katalogów dokumentów gracza. Posiada pełną obsługę `IXGameSaveImpl4` (`{ab4ae4fb-6508-4950-a032-45fd4bf8c43b}`).
* **`XNetworking`**: Prawidłowo generuje tokeny powiadomień sieciowych, zapobiegając zawieszaniu się gier oczekujących na status połączenia multiplayer/telemetrii.
* **`XUser` & `XStore`**: Zapewnia asynchroniczną obsługę użytkowników lokalnych, weryfikację uprawnień i licencji.

### 2. Potok Dźwięku i Obrazu
* **Natywny XAudio2 / X3DAudio**: Niezbędny do niskopoziomowego, bezstratnego odtwarzania dźwięku przestrzennego.
* **Pakiet GStreamer**: (`gstreamer1.0-plugins-bad`, `gstreamer1.0-plugins-ugly`, `gstreamer1.0-libav`) dekoduje skompresowane pliki dialogowe i wideo.

---

## ⚙️ Zalecane Zmienne Środowiskowe

Narzędzie `xodus-heroic` automatycznie konfiguruje zmienne uruchomieniowe:

```bash
export WINEDLLOVERRIDES="winegstreamer=d;xaudio2_7=n,b;x3daudio1_7=n,b;xgameruntime=n,b;XGameRuntime=n,b;libHttpClient.GDK=n,b"
export PULSE_LATENCY_MSEC="60"
export DXVK_ENABLE_NVAPI="1"
export VKD3D_CONFIG="dxr11"
export PROTON_ENABLE_NVAPI="1"
export WINEDEBUG="-all,fixme-all"
```
