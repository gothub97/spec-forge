import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import yaml from 'js-yaml';

import { runInit } from './init.js';
import { runValidate } from './validate.js';

describe('specforge validate', () => {
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

    expect(() => runValidate(tmpDir)).toThrow('process.exit');
    expect(mockExit).toHaveBeenCalledWith(1);

    mockExit.mockRestore();
  });

  it('passes on a fresh init', () => {
    runInit(tmpDir, { name: 'valid-proj' });

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    runValidate(tmpDir);

    const output = logSpy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('All SpecForge artifacts are valid');

    logSpy.mockRestore();
  });

  it('reports error for missing forge.yml', () => {
    runInit(tmpDir, { name: 'test' });
    fs.unlinkSync(path.join(tmpDir, '.specforge', 'forge.yml'));

    const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit');
    });
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    expect(() => runValidate(tmpDir)).toThrow('process.exit');

    const output = logSpy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('ERROR');
    expect(output).toContain('forge.yml');

    mockExit.mockRestore();
    logSpy.mockRestore();
  });

  it('reports error for invalid task YAML', () => {
    runInit(tmpDir, { name: 'test' });

    // Create a feature with a bad tasks file
    const forgeYmlPath = path.join(tmpDir, '.specforge', 'forge.yml');
    const config = yaml.load(fs.readFileSync(forgeYmlPath, 'utf-8')) as Record<string, unknown>;
    (config as Record<string, unknown[]>).features = [{
      id: '001-test',
      slug: 'test',
      spec: null,
      plan: null,
      tasks: 'tasks/001-test.yml',
      status: 'in_progress',
      created: new Date().toISOString(),
    }];
    fs.writeFileSync(forgeYmlPath, yaml.dump(config), 'utf-8');
    fs.writeFileSync(
      path.join(tmpDir, '.specforge', 'tasks', '001-test.yml'),
      'not: valid: yaml: [[[',
      'utf-8',
    );

    const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit');
    });
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    expect(() => runValidate(tmpDir)).toThrow('process.exit');

    const output = logSpy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('ERROR');

    mockExit.mockRestore();
    logSpy.mockRestore();
  });
});
