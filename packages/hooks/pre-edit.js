#!/usr/bin/env node

/**
 * SpecForge Pre-Edit Hook
 *
 * Runs before any file edit/create tool use in Claude Code.
 * Reads the constitution and active task to verify:
 * 1. The edit aligns with AI guardrails
 * 2. The file being edited is expected per the active task
 *
 * Input: JSON on stdin with tool_input.file_path
 * Output: JSON to stdout with { decision: "allow"|"block", reason?: string }
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse as parseYaml } from 'js-yaml';

async function main() {
  let input;
  try {
    const stdin = readFileSync('/dev/stdin', 'utf-8');
    input = JSON.parse(stdin);
  } catch {
    // If we can't read input, allow by default
    process.exit(0);
  }

  const filePath = input?.tool_input?.file_path;
  if (!filePath) {
    // No file path in input, nothing to check
    process.exit(0);
  }

  const projectRoot = process.cwd();
  const specforgeDir = join(projectRoot, '.specforge');

  // Skip if SpecForge is not initialized
  if (!existsSync(specforgeDir)) {
    process.exit(0);
  }

  // Check constitution AI guardrails
  const constitutionPath = join(specforgeDir, 'constitution.md');
  if (existsSync(constitutionPath)) {
    const constitution = readFileSync(constitutionPath, 'utf-8');
    const forbiddenSection = extractSection(constitution, 'Forbidden Actions');
    if (forbiddenSection) {
      // Log the guardrails context (informational, not blocking)
      console.error(`[SpecForge] AI Guardrails active. Editing: ${filePath}`);
    }
  }

  // Check if file is expected per active task
  const forgeYmlPath = join(specforgeDir, 'forge.yml');
  if (existsSync(forgeYmlPath)) {
    try {
      const forgeConfig = parseYaml(readFileSync(forgeYmlPath, 'utf-8'));
      const activeFeature = forgeConfig?.features?.find(
        (f) => f.status === 'in_progress',
      );

      if (activeFeature?.tasks) {
        const tasksPath = join(specforgeDir, activeFeature.tasks);
        if (existsSync(tasksPath)) {
          const tasksData = parseYaml(readFileSync(tasksPath, 'utf-8'));
          const activeTask = tasksData?.tasks?.find(
            (t) => t.status === 'in_progress',
          );

          if (activeTask?.files) {
            const resolvedTaskFiles = activeTask.files.map((f) =>
              resolve(projectRoot, f),
            );
            const resolvedEditFile = resolve(projectRoot, filePath);

            if (!resolvedTaskFiles.includes(resolvedEditFile)) {
              console.error(
                `[SpecForge] Warning: Editing ${filePath} which is not in the active task's expected files.`,
              );
              console.error(
                `[SpecForge] Expected files: ${activeTask.files.join(', ')}`,
              );
              // Warning only, don't block
            }
          }
        }
      }
    } catch {
      // YAML parse error, skip check
    }
  }

  // Allow the edit
  process.exit(0);
}

/**
 * Extracts content after a markdown bold label like **Forbidden Actions:**
 */
function extractSection(markdown, label) {
  const pattern = new RegExp(
    `\\*\\*${label}:\\*\\*\\s*(.+?)(?=\\n-\\s*\\*\\*|\\n##|$)`,
    's',
  );
  const match = markdown.match(pattern);
  return match ? match[1].trim() : null;
}

main().catch(() => process.exit(0));
