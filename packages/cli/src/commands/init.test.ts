import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import yaml from 'js-yaml';

import { runInit } from './init.js';
import type { ForgeConfig } from '../lib/forge-config.js';

describe('specforge init', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'specforge-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('creates .specforge/ directory structure', () => {
    runInit(tmpDir, {});

    const expectedDirs = ['specs', 'plans', 'tasks', 'history', 'templates', 'skills', 'hooks'];
    for (const dir of expectedDirs) {
      const dirPath = path.join(tmpDir, '.specforge', dir);
      expect(fs.existsSync(dirPath), `${dir}/ should exist`).toBe(true);
      expect(fs.statSync(dirPath).isDirectory()).toBe(true);
    }
  });

  it('creates forge.yml with correct structure', () => {
    runInit(tmpDir, { name: 'my-project' });

    const forgeYml = path.join(tmpDir, '.specforge', 'forge.yml');
    expect(fs.existsSync(forgeYml)).toBe(true);

    const config = yaml.load(fs.readFileSync(forgeYml, 'utf-8')) as ForgeConfig;
    expect(config.version).toBe('0.1.0');
    expect(config.project.name).toBe('my-project');
    expect(config.features).toEqual([]);
    expect(config.settings.auto_sync_claude_md).toBe(true);
    expect(config.settings.forge_max_retries).toBe(3);
  });

  it('creates constitution.md with project name', () => {
    runInit(tmpDir, { name: 'test-app' });

    const constitution = fs.readFileSync(
      path.join(tmpDir, '.specforge', 'constitution.md'),
      'utf-8',
    );
    expect(constitution).toContain('# Constitution — test-app');
  });

  it('creates template files', () => {
    runInit(tmpDir, {});

    const templates = ['constitution.md', 'spec.md', 'plan.md'];
    for (const tpl of templates) {
      const tplPath = path.join(tmpDir, '.specforge', 'templates', tpl);
      expect(fs.existsSync(tplPath), `templates/${tpl} should exist`).toBe(true);
      expect(fs.readFileSync(tplPath, 'utf-8').length).toBeGreaterThan(0);
    }
  });

  it('installs all 8 skill files', () => {
    runInit(tmpDir, {});

    const skills = [
      'constitution.md', 'specify.md', 'clarify.md', 'plan.md',
      'tasks.md', 'implement.md', 'review.md', 'status.md',
    ];
    for (const skill of skills) {
      const skillPath = path.join(tmpDir, '.specforge', 'skills', skill);
      expect(fs.existsSync(skillPath), `skills/${skill} should exist`).toBe(true);
      expect(fs.readFileSync(skillPath, 'utf-8').length).toBeGreaterThan(0);
    }
  });

  it('installs hook scripts', () => {
    runInit(tmpDir, {});

    const hooks = ['pre-edit.js', 'post-edit.js'];
    for (const hook of hooks) {
      const hookPath = path.join(tmpDir, '.specforge', 'hooks', hook);
      expect(fs.existsSync(hookPath), `hooks/${hook} should exist`).toBe(true);
    }
  });

  it('configures .claude/settings.json with hooks', () => {
    runInit(tmpDir, {});

    const settingsPath = path.join(tmpDir, '.claude', 'settings.json');
    expect(fs.existsSync(settingsPath)).toBe(true);

    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    expect(settings.hooks.PreToolUse).toHaveLength(1);
    expect(settings.hooks.PreToolUse[0].matcher).toBe('Edit|Write');
    expect(settings.hooks.PostToolUse).toHaveLength(1);
    expect(settings.hooks.PostToolUse[0].matcher).toBe('Edit|Write');
  });

  it('creates CLAUDE.md with SpecForge section', () => {
    runInit(tmpDir, {});

    const claudeMd = fs.readFileSync(path.join(tmpDir, 'CLAUDE.md'), 'utf-8');
    expect(claudeMd).toContain('## SpecForge');
    expect(claudeMd).toContain('### Skills');
    expect(claudeMd).toContain('.specforge/skills/constitution.md');
    expect(claudeMd).toContain('### Hooks');
    expect(claudeMd).toContain('<!-- specforge:start -->');
    expect(claudeMd).toContain('<!-- specforge:end -->');
  });

  it('appends to existing CLAUDE.md without overwriting', () => {
    fs.writeFileSync(path.join(tmpDir, 'CLAUDE.md'), '# My Project\n\nExisting content.\n');

    runInit(tmpDir, {});

    const claudeMd = fs.readFileSync(path.join(tmpDir, 'CLAUDE.md'), 'utf-8');
    expect(claudeMd).toContain('# My Project');
    expect(claudeMd).toContain('Existing content.');
    expect(claudeMd).toContain('## SpecForge');
  });

  it('replaces existing SpecForge section on reinit', () => {
    runInit(tmpDir, { name: 'first' });
    runInit(tmpDir, { name: 'second', force: true });

    const claudeMd = fs.readFileSync(path.join(tmpDir, 'CLAUDE.md'), 'utf-8');
    const matches = claudeMd.match(/<!-- specforge:start -->/g);
    expect(matches).toHaveLength(1);
  });

  it('reads project name from package.json', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'pkg-name' }),
    );

    runInit(tmpDir, {});

    const config = yaml.load(
      fs.readFileSync(path.join(tmpDir, '.specforge', 'forge.yml'), 'utf-8'),
    ) as ForgeConfig;
    expect(config.project.name).toBe('pkg-name');
  });

  it('falls back to directory name if no package.json', () => {
    runInit(tmpDir, {});

    const config = yaml.load(
      fs.readFileSync(path.join(tmpDir, '.specforge', 'forge.yml'), 'utf-8'),
    ) as ForgeConfig;
    expect(config.project.name).toBe(path.basename(tmpDir));
  });

  it('--name flag overrides package.json', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'pkg-name' }),
    );

    runInit(tmpDir, { name: 'override-name' });

    const config = yaml.load(
      fs.readFileSync(path.join(tmpDir, '.specforge', 'forge.yml'), 'utf-8'),
    ) as ForgeConfig;
    expect(config.project.name).toBe('override-name');
  });

  it('errors if .specforge/ already exists without --force', () => {
    fs.mkdirSync(path.join(tmpDir, '.specforge'));

    const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });

    expect(() => runInit(tmpDir, {})).toThrow('process.exit called');
    expect(mockExit).toHaveBeenCalledWith(1);

    mockExit.mockRestore();
  });

  it('reinitializes with --force', () => {
    runInit(tmpDir, { name: 'first' });
    runInit(tmpDir, { name: 'second', force: true });

    const config = yaml.load(
      fs.readFileSync(path.join(tmpDir, '.specforge', 'forge.yml'), 'utf-8'),
    ) as ForgeConfig;
    expect(config.project.name).toBe('second');
  });
});
