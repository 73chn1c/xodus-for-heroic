# Xbox Game Pass na Linuxie - Kompatybilność i Weryfikacja

<p align="center">
  <a href="GAME_COMPATIBILITY.md"><b>English</b></a> •
  <a href="GAME_COMPATIBILITY.pl.md"><b>Polski</b></a>
</p>

Dokument opisuje sposób uruchamiania i obsługi gier Xbox Game Pass (GDK / MSIXVC) na Linuxie za pomocą runnera Proton-XODUS-GDK oraz mostu integracyjnego.

## Kluczowe Elementy Architektury

1. **Emulacja podsystemu GDK (`xgameruntime.dll`)**:
   - `XGameSave`: Trwały zapis stanów gry na dysku w katalogach użytkownika.
   - `XUser`: Obsługa logowania SISU i tokenów asynchronicznych.
   - `XGameUi` / `XStore`: Asynchroniczna weryfikacja licencji i okien dialogowych.
   - `XNetworking`: Automatyczne mapowanie portu multiplayer UDP (3074).

2. **Potok Audio i Wideo**:
   - Natywne biblioteki DirectX XAudio2 / X3DAudio.
   - Wtyczki GStreamer (`plugins-bad`, `plugins-ugly`, `libav`) do dekodowania mowy WMA/XWMA oraz wideo.
