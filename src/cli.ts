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
      console.log('🔍 Scanning installed Xbox Game Pass (MSIXVC / GDK) titles...');
      const games = XodusDetector.scanStandardDirectories();
      if (games.length === 0) {
        console.log('⚠️  No installed games found in standard locations (~/Games/Heroic, ~/Games/Xbox).');
        return;
      }

      console.log(`✅ Discovered ${games.length} title(s):`);
      for (const game of games) {
        console.log(`   📦 ${game.displayName} [TitleId: ${game.titleId || 'N/A'}]`);
        console.log(`      📁 Directory: ${game.gameDirectory}`);
        console.log(`      🚀 Executable: ${game.executableName}`);

        const savedPath = HeroicLibrary.syncGameToHeroic(game);
        console.log(`      ⚙️  Configured in Heroic: ${savedPath}\n`);
      }
      console.log('🎉 Synchronization completed successfully! Games are ready to launch in Heroic.');
      break;
    }

    case 'doctor': {
      console.log('🩺 Running full diagnostics for XODUS + Heroic environment...\n');
      const status = ProtonGdkManager.getRunnerStatus();

      console.log('1. Proton GDK Runtime:');
      console.log(`   - Installed Runner: ${status.isInstalled ? '✅ YES' : '❌ NO'}`);
      if (status.runnerPath) console.log(`     Location: ${status.runnerPath}`);
      console.log(`   - xgameruntime.dll: ${status.xgameruntimePath ? '✅ YES' : '❌ NO'}`);
      if (status.xgameruntimeSizeBytes) console.log(`     Size: ${(status.xgameruntimeSizeBytes / 1024 / 1024).toFixed(2)} MB`);

      console.log('\n2. Audio Codecs & Subsystems:');
      console.log(`   - Native XAudio2 / X3DAudio DLLs: ${status.hasXAudio2 ? '✅ YES' : '❌ NO'}`);
      console.log(`   - GStreamer Plugins (ugly/bad/libav): ${status.hasGStreamerPlugins ? '✅ YES' : '❌ NO'}`);

      console.log('\n3. Installed Game Detection:');
      const games = XodusDetector.scanStandardDirectories();
      console.log(`   - Discovered titles: ${games.length}`);
      for (const g of games) {
        console.log(`     • ${g.displayName} -> ${g.executableName}`);
      }

      console.log('\n✨ Diagnostics completed.');
      break;
    }

    case 'fix-audio': {
      const targetDir = args[3];
      if (!targetDir) {
        console.log('❌ Error: Please specify the game directory, e.g.: xodus-heroic fix-audio ~/Games/Heroic/Fallout4');
        return;
      }
      console.log(`🔧 Repairing audio configuration for: ${targetDir}...`);
      const result = AudioCodecFixer.fixGameAudio(targetDir);
      console.log(`   - Localized Voice Archive (.ba2/.fuz): ${result.voiceArchiveLinked ? '✅ Linked' : 'ℹ️  Already Present / Not Applicable'}`);
      console.log(`   - Native XAudio2 DLLs: ${result.xactDllsDeployed ? '✅ Deployed' : 'ℹ️  Already Present'}`);
      console.log(`   - Dialogue Subtitles: ${result.subtitlesEnabled ? '✅ Enabled' : 'ℹ️  Ready'}`);
      if (result.warnings.length > 0) {
        console.log('⚠️  Warnings:');
        result.warnings.forEach((w) => console.log(`   - ${w}`));
      }
      console.log('🎉 Done!');
      break;
    }

    case 'help':
    default: {
      console.log('Available Commands:');
      console.log('  xodus-heroic sync            - Scans Game Pass titles and configures them in Heroic');
      console.log('  xodus-heroic doctor          - Runs a full diagnostic audit of Proton GDK, codecs, and libraries');
      console.log('  xodus-heroic fix-audio <dir> - Repairs audio, dialogues, and subtitles for a specific game directory');
      console.log('  xodus-heroic help            - Displays this help message');
      break;
    }
  }
}
