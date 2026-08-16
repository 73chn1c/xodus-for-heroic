# Troubleshooting & FAQ

<p align="center">
  <a href="TROUBLESHOOTING.md"><b>English</b></a> •
  <a href="TROUBLESHOOTING.pl.md"><b>Polski</b></a>
</p>

### 1. Missing NPC Dialogue Voices (e.g. Fallout 4 Bathroom / Prologue)
- **Cause**: Missing system WMA/XWMA GStreamer plugins or unlinked localized audio archives (`.ba2`).
- **Solution**:
  ```bash
  xodus-heroic fix-audio ~/Games/Heroic/Fallout4
  ```

### 2. Game Hangs on Exit to Desktop
- **Cause**: Async thread deadlock or unhandled UTF-16 token request.
- **Solution**: Ensure your Proton GDK runner uses the latest `xgameruntime.dll` (returning `S_OK` in `UninitializeApiImpl`).

### 3. Heroic Launches Splash Launcher Instead of the Game
- **Cause**: `MicrosoftGame.config` declares a `*Launcher.exe` wrapper.
- **Solution**:
  ```bash
  xodus-heroic sync
  ```
  `xodus-heroic` will automatically detect the real binary and update your Heroic config.

### 4. Health Check (Doctor)
- Run:
  ```bash
  xodus-heroic doctor
  ```
