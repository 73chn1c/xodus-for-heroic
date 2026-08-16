import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { XodusDetector } from '../src/core/xodus-detector';

describe('XodusDetector', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'xodus-detect-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('parses MicrosoftGame.config and extracts metadata', () => {
    const configXml = `<?xml version="1.0" encoding="utf-8"?>
<Game configVersion="1">
  <Identity Name="Bethesda.Fallout4PC" Publisher="CN=Bethesda" Version="1.10.984.0" />
  <ExecutableList>
    <Executable Name="Fallout4Launcher.exe" TargetDeviceFamily="PC" />
  </ExecutableList>
  <ShellVisualElements DisplayName="Fallout 4" Square150x150Logo="Assets\\Logo.png" />
  <ExtendedAttributeList>
    <ExtendedAttribute Name="TitleId" Value="4AE8F9B2" />
  </ExtendedAttributeList>
</Game>`;

    fs.writeFileSync(path.join(tempDir, 'MicrosoftGame.config'), configXml, 'utf8');
    fs.writeFileSync(path.join(tempDir, 'Fallout4.exe'), Buffer.alloc(1024 * 1024 * 40));
    fs.writeFileSync(path.join(tempDir, 'Fallout4Launcher.exe'), Buffer.alloc(1024 * 200));

    const meta = XodusDetector.inspectGameDirectory(tempDir);
    expect(meta).not.toBeNull();
    expect(meta?.displayName).toBe('Fallout 4');
    expect(meta?.packageFamilyName).toBe('Bethesda.Fallout4PC');
    expect(meta?.version).toBe('1.10.984.0');
    expect(meta?.executableName).toBe('Fallout4.exe');
  });
});
