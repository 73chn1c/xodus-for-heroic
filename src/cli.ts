import { XodusDetector } from './core/xodus-detector';
import { ProtonGdkManager } from './core/proton-gdk-manager';
import { AudioCodecFixer } from './core/audio-codec-fixer';
import { HeroicLibrary } from './core/heroic-library';

const ASCII_BANNER = `
 ██████╗  ██████╗  ██████╗ ██╗   ██╗███████╗   ██╗  ██╗███████╗██████╗  ██████╗ ██╗ ██████╗
 ██╔══██╗██╔═══██╗██╔══██╗██║   ██║██╔════╝   ██║  ██║██╔════╝██╔══██╗██╔═══██╗██║██╔════╝
 ██████╔╝██║   ██║██║  ██║██║   ██║███████╗   ███████║█████╗  ██████╔╝██║   ██║██║██║     
 ██╔═══╝ ██║   ██║██║  ██║██║   ██║╚════██║   ██╔══██║██╔══╝  ██╔══██╗██║   ██║██║██║     
 ██║     ╚██████╔╝██████╔╝╚██████╔╝███████║██╗██║  ██║███████╗██║  ██║╚██████╔╝██║╚██████╗
 ╚═╝      ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝ ╚═════╝
             Xbox Game Pass (XODUS) Bridge for Heroic Games Launcher on Linux
`;

export function runCli(args: string[]): void {
  const command = args[2] || 'help';

  console.log(ASCII_BANNER);

  switch (command.toLowerCase()) {
    case 'sync': {
      console.log('🔍 Skanowanie zainstalowanych gier Xbox Game Pass (MSIXVC / GDK)...');
      const games = XodusDetector.scanStandardDirectories();
      if (games.length === 0) {
        console.log('⚠️  Nie znaleziono żadnych gier w standardowych lokalizacjach (~/Games/Heroic, ~/Games/Xbox).');
        return;
      }

      console.log(`✅ Znaleziono ${games.length} gier(y):`);
      for (const game of games) {
        console.log(`   📦 ${game.displayName} [TitleId: ${game.titleId || 'N/A'}]`);
        console.log(`      📁 Ścieżka: ${game.gameDirectory}`);
        console.log(`      🚀 Główny plik: ${game.executableName}`);

        const savedPath = HeroicLibrary.syncGameToHeroic(game);
        console.log(`      ⚙️  Skonfigurowano w Heroic: ${savedPath}\n`);
      }
      console.log('🎉 Synchronizacja zakończona pomyślnie! Gry są gotowe do uruchomienia w Heroic Games Launcher.');
      break;
    }

    case 'doctor': {
      console.log('🩺 Uruchamianie pełnej diagnostyki środowiska XODUS + Heroic...\n');
      const status = ProtonGdkManager.getRunnerStatus();

      console.log('1. Środowisko Proton GDK:');
      console.log(`   - Zainstalowany runner: ${status.isInstalled ? '✅ TAK' : '❌ NIE'}`);
      if (status.runnerPath) console.log(`     Lokalizacja: ${status.runnerPath}`);
      console.log(`   - Biblioteka xgameruntime.dll: ${status.xgameruntimePath ? '✅ TAK' : '❌ NIE'}`);
      if (status.xgameruntimeSizeBytes) console.log(`     Rozmiar: ${(status.xgameruntimeSizeBytes / 1024 / 1024).toFixed(2)} MB`);

      console.log('\n2. Kodeki i Podsystem Audio:');
      console.log(`   - Natywne biblioteki XAudio2 / X3DAudio: ${status.hasXAudio2 ? '✅ TAK' : '❌ NIE'}`);
      console.log(`   - Wtyczki GStreamer (ugly/bad/libav): ${status.hasGStreamerPlugins ? '✅ TAK' : '❌ NIE'}`);

      console.log('\n3. Wykrywanie zainstalowanych gier:');
      const games = XodusDetector.scanStandardDirectories();
      console.log(`   - Znaleziono gier: ${games.length}`);
      for (const g of games) {
        console.log(`     • ${g.displayName} -> ${g.executableName}`);
      }

      console.log('\n✨ Diagnostyka zakończona.');
      break;
    }

    case 'fix-audio': {
      const targetDir = args[3];
      if (!targetDir) {
        console.log('❌ Błąd: Podaj ścieżkę do katalogu gry, np.: xodus-heroic fix-audio ~/Games/Heroic/Fallout4');
        return;
      }
      console.log(`🔧 Naprawianie konfiguracji audio dla: ${targetDir}...`);
      const result = AudioCodecFixer.fixGameAudio(targetDir);
      console.log(`   - Powiązanie archiwum głosów (.ba2/.fuz): ${result.voiceArchiveLinked ? '✅ TAK' : 'ℹ️  Nie dotyczy/Już istnieje'}`);
      console.log(`   - Skopiowanie DLL XAudio2: ${result.xactDllsDeployed ? '✅ TAK' : 'ℹ️  Już obecne'}`);
      console.log(`   - Aktywacja polskich napisów dialogowych: ${result.subtitlesEnabled ? '✅ TAK' : 'ℹ️  Gotowe'}`);
      if (result.warnings.length > 0) {
        console.log('⚠️  Ostrzeżenia:');
        result.warnings.forEach((w) => console.log(`   - ${w}`));
      }
      console.log('🎉 Gotowe!');
      break;
    }

    case 'help':
    default: {
      console.log('Dostępne polecenia:');
      console.log('  xodus-heroic sync            - Skanuje gry Game Pass i automatycznie konfiguruje je w Heroic');
      console.log('  xodus-heroic doctor          - Wykonuje pełny audyt środowiska Proton GDK, kodeków i bibliotek');
      console.log('  xodus-heroic fix-audio <dir> - Naprawia dźwięk, dialogi i napisy w wybranym katalogu gry');
      console.log('  xodus-heroic help            - Wyświetla tę pomoc');
      break;
    }
  }
}
