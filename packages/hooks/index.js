import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** List of all hook file names */
export const HOOK_FILES = ['pre-edit.js', 'post-edit.js'];

/** Absolute path to the hooks directory */
export const HOOKS_DIR = __dirname;

/** Resolves the absolute path to a hook file */
export function hookPath(filename) {
  return join(__dirname, filename);
}
