import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { runInit } from './init.js';
import { runSync } from './sync.js';

describe('specforge sync', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'specforge-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('errors if not initialized', () => {
    const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit');
    });

    expect(() => runSync(tmpDir)).toThrow('process.exit');
    expect(mockExit).toHaveBeenCalledWith(1);

    mockExit.mockRestore();
  });

  it('updates CLAUDE.md with constitution content', () => {
    runInit(tmpDir, { name: 'sync-test' });

    // Update constitution with real content
    const constitutionPath = path.join(tmpDir, '.specforge', 'constitution.md');
    const constitution = fs.readFileSync(constitutionPath, 'utf-8');
    const updated = constitution
      .replace('{one-line mission statement}', 'Build the best app')
      .replace('{languages, frameworks, databases}', 'TypeScript, React, PostgreSQL');
    fs.writeFileSync(constitutionPath, updated, 'utf-8');

    runSync(tmpDir);

    const claudeMd = fs.readFileSync(path.join(tmpDir, 'CLAUDE.md'), 'utf-8');
    expect(claudeMd).toContain('Build the best app');
    expect(claudeMd).toContain('TypeScript, React, PostgreSQL');
  });
});
