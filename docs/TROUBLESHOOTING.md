# Troubleshooting & Diagnostic Guide

<p align="center">
  <a href="TROUBLESHOOTING.md"><b>English</b></a> •
  <a href="TROUBLESHOOTING.pl.md"><b>Polski</b></a>
</p>

### 1. Environment Health Check
Run the built-in diagnostic tool to verify all required libraries and codecs:
```bash
xodus-heroic doctor
```

### 2. Audio & Dialogue Repair
If a game exhibits missing voice audio or unlinked localized speech archives:
```bash
xodus-heroic fix-audio <path-to-game-directory>
```

### 3. Executable Selection
If Heroic is launching a splash screen or launcher instead of the main game executable:
```bash
xodus-heroic sync
```
The automated heuristic resolver will update the target executable to the main game binary.
