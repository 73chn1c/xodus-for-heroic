# Rozwiązywanie Problemów (Troubleshooting)

### 1. Brak dźwięku dialogów postaci (np. Fallout 4 w łazience / prologu)
- **Przyczyna**: Brak systemowych wtyczek dekodera WMA/XWMA lub brak dowiązania plików językowych `.ba2`.
- **Rozwiązanie**:
  ```bash
  xodus-heroic fix-audio ~/Games/Heroic/Fallout4
  ```

### 2. Gra zawiesza się przy wyjściu do pulpitu
- **Przyczyna**: Deadlock asynchronicznego wątku Bethesdy lub niezainicjalizowany token UTF-16.
- **Rozwiązanie**: Upewnij się, że runner korzysta z najnowszej wersji `xgameruntime.dll` (zwracającej `S_OK` w `UninitializeApiImpl`).

### 3. Heroic uruchamia menu launchera zamiast gry
- **Przyczyna**: `MicrosoftGame.config` zawiera odwołanie do `*Launcher.exe`.
- **Rozwiązanie**:
  ```bash
  xodus-heroic sync
  ```
  `xodus-heroic` automatycznie zidentyfikuje główny plik gry i zaktualizuje konfigurację.

### 4. Sprawdzenie stanu środowiska (Doctor)
- Uruchom:
  ```bash
  xodus-heroic doctor
  ```
