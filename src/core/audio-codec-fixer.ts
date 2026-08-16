import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

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
      return { voiceArchiveLinked, subtitlesEnabled, xactDllsDeployed, warnings: ['Target directory does not exist'] };
    }

    const dataDir = path.join(gameDir, 'Data');
    if (fs.existsSync(dataDir)) {
      try {
        const files = fs.readdirSync(dataDir);
        for (const file of files) {
          const match = file.match(/^(.+)\s*-\s*Voices_[a-zA-Z]{2}\.ba2$/i);
          if (match) {
            const baseVoiceArchive = path.join(dataDir, `${match[1]} - Voices.ba2`);
            const localizedArchive = path.join(dataDir, file);
            if (!fs.existsSync(baseVoiceArchive)) {
              try {
                fs.linkSync(localizedArchive, baseVoiceArchive);
                voiceArchiveLinked = true;
              } catch {
                fs.copyFileSync(localizedArchive, baseVoiceArchive);
                voiceArchiveLinked = true;
              }
            }
          }
        }
      } catch (e: any) {
        warnings.push(`Could not process voice archives: ${e.message}`);
      }
    }

    const home = os.homedir();
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
        warnings.push(`Could not deploy XAudio2 DLLs: ${e.message}`);
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
