import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

import { specforgePath } from './paths.js';

const require = createRequire(import.meta.url);

/** All hook file names */
const HOOK_FILES = ['pre-edit.js', 'post-edit.js'];

/** Resolves the source directory of @specforge/hooks */
function getHooksSourceDir(): string {
  const hooksPkg = require.resolve('@specforge/hooks/package.json');
  return path.dirname(hooksPkg);
}

/** Copies hook scripts to .specforge/hooks/ */
export function installHooks(projectRoot: string): void {
  const sourceDir = getHooksSourceDir();
  const targetDir = specforgePath(projectRoot, 'hooks');

  fs.mkdirSync(targetDir, { recursive: true });

  for (const file of HOOK_FILES) {
    const src = path.join(sourceDir, file);
    const dest = path.join(targetDir, file);
    fs.copyFileSync(src, dest);
  }
}

/** Hook configuration for .claude/settings.json */
export interface ClaudeHooksConfig {
  hooks: {
    PreToolUse: Array<{ matcher: string; command: string }>;
    PostToolUse: Array<{ matcher: string; command: string }>;
  };
}

/** Generates the hooks configuration for .claude/settings.json */
export function generateHooksConfig(): ClaudeHooksConfig {
  return {
    hooks: {
      PreToolUse: [
        {
          matcher: 'Edit|Write',
          command: 'node .specforge/hooks/pre-edit.js',
        },
      ],
      PostToolUse: [
        {
          matcher: 'Edit|Write',
          command: 'node .specforge/hooks/post-edit.js',
        },
      ],
    },
  };
}

/** Installs hook configuration into .claude/settings.json */
export function configureHooks(projectRoot: string): void {
  const claudeDir = path.join(projectRoot, '.claude');
  const settingsPath = path.join(claudeDir, 'settings.json');

  fs.mkdirSync(claudeDir, { recursive: true });

  let settings: Record<string, unknown> = {};
  if (fs.existsSync(settingsPath)) {
    try {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    } catch {
      // Start fresh if parse fails
    }
  }

  const hooksConfig = generateHooksConfig();
  settings.hooks = hooksConfig.hooks;

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n', 'utf-8');
}
