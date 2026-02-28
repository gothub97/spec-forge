import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** List of all skill file names */
export const SKILL_FILES = [
  'constitution.md',
  'specify.md',
  'clarify.md',
  'plan.md',
  'tasks.md',
  'implement.md',
  'review.md',
  'status.md',
];

/** Absolute path to the skills directory */
export const SKILLS_DIR = __dirname;

/** Resolves the absolute path to a skill file */
export function skillPath(filename) {
  return join(__dirname, filename);
}
