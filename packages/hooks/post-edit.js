#!/usr/bin/env node

/**
 * SpecForge Post-Edit Hook
 *
 * Runs after any file edit/create tool use in Claude Code.
 * Performs:
 * 1. Logs the edit action to history
 * 2. Updates task progress if a task is active
 *
 * Input: JSON on stdin with tool_input.file_path
 * Output: none (informational only)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml, dump as dumpYaml } from 'js-yaml';

async function main() {
  let input;
  try {
    const stdin = readFileSync('/dev/stdin', 'utf-8');
    input = JSON.parse(stdin);
  } catch {
    process.exit(0);
  }

  const filePath = input?.tool_input?.file_path;
  if (!filePath) {
    process.exit(0);
  }

  const projectRoot = process.cwd();
  const specforgeDir = join(projectRoot, '.specforge');

  // Skip if SpecForge is not initialized
  if (!existsSync(specforgeDir)) {
    process.exit(0);
  }

  const now = new Date().toISOString();
  const timestamp = now.replace('T', ' ').substring(0, 19);

  // Log to history
  logAction(specforgeDir, timestamp, filePath);

  console.error(`[SpecForge] Logged edit: ${filePath}`);
}

/**
 * Appends an edit action to the active feature's history log,
 * or to a general history log if no feature is active.
 */
function logAction(specforgeDir, timestamp, filePath) {
  const historyDir = join(specforgeDir, 'history');
  if (!existsSync(historyDir)) {
    mkdirSync(historyDir, { recursive: true });
  }

  // Find active feature for targeted logging
  let logFile = join(historyDir, 'activity.log.md');
  const forgeYmlPath = join(specforgeDir, 'forge.yml');

  if (existsSync(forgeYmlPath)) {
    try {
      const forgeConfig = parseYaml(readFileSync(forgeYmlPath, 'utf-8'));
      const activeFeature = forgeConfig?.features?.find(
        (f) => f.status === 'in_progress',
      );

      if (activeFeature) {
        logFile = join(historyDir, `${activeFeature.id}.log.md`);
      }
    } catch {
      // Use default log file
    }
  }

  // Append log entry
  const entry = `- ${timestamp} — Edited \`${filePath}\`\n`;

  if (existsSync(logFile)) {
    const existing = readFileSync(logFile, 'utf-8');
    writeFileSync(logFile, existing + entry, 'utf-8');
  } else {
    const header = `# Forge Activity Log\n\n`;
    writeFileSync(logFile, header + entry, 'utf-8');
  }
}

main().catch(() => process.exit(0));
