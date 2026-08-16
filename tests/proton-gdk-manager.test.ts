import { ProtonGdkManager } from '../src/core/proton-gdk-manager';

describe('ProtonGdkManager', () => {
  test('returns valid environment flags with required GDK overrides', () => {
    const env = ProtonGdkManager.getOptimalEnvironment();
    expect(env.WINEDLLOVERRIDES).toContain('xgameruntime=n,b');
    expect(env.WINEDLLOVERRIDES).toContain('xaudio2_7=n,b');
    expect(env.WINEDLLOVERRIDES).toContain('winegstreamer=d');
    expect(env.PULSE_LATENCY_MSEC).toBe('60');
    expect(env.VKD3D_CONFIG).toBe('dxr11');
  });

  test('checks runner status', () => {
    const status = ProtonGdkManager.getRunnerStatus();
    expect(typeof status.isInstalled).toBe('boolean');
    expect(typeof status.hasXAudio2).toBe('boolean');
    expect(typeof status.hasGStreamerPlugins).toBe('boolean');
  });
});
