import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ExecutableResolver } from '../src/core/executable-resolver';

describe('ExecutableResolver', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'xodus-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('prioritizes main game binary over launcher wrapper', () => {
    // Create Fallout4Launcher.exe (small file)
    const launcherPath = path.join(tempDir, 'Fallout4Launcher.exe');
    fs.writeFileSync(launcherPath, Buffer.alloc(1024 * 100)); // 100 KB

    // Create Fallout4.exe (large binary)
    const gamePath = path.join(tempDir, 'Fallout4.exe');
    fs.writeFileSync(gamePath, Buffer.alloc(1024 * 1024 * 50)); // 50 MB

    // Create CrashHandler.exe
    const crashPath = path.join(tempDir, 'CrashHandler.exe');
    fs.writeFileSync(crashPath, Buffer.alloc(1024 * 500)); // 500 KB

    const result = ExecutableResolver.resolveMainExecutable(tempDir);
    expect(result).not.toBeNull();
    expect(result?.fileName).toBe('Fallout4.exe');
    expect(result?.isLauncher).toBe(false);
  });

  test('returns null for empty directory', () => {
    const result = ExecutableResolver.resolveMainExecutable(tempDir);
    expect(result).toBeNull();
  });
});
