import fs from 'node:fs';
import path from 'node:path';

import { Command } from 'commander';
import yaml from 'js-yaml';

import { readForgeConfig } from '../lib/forge-config.js';
import { specforgeDir, specforgePath } from '../lib/paths.js';

interface TaskData {
  feature: string;
  status: string;
  progress: {
    total: number;
    done: number;
    in_progress: number;
    pending: number;
    blocked: number;
  };
  tasks: Array<{
    id: string;
    title: string;
    status: string;
    depends_on: string[];
    blocked_reason?: string;
  }>;
}

/** Runs the status command */
export function runStatus(projectRoot: string): void {
  const sfDir = specforgeDir(projectRoot);

  if (!fs.existsSync(sfDir)) {
    console.error('Error: SpecForge is not initialized. Run `specforge init` first.');
    process.exit(1);
  }

  const config = readForgeConfig(projectRoot);
  if (!config) {
    console.error('Error: forge.yml not found.');
    process.exit(1);
  }

  console.log(`# SpecForge Status — ${config.project.name}`);
  console.log('');

  // Aggregate task data
  const allTasks = loadAllTasks(projectRoot, config);
  const totalTasks = allTasks.reduce((sum, t) => sum + t.progress.total, 0);
  const totalDone = allTasks.reduce((sum, t) => sum + t.progress.done, 0);

  // Overall progress
  if (totalTasks > 0) {
    const pct = Math.round((totalDone / totalTasks) * 100);
    const filled = Math.round(pct / 5);
    const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(20 - filled);
    console.log(`## Overall Progress`);
    console.log(`${totalDone} / ${totalTasks} tasks (${pct}%)`);
    console.log(`${bar} ${pct}%`);
  } else {
    console.log('## Overall Progress');
    console.log('No tasks yet.');
  }
  console.log('');

  // Features table
  console.log('## Features');
  if (config.features.length === 0) {
    console.log('No features defined yet. Run /forge.specify to create one.');
  } else {
    console.log('| Feature | Status | Progress | Blocked |');
    console.log('|---------|--------|----------|---------|');
    for (const feature of config.features) {
      const taskData = allTasks.find((t) => t.feature === feature.id);
      const progress = taskData
        ? `${taskData.progress.done}/${taskData.progress.total} (${Math.round((taskData.progress.done / taskData.progress.total) * 100)}%)`
        : '—';
      const blocked = taskData ? String(taskData.progress.blocked) : '—';
      console.log(`| ${feature.id} | ${feature.status} | ${progress} | ${blocked} |`);
    }
  }
  console.log('');

  // Blocked tasks
  const blockedTasks = allTasks.flatMap((td) =>
    td.tasks
      .filter((t) => t.status === 'blocked')
      .map((t) => ({ ...t, feature: td.feature })),
  );

  if (blockedTasks.length > 0) {
    console.log('## Blocked Tasks');
    for (const task of blockedTasks) {
      const reason = task.blocked_reason ? ` — ${task.blocked_reason}` : '';
      const deps = task.depends_on.length > 0
        ? ` (blocked by: ${task.depends_on.join(', ')})`
        : '';
      console.log(`- ${task.id}: "${task.title}"${deps}${reason}`);
    }
    console.log('');
  }

  // Recent activity
  printRecentActivity(projectRoot);
}

/** Loads all task YAML files for features in the config */
function loadAllTasks(
  projectRoot: string,
  config: ReturnType<typeof readForgeConfig> & object,
): TaskData[] {
  const results: TaskData[] = [];

  for (const feature of config.features) {
    if (!feature.tasks) continue;

    const tasksPath = specforgePath(projectRoot, feature.tasks);
    if (!fs.existsSync(tasksPath)) continue;

    try {
      const data = yaml.load(fs.readFileSync(tasksPath, 'utf-8')) as TaskData;
      results.push(data);
    } catch {
      // Skip malformed task files
    }
  }

  return results;
}

/** Prints the last 10 activity log entries */
function printRecentActivity(projectRoot: string): void {
  const historyDir = specforgePath(projectRoot, 'history');
  if (!fs.existsSync(historyDir)) return;

  const logFiles = fs.readdirSync(historyDir).filter((f) => f.endsWith('.log.md'));
  if (logFiles.length === 0) return;

  const entries: string[] = [];

  for (const file of logFiles) {
    const content = fs.readFileSync(path.join(historyDir, file), 'utf-8');
    const lines = content.split('\n').filter((l) => l.startsWith('- '));
    entries.push(...lines);
  }

  if (entries.length === 0) return;

  // Sort by timestamp (entries start with "- YYYY-MM-DD HH:MM:SS")
  entries.sort().reverse();
  const recent = entries.slice(0, 10);

  console.log('## Recent Activity');
  for (const entry of recent) {
    console.log(entry);
  }
  console.log('');
}

/** Creates the `specforge status` command */
export function createStatusCommand(): Command {
  const cmd = new Command('status');

  cmd
    .description('Show current project state and task progress')
    .action(() => {
      runStatus(process.cwd());
    });

  return cmd;
}
