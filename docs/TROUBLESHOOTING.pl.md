# Rozwiązywanie Problemów i Diagnostyka

<p align="center">
  <a href="TROUBLESHOOTING.md"><b>English</b></a> •
  <a href="TROUBLESHOOTING.pl.md"><b>Polski</b></a>
</p>

### 1. Sprawdzenie stanu środowiska (Doctor)
Uruchom wbudowane narzędzie diagnostyczne, aby zweryfikować biblioteki i kodeki:
```bash
xodus-heroic doctor
```

### 2. Naprawa dźwięku i dialogów
W przypadku braku dźwięku dialogów lub niepowiązanych archiwów mowy:
```bash
xodus-heroic fix-audio <ścieżka-do-folderu-gry>
```

### 3. Wybór właściwego pliku wykonywalnego
Jeśli Heroic uruchamia menu launchera zamiast samej gry:
```bash
xodus-heroic sync
```
Automatyczny mechanizm heurystyczny zaktualizuje konfigurację na właściwy plik gry.
