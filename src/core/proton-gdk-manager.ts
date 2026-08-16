import * as fs from 'fs';
import * as path from 'path';

export interface ProtonGdkStatus {
  isInstalled: boolean;
  runnerPath?: string;
  xgameruntimePath?: string;
  xgameruntimeSizeBytes?: number;
  hasXAudio2: boolean;
  hasGStreamerPlugins: boolean;
}

export class ProtonGdkManager {
  /**
   * Discovers and inspects the Proton XODUS GDK runner.
   */
  public static getRunnerStatus(): ProtonGdkStatus {
    const home = process.env.HOME || '/home/technic';
    const candidateRunners = [
      path.join(home, '.config', 'heroic', 'tools', 'proton', 'Proton-XODUS-GDK'),
      path.join(home, 'xodus-proton-build', 'proton', 'build', 'build-xodusbleeding-edge-local', 'dist'),
      path.join(home, '.wine')
    ];

    let runnerPath: string | undefined;
    let xgameruntimePath: string | undefined;
    let xgameruntimeSizeBytes: number | undefined;

    for (const cand of candidateRunners) {
      if (fs.existsSync(cand)) {
        runnerPath = cand;
        const candidateDll = path.join(cand, 'files', 'lib', 'wine', 'x86_64-windows', 'xgameruntime.dll');
        const system32Dll = path.join(home, '.wine', 'drive_c', 'windows', 'system32', 'xgameruntime.dll');

        if (fs.existsSync(candidateDll)) {
          xgameruntimePath = candidateDll;
          xgameruntimeSizeBytes = fs.statSync(candidateDll).size;
          break;
        } else if (fs.existsSync(system32Dll)) {
          xgameruntimePath = system32Dll;
          xgameruntimeSizeBytes = fs.statSync(system32Dll).size;
          break;
        }
      }
    }

    const wineSys32 = path.join(home, '.wine', 'drive_c', 'windows', 'system32');
    const hasXAudio2 = fs.existsSync(path.join(wineSys32, 'xaudio2_7.dll')) && fs.existsSync(path.join(wineSys32, 'x3daudio1_7.dll'));

    // Verify system GStreamer plugins
    const hasGStreamerPlugins = fs.existsSync('/usr/lib/x86_64-linux-gnu/gstreamer-1.0/libgstlibav.so') ||
                                fs.existsSync('/usr/lib/x86_64-linux-gnu/gstreamer-1.0/libgstbadvideo.so');

    return {
      isInstalled: !!runnerPath,
      runnerPath,
      xgameruntimePath,
      xgameruntimeSizeBytes,
      hasXAudio2,
      hasGStreamerPlugins
    };
  }

  /**
   * Generates optimal environment variable flags for running Xbox Game Pass GDK titles.
   */
  public static getOptimalEnvironment(overrides: Record<string, string> = {}): Record<string, string> {
    return {
      WINEDLLOVERRIDES: 'winegstreamer=d;xaudio2_7=n,b;x3daudio1_7=n,b;xgameruntime=n,b',
      PULSE_LATENCY_MSEC: '60',
      DXVK_ENABLE_NVAPI: '1',
      VKD3D_CONFIG: 'dxr11',
      PROTON_ENABLE_NVAPI: '1',
      WINEDEBUG: '-all,fixme-all',
      ...overrides
    };
  }
}
