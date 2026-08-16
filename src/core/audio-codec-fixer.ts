import * as fs from 'fs';
import * as path from 'path';

export interface AudioFixResult {
  voiceArchiveLinked: boolean;
  subtitlesEnabled: boolean;
  xactDllsDeployed: boolean;
  warnings: string[];
}

export class AudioCodecFixer {
  /**
   * Automatically configures voice archives, subtitles, and audio DLLs for a target game.
   */
  public static fixGameAudio(gameDir: string): AudioFixResult {
    const warnings: string[] = [];
    let voiceArchiveLinked = false;
    let subtitlesEnabled = false;
    let xactDllsDeployed = false;

    if (!fs.existsSync(gameDir)) {
      return { voiceArchiveLinked, subtitlesEnabled, xactDllsDeployed, warnings: ['Katalog gry nie istnieje'] };
    }

    const dataDir = path.join(gameDir, 'Data');
    if (fs.existsSync(dataDir)) {
      // Fix Polish/Custom voice archive alias (Fallout 4 / Creation Engine pattern)
      const voicePl = path.join(dataDir, 'Fallout4 - Voices_pl.ba2');
      const voiceEn = path.join(dataDir, 'Fallout4 - Voices.ba2');

      if (fs.existsSync(voicePl) && !fs.existsSync(voiceEn)) {
        try {
          fs.linkSync(voicePl, voiceEn);
          voiceArchiveLinked = true;
        } catch {
          try {
            fs.copyFileSync(voicePl, voiceEn);
            voiceArchiveLinked = true;
          } catch (e: any) {
            warnings.push(`Nie udało się utworzyć powiązania Voices: ${e.message}`);
          }
        }
      }
    }

    // Deploy native XACT / XAudio2 DLLs if available
    const home = process.env.HOME || '/home/technic';
    const wineSys32 = path.join(home, '.wine', 'drive_c', 'windows', 'system32');
    const xaudioSrc = path.join(wineSys32, 'xaudio2_7.dll');
    const x3daudioSrc = path.join(wineSys32, 'x3daudio1_7.dll');

    if (fs.existsSync(xaudioSrc)) {
      try {
        fs.copyFileSync(xaudioSrc, path.join(gameDir, 'xaudio2_7.dll'));
        if (fs.existsSync(x3daudioSrc)) {
          fs.copyFileSync(x3daudioSrc, path.join(gameDir, 'x3daudio1_7.dll'));
        }
        xactDllsDeployed = true;
      } catch (e: any) {
        warnings.push(`Nie udało się skopiować XAudio2 DLL do folderu gry: ${e.message}`);
      }
    }

    // Configure subtitles in user INI documents
    const docGamesDir = path.join(home, '.wine', 'drive_c', 'users', 'steamuser', 'Documents', 'My Games');
    if (fs.existsSync(docGamesDir)) {
      const candidates = [
        path.join(docGamesDir, 'Fallout4 MS', 'Fallout4Custom.ini'),
        path.join(docGamesDir, 'Fallout4', 'Fallout4Custom.ini')
      ];

      for (const iniPath of candidates) {
        const iniDir = path.dirname(iniPath);
        if (fs.existsSync(iniDir)) {
          const iniContent = `[General]\nsLanguage=pl\n\n[Audio]\nbEnableAudio=1\n\n[Interface]\nbDialogueSubtitles=1\nbGeneralSubtitles=1\n`;
          try {
            fs.writeFileSync(iniPath, iniContent, 'utf8');
            subtitlesEnabled = true;
          } catch (e: any) {
            warnings.push(`Nie udało się zaktualizować INI: ${e.message}`);
          }
        }
      }
    }

    return {
      voiceArchiveLinked,
      subtitlesEnabled,
      xactDllsDeployed,
      warnings
    };
  }
}
