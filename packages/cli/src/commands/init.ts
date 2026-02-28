import fs from 'node:fs';
import path from 'node:path';

import { Command } from 'commander';

import { updateClaudeMd } from '../lib/claude-md.js';
import { createDefaultConfig, writeForgeConfig } from '../lib/forge-config.js';
import { configureHooks, installHooks } from '../lib/hooks.js';
import { specforgeDir, specforgePath, SPECFORGE_SUBDIRS } from '../lib/paths.js';
import { installSkills } from '../lib/skills.js';
import {
  CONSTITUTION_TEMPLATE,
  PLAN_TEMPLATE,
  SPEC_TEMPLATE,
} from '../lib/templates.js';

interface InitOptions {
  name?: string;
  force?: boolean;
}

/**
 * Creates the .specforge/ directory structure and initial files.
 * Copies skills and hooks, configures CLAUDE.md and .claude/settings.json.
 */
export function runInit(projectRoot: string, options: InitOptions): void {
  const sfDir = specforgeDir(projectRoot);
  const exists = fs.existsSync(sfDir);

  if (exists && !options.force) {
    console.error(
      `Error: ${sfDir} already exists. Use --force to reinitialize.`,
    );
    process.exit(1);
  }

  // Determine project name
  const projectName = resolveProjectName(projectRoot, options.name);

  // Create directory structure
  createDirectories(projectRoot);

  // Write templates
  writeTemplates(projectRoot);

  // Write constitution from template
  writeConstitution(projectRoot, projectName);

  // Install skills
  installSkills(projectRoot);

  // Install hooks
  installHooks(projectRoot);

  // Configure hooks in .claude/settings.json
  configureHooks(projectRoot);

  // Write forge.yml
  const config = createDefaultConfig(projectName);
  writeForgeConfig(projectRoot, config);

  // Update CLAUDE.md
  const constitutionPath = specforgePath(projectRoot, 'constitution.md');
  updateClaudeMd(projectRoot, constitutionPath);

  console.log(`Initialized SpecForge in ${sfDir}`);
  console.log('');
  console.log('Created:');
  console.log('  .specforge/constitution.md    — project constitution (edit this!)');
  console.log('  .specforge/forge.yml          — project state');
  console.log('  .specforge/templates/         — spec & plan templates');
  console.log('  .specforge/skills/            — Claude Code skill files');
  console.log('  .specforge/hooks/             — pre/post edit hooks');
  console.log('  .specforge/specs/             — feature specifications');
  console.log('  .specforge/plans/             — implementation plans');
  console.log('  .specforge/tasks/             — task lists (YAML)');
  console.log('  .specforge/history/           — forge cycle logs');
  console.log('  .claude/settings.json         — hook configuration');
  console.log('  CLAUDE.md                     — updated with SpecForge section');
  console.log('');
  console.log('Next steps:');
  console.log('  1. Edit .specforge/constitution.md with your project rules');
  console.log('  2. Run /forge.constitution to fill it in interactively');
  console.log('  3. Run /forge.specify to create your first feature spec');
}

/** Resolves project name from flag, package.json, or directory name */
function resolveProjectName(projectRoot: string, nameFlag?: string): string {
  if (nameFlag) {
    return nameFlag;
  }

  // Try reading from package.json
  const pkgPath = path.join(projectRoot, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as { name?: string };
      if (pkg.name) {
        return pkg.name;
      }
    } catch {
      // Ignore parse errors, fall through
    }
  }

  // Fall back to directory name
  return path.basename(projectRoot);
}

/** Creates the .specforge/ directory and all subdirectories */
function createDirectories(projectRoot: string): void {
  for (const subdir of SPECFORGE_SUBDIRS) {
    const dir = specforgePath(projectRoot, subdir);
    fs.mkdirSync(dir, { recursive: true });
  }
}

/** Writes default templates to .specforge/templates/ */
function writeTemplates(projectRoot: string): void {
  const templatesDir = specforgePath(projectRoot, 'templates');

  fs.writeFileSync(
    path.join(templatesDir, 'constitution.md'),
    CONSTITUTION_TEMPLATE,
    'utf-8',
  );
  fs.writeFileSync(
    path.join(templatesDir, 'spec.md'),
    SPEC_TEMPLATE,
    'utf-8',
  );
  fs.writeFileSync(
    path.join(templatesDir, 'plan.md'),
    PLAN_TEMPLATE,
    'utf-8',
  );
}

/** Writes the initial constitution.md with project name filled in */
function writeConstitution(projectRoot: string, projectName: string): void {
  const content = CONSTITUTION_TEMPLATE.replace('{Project Name}', projectName);
  fs.writeFileSync(
    specforgePath(projectRoot, 'constitution.md'),
    content,
    'utf-8',
  );
}

/** Creates the `specforge init` command */
export function createInitCommand(): Command {
  const cmd = new Command('init');

  cmd
    .description('Initialize .specforge/ in the current project')
    .option('-n, --name <name>', 'project name (defaults to package.json name or directory)')
    .option('-f, --force', 'reinitialize even if .specforge/ exists', false)
    .action((options: InitOptions) => {
      runInit(process.cwd(), options);
    });

  return cmd;
}
