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

> **Kompleksowy, samodzielny most i menedżer integracji gier Xbox Game Pass dla PC (MSIXVC / Microsoft GDK) z Heroic Games Launcher na systemie Linux.**

---

## ✨ Kluczowe Funkcjonalności

- 🔄 **Automatyczna Synchronizacja Biblioteki (`xodus-heroic sync`)**: Skanuje pobrane i odszyfrowane przez silnik XODUS gry, parsuje manifesty `MicrosoftGame.config`, pobiera TitleId, metadane oraz ikony i generuje gotowe konfiguracje Heroica.
- 🎯 **Inteligentny Wybór Plików Wykonywalnych (`ExecutableResolver`)**: Automatycznie ignoruje zbędne programy startowe (`*Launcher.exe`, `*Setup.exe`, `CrashReport.exe`) i podpina właściwy, natywny plik gry.
- 🩺 **Systemowy Asystent Diagnostyczny (`xodus-heroic doctor`)**: Błyskawicznie sprawdza status runnera `Proton-XODUS-GDK`, bibliotek `xgameruntime.dll`, kodeków GStreamer oraz natywnych sterowników dźwięku XAudio2.
- 🔊 **Automatyczna Naprawa Dźwięku i Dialogów (`xodus-heroic fix-audio`)**: Konfiguruje powiązania plików językowych audio (`.ba2` / `.fuz`), wdraża biblioteki XAudio2 / X3DAudio i włącza napisy dialogowe w plikach konfiguracyjnych.
- 🚀 **Optymalne Zmienne Środowiskowe**: Automatycznie wstrzykuje flagi `WINEDLLOVERRIDES`, `PULSE_LATENCY_MSEC`, `DXVK_ENABLE_NVAPI` i `VKD3D_CONFIG`.

---

## 📦 Szybki Start i Instalacja

### 1. Klonowanie i instalacja
```bash
git clone https://github.com/73chn1c/xodus-for-heroic.git
cd xodus-for-heroic
./scripts/install.sh
```

### 2. Konfiguracja kodeków (jednorazowo)
```bash
./scripts/setup-codecs.sh
```

---

## 🛠️ Użycie CLI

```text
Dostępne polecenia:
  xodus-heroic sync            - Skanuje gry Game Pass i automatycznie konfiguruje je w Heroic
  xodus-heroic doctor          - Wykonuje pełny audyt środowiska Proton GDK, kodeków i bibliotek
  xodus-heroic fix-audio <dir> - Naprawia dźwięk, dialogi i napisy w wybranym katalogu gry
  xodus-heroic help            - Wyświetla pomoc
```

### Przykłady:
```bash
# 1. Zsynchronizuj wszystkie pobrane gry z Game Passa do Heroica:
xodus-heroic sync

# 2. Sprawdź, czy Twoje środowisko Proton GDK jest w 100% sprawne:
xodus-heroic doctor

# 3. Napraw audio w Fallout 4:
xodus-heroic fix-audio ~/Games/Heroic/Fallout4
```

---

## 🏗️ Architektura Projektu

Szczegółowy opis architektury, przepływu danych i integracji z runtime'em Microsoft GDK znajduje się w dokumencie:
👉 [**Dokumentacja Architektury (docs/ARCHITECTURE.md)**](docs/ARCHITECTURE.md)

---

## 🎮 Tabela Kompatybilności Gier

Listę przetestowanych tytułów oraz wymaganych flag znajdziesz w:
👉 [**Lista Kompatybilności (docs/GAME_COMPATIBILITY.md)**](docs/GAME_COMPATIBILITY.md)

---

## 📄 Licencja

Projekt objęty licencją **GPL-3.0**. Zobacz plik [LICENSE](LICENSE) po szczegóły.
