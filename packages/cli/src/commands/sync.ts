import fs from 'node:fs';

import { Command } from 'commander';

import { updateClaudeMd } from '../lib/claude-md.js';
import { specforgeDir, specforgePath } from '../lib/paths.js';

/** Runs the sync command — re-syncs CLAUDE.md from constitution */
export function runSync(projectRoot: string): void {
  const sfDir = specforgeDir(projectRoot);

  if (!fs.existsSync(sfDir)) {
    console.error('Error: SpecForge is not initialized. Run `specforge init` first.');
    process.exit(1);
  }

  const constitutionPath = specforgePath(projectRoot, 'constitution.md');
  if (!fs.existsSync(constitutionPath)) {
    console.error('Error: constitution.md not found in .specforge/');
    process.exit(1);
  }

  updateClaudeMd(projectRoot, constitutionPath);

  console.log('Synced CLAUDE.md with constitution.');
}

/** Creates the `specforge sync` command */
export function createSyncCommand(): Command {
  const cmd = new Command('sync');

  cmd
    .description('Re-sync CLAUDE.md with constitution and active spec context')
    .action(() => {
      runSync(process.cwd());
    });

  return cmd;
}
