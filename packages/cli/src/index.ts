#!/usr/bin/env node

import { Command } from 'commander';

import { createInitCommand } from './commands/init.js';
import { createStatusCommand } from './commands/status.js';
import { createSyncCommand } from './commands/sync.js';
import { createValidateCommand } from './commands/validate.js';

const program = new Command();

program
  .name('specforge')
  .description('Spec-driven development toolkit for Claude Code')
  .version('0.1.0');

program.addCommand(createInitCommand());
program.addCommand(createStatusCommand());
program.addCommand(createSyncCommand());
program.addCommand(createValidateCommand());

program.parse();
