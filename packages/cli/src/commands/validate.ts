import fs from 'node:fs';
import path from 'node:path';

import { Command } from 'commander';
import yaml from 'js-yaml';

import { readForgeConfig } from '../lib/forge-config.js';
import { specforgeDir, specforgePath } from '../lib/paths.js';

interface ValidationIssue {
  level: 'error' | 'warning';
  file: string;
  message: string;
}

/** Runs the validate command — lints all .specforge/ artifacts */
export function runValidate(projectRoot: string): void {
  const sfDir = specforgeDir(projectRoot);

  if (!fs.existsSync(sfDir)) {
    console.error('Error: SpecForge is not initialized. Run `specforge init` first.');
    process.exit(1);
  }

  const issues: ValidationIssue[] = [];

  // Validate forge.yml
  validateForgeYml(projectRoot, issues);

  // Validate constitution
  validateConstitution(projectRoot, issues);

  // Validate specs
  validateSpecs(projectRoot, issues);

  // Validate plans
  validatePlans(projectRoot, issues);

  // Validate tasks
  validateTasks(projectRoot, issues);

  // Report
  if (issues.length === 0) {
    console.log('All SpecForge artifacts are valid.');
    return;
  }

  const errors = issues.filter((i) => i.level === 'error');
  const warnings = issues.filter((i) => i.level === 'warning');

  for (const issue of issues) {
    const prefix = issue.level === 'error' ? 'ERROR' : 'WARNING';
    console.log(`[${prefix}] ${issue.file}: ${issue.message}`);
  }

  console.log('');
  console.log(`${errors.length} error(s), ${warnings.length} warning(s)`);

  if (errors.length > 0) {
    process.exit(1);
  }
}

/** Validates forge.yml exists and has required fields */
function validateForgeYml(projectRoot: string, issues: ValidationIssue[]): void {
  const config = readForgeConfig(projectRoot);

  if (!config) {
    issues.push({
      level: 'error',
      file: 'forge.yml',
      message: 'File not found',
    });
    return;
  }

  if (!config.version) {
    issues.push({ level: 'error', file: 'forge.yml', message: 'Missing "version" field' });
  }

  if (!config.project?.name) {
    issues.push({ level: 'error', file: 'forge.yml', message: 'Missing "project.name" field' });
  }

  if (!config.project?.initialized) {
    issues.push({ level: 'error', file: 'forge.yml', message: 'Missing "project.initialized" field' });
  }

  // Validate feature references
  for (const feature of config.features ?? []) {
    if (!feature.id) {
      issues.push({ level: 'error', file: 'forge.yml', message: 'Feature missing "id" field' });
      continue;
    }

    if (feature.spec) {
      const specPath = specforgePath(projectRoot, feature.spec);
      if (!fs.existsSync(specPath)) {
        issues.push({
          level: 'error',
          file: 'forge.yml',
          message: `Feature "${feature.id}" references missing spec: ${feature.spec}`,
        });
      }
    }

    if (feature.plan) {
      const planPath = specforgePath(projectRoot, feature.plan);
      if (!fs.existsSync(planPath)) {
        issues.push({
          level: 'error',
          file: 'forge.yml',
          message: `Feature "${feature.id}" references missing plan: ${feature.plan}`,
        });
      }
    }

    if (feature.tasks) {
      const tasksPath = specforgePath(projectRoot, feature.tasks);
      if (!fs.existsSync(tasksPath)) {
        issues.push({
          level: 'error',
          file: 'forge.yml',
          message: `Feature "${feature.id}" references missing tasks: ${feature.tasks}`,
        });
      }
    }
  }
}

/** Validates constitution.md exists and has required sections */
function validateConstitution(projectRoot: string, issues: ValidationIssue[]): void {
  const constitutionPath = specforgePath(projectRoot, 'constitution.md');

  if (!fs.existsSync(constitutionPath)) {
    issues.push({
      level: 'error',
      file: 'constitution.md',
      message: 'File not found',
    });
    return;
  }

  const content = fs.readFileSync(constitutionPath, 'utf-8');
  const requiredSections = [
    'Project Identity',
    'Quality Standards',
    'Architecture',
    'AI Guardrails',
  ];

  for (const section of requiredSections) {
    if (!content.includes(`## ${section}`)) {
      issues.push({
        level: 'warning',
        file: 'constitution.md',
        message: `Missing section: "${section}"`,
      });
    }
  }
}

/** Validates all spec files have required sections */
function validateSpecs(projectRoot: string, issues: ValidationIssue[]): void {
  const specsDir = specforgePath(projectRoot, 'specs');
  if (!fs.existsSync(specsDir)) return;

  const files = fs.readdirSync(specsDir).filter((f) => f.endsWith('.md'));

  for (const file of files) {
    const content = fs.readFileSync(path.join(specsDir, file), 'utf-8');

    const requiredSections = ['Overview', 'User Stories', 'Acceptance Criteria'];
    for (const section of requiredSections) {
      if (!content.includes(`## ${section}`)) {
        issues.push({
          level: 'warning',
          file: `specs/${file}`,
          message: `Missing section: "${section}"`,
        });
      }
    }

    // Check for unresolved open questions
    if (content.includes('## Open Questions') && !content.includes('(none)')) {
      const openSection = content.split('## Open Questions')[1];
      if (openSection && openSection.trim().length > 0) {
        const hasQuestions = openSection.split('\n').some((l) =>
          l.trim().startsWith('-') && !l.includes('{'),
        );
        if (hasQuestions) {
          issues.push({
            level: 'warning',
            file: `specs/${file}`,
            message: 'Has unresolved open questions',
          });
        }
      }
    }
  }
}

/** Validates all plan files have required sections */
function validatePlans(projectRoot: string, issues: ValidationIssue[]): void {
  const plansDir = specforgePath(projectRoot, 'plans');
  if (!fs.existsSync(plansDir)) return;

  const files = fs.readdirSync(plansDir).filter((f) => f.endsWith('.md'));

  for (const file of files) {
    const content = fs.readFileSync(path.join(plansDir, file), 'utf-8');

    const requiredSections = ['Technical Approach', 'File Changes', 'Testing Strategy'];
    for (const section of requiredSections) {
      if (!content.includes(`## ${section}`)) {
        issues.push({
          level: 'warning',
          file: `plans/${file}`,
          message: `Missing section: "${section}"`,
        });
      }
    }
  }
}

/** Validates all task files have correct YAML structure */
function validateTasks(projectRoot: string, issues: ValidationIssue[]): void {
  const tasksDir = specforgePath(projectRoot, 'tasks');
  if (!fs.existsSync(tasksDir)) return;

  const files = fs.readdirSync(tasksDir).filter((f) => f.endsWith('.yml'));

  for (const file of files) {
    const filePath = path.join(tasksDir, file);
    let data: Record<string, unknown>;

    try {
      data = yaml.load(fs.readFileSync(filePath, 'utf-8')) as Record<string, unknown>;
    } catch {
      issues.push({
        level: 'error',
        file: `tasks/${file}`,
        message: 'Invalid YAML',
      });
      continue;
    }

    if (!data.feature) {
      issues.push({ level: 'error', file: `tasks/${file}`, message: 'Missing "feature" field' });
    }

    if (!Array.isArray(data.tasks)) {
      issues.push({ level: 'error', file: `tasks/${file}`, message: 'Missing "tasks" array' });
      continue;
    }

    const taskIds = new Set<string>();
    for (const task of data.tasks as Array<Record<string, unknown>>) {
      if (!task.id) {
        issues.push({ level: 'error', file: `tasks/${file}`, message: 'Task missing "id" field' });
        continue;
      }

      const id = task.id as string;
      if (taskIds.has(id)) {
        issues.push({ level: 'error', file: `tasks/${file}`, message: `Duplicate task ID: "${id}"` });
      }
      taskIds.add(id);

      if (!task.title) {
        issues.push({ level: 'warning', file: `tasks/${file}`, message: `Task "${id}" missing "title"` });
      }

      if (!task.status) {
        issues.push({ level: 'warning', file: `tasks/${file}`, message: `Task "${id}" missing "status"` });
      }

      // Validate depends_on references exist
      if (Array.isArray(task.depends_on)) {
        for (const dep of task.depends_on as string[]) {
          if (!taskIds.has(dep)) {
            // Allow forward references (dep defined later in the file)
            const allIds = (data.tasks as Array<Record<string, unknown>>).map(
              (t) => t.id as string,
            );
            if (!allIds.includes(dep)) {
              issues.push({
                level: 'error',
                file: `tasks/${file}`,
                message: `Task "${id}" depends on unknown task "${dep}"`,
              });
            }
          }
        }
      }
    }
  }
}

/** Creates the `specforge validate` command */
export function createValidateCommand(): Command {
  const cmd = new Command('validate');

  cmd
    .description('Lint all .specforge/ artifacts for structural correctness')
    .action(() => {
      runValidate(process.cwd());
    });

  return cmd;
}
