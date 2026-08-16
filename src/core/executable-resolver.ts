import * as fs from 'fs';
import * as path from 'path';

export interface ExecutableCandidate {
  fileName: string;
  fullPath: string;
  fileSizeBytes: number;
  isLauncher: boolean;
  score: number;
}

/**
 * Intelligent Executable Resolver for Xbox Game Pass (MSIXVC / GDK) Titles
 * 
 * Analyzes directory contents, filters out launcher wrappers, telemetry collectors,
 * uninstaller stubs, and crash reporters, picking the true native game executable.
 */
export class ExecutableResolver {
  private static readonly LAUNCHER_PATTERNS = [
    /launcher\.exe$/i,
    /setup\.exe$/i,
    /crash.*\.exe$/i,
    /report.*\.exe$/i,
    /update.*\.exe$/i,
    /uninstall.*\.exe$/i,
    /eac_.*\.exe$/i,
    /easyanticheat.*\.exe$/i,
    /battleye.*\.exe$/i,
    /dxsetup\.exe$/i,
    /vcredist.*\.exe$/i
  ];

  /**
   * Evaluates all .exe files in the game root or subdirectories and returns the best candidate.
   */
  public static resolveMainExecutable(gameDir: string): ExecutableCandidate | null {
    if (!fs.existsSync(gameDir)) {
      return null;
    }

    const files = fs.readdirSync(gameDir);
    const candidates: ExecutableCandidate[] = [];

    for (const file of files) {
      if (file.toLowerCase().endsWith('.exe')) {
        const fullPath = path.join(gameDir, file);
        try {
          const stats = fs.statSync(fullPath);
          if (stats.isFile()) {
            const isLauncher = this.LAUNCHER_PATTERNS.some((pattern) => pattern.test(file));
            let score = 100;

            // Heavily penalize launchers and helper tools
            if (isLauncher) {
              score -= 80;
            }

            // Prefer larger executables (main game binaries are usually tens of megabytes)
            const sizeMb = stats.size / (1024 * 1024);
            if (sizeMb > 10) score += 40;
            else if (sizeMb > 2) score += 20;
            else score -= 10;

            // Bonus if named after the game or directory
            const dirBase = path.basename(gameDir).toLowerCase().replace(/[^a-z0-9]/g, '');
            const fileBase = file.toLowerCase().replace('.exe', '').replace(/[^a-z0-9]/g, '');
            if (dirBase && fileBase.includes(dirBase)) {
              score += 30;
            }

            candidates.push({
              fileName: file,
              fullPath,
              fileSizeBytes: stats.size,
              isLauncher,
              score
            });
          }
        } catch {
          // Ignore unreadable entries
        }
      }
    }

    if (candidates.length === 0) {
      return null;
    }

    candidates.sort((a, b) => b.score - a.score);
    return candidates[0];
  }
}
