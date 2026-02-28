import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { runInit } from './init.js';
import { runStatus } from './status.js';

describe('specforge status', () => {
  let tmpDir: string;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'specforge-test-'));
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    logSpy.mockRestore();
  });

  it('errors if not initialized', () => {
    const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit');
    });

    expect(() => runStatus(tmpDir)).toThrow('process.exit');
    expect(mockExit).toHaveBeenCalledWith(1);

    mockExit.mockRestore();
  });

  it('shows project name and no tasks message', () => {
    runInit(tmpDir, { name: 'test-proj' });
    logSpy.mockClear();

    runStatus(tmpDir);

    const output = logSpy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('test-proj');
    expect(output).toContain('No tasks yet');
    expect(output).toContain('No features defined yet');
  });
});
