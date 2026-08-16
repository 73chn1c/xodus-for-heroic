import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { GdkGameMetadata } from './xodus-detector';
import { ProtonGdkManager } from './proton-gdk-manager';

export class HeroicLibrary {
  private static getHeroicConfigDir(): string {
    const home = os.homedir();
    return path.join(home, '.config', 'heroic');
  }

  /**
   * Generates or updates a Heroic Game Config for an Xbox Game Pass GDK title.
   */
  public static syncGameToHeroic(game: GdkGameMetadata): string {
    const configDir = path.join(this.getHeroicConfigDir(), 'GamesConfig');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    const gameId = (game.titleId || path.basename(game.gameDirectory)).toLowerCase().replace(/[^a-z0-9]/g, '_');
    const configFilePath = path.join(configDir, `${gameId}.json`);

    const runnerStatus = ProtonGdkManager.getRunnerStatus();
    const env = ProtonGdkManager.getOptimalEnvironment();

    const heroicConfig = {
      autoInstallDxvk: true,
      autoInstallVkd3d: true,
      enableFSR: false,
      enableEsync: true,
      enableFsync: true,
      wineVersion: {
        bin: runnerStatus.runnerPath ? path.join(runnerStatus.runnerPath, 'files', 'bin', 'wine') : '/usr/bin/wine',
        name: 'Proton - Proton-XODUS-GDK',
        type: 'proton'
      },
      winePrefix: path.join(os.homedir(), '.wine'),
      targetExe: game.executableFullPath,
      launcherArgs: '',
      environmentOptions: Object.entries(env).map(([key, value]) => ({ key, value })),
      wrapper: '',
      showFps: false,
      useGameMode: true,
      nvidiaPrime: true,
      xodusTitleId: game.titleId || '',
      xodusPackageFamilyName: game.packageFamilyName || '',
      xodusMetadata: {
        displayName: game.displayName,
        version: game.version || '1.0.0',
        installPath: game.gameDirectory
      }
    };

    fs.writeFileSync(configFilePath, JSON.stringify(heroicConfig, null, 2), 'utf8');
    return configFilePath;
  }
}
