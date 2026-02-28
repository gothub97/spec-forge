import path from 'node:path';

/** Root directory name for all SpecForge artifacts */
export const SPECFORGE_DIR = '.specforge';

/** Subdirectories created inside .specforge/ */
export const SPECFORGE_SUBDIRS = [
  'specs',
  'plans',
  'tasks',
  'history',
  'templates',
  'skills',
  'hooks',
] as const;

/** Resolves the .specforge directory path from a project root */
export function specforgeDir(projectRoot: string): string {
  return path.join(projectRoot, SPECFORGE_DIR);
}

/** Resolves a path inside .specforge/ */
export function specforgePath(projectRoot: string, ...segments: string[]): string {
  return path.join(projectRoot, SPECFORGE_DIR, ...segments);
}
