import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

import { specforgePath } from './paths.js';

const require = createRequire(import.meta.url);

/** All skill file names */
const SKILL_FILES = [
  'constitution.md',
  'specify.md',
  'clarify.md',
  'plan.md',
  'tasks.md',
  'implement.md',
  'review.md',
  'status.md',
];

/** Resolves the source directory of @specforge/skills */
function getSkillsSourceDir(): string {
  const skillsPkg = require.resolve('@specforge/skills/package.json');
  return path.dirname(skillsPkg);
}

/** Copies all skill files to .specforge/skills/ */
export function installSkills(projectRoot: string): void {
  const sourceDir = getSkillsSourceDir();
  const targetDir = specforgePath(projectRoot, 'skills');

  fs.mkdirSync(targetDir, { recursive: true });

  for (const file of SKILL_FILES) {
    const src = path.join(sourceDir, file);
    const dest = path.join(targetDir, file);
    fs.copyFileSync(src, dest);
  }
}

/** Returns the list of skill names (without .md extension) */
export function getSkillNames(): string[] {
  return SKILL_FILES.map((f) => f.replace('.md', ''));
}
