import fs from 'node:fs';
import yaml from 'js-yaml';

import { specforgePath } from './paths.js';

/** Feature entry in forge.yml */
export interface ForgeFeature {
  id: string;
  slug: string;
  spec: string;
  plan: string | null;
  tasks: string | null;
  status: 'draft' | 'specified' | 'planned' | 'in_progress' | 'review' | 'done';
  created: string;
}

/** Settings in forge.yml */
export interface ForgeSettings {
  auto_sync_claude_md: boolean;
  forge_max_retries: number;
  require_clarify_before_plan: boolean;
  require_plan_before_tasks: boolean;
}

/** Top-level forge.yml schema */
export interface ForgeConfig {
  version: string;
  project: {
    name: string;
    initialized: string;
  };
  constitution: {
    path: string;
    last_updated: string;
    hash: string;
  };
  features: ForgeFeature[];
  settings: ForgeSettings;
}

/** Creates a default forge.yml config for a new project */
export function createDefaultConfig(projectName: string): ForgeConfig {
  const now = new Date().toISOString();
  return {
    version: '0.1.0',
    project: {
      name: projectName,
      initialized: now,
    },
    constitution: {
      path: 'constitution.md',
      last_updated: now,
      hash: '',
    },
    features: [],
    settings: {
      auto_sync_claude_md: true,
      forge_max_retries: 3,
      require_clarify_before_plan: true,
      require_plan_before_tasks: true,
    },
  };
}

/** Writes forge.yml to disk */
export function writeForgeConfig(projectRoot: string, config: ForgeConfig): void {
  const filePath = specforgePath(projectRoot, 'forge.yml');
  const content = yaml.dump(config, { lineWidth: -1, noRefs: true });
  fs.writeFileSync(filePath, content, 'utf-8');
}

/** Reads forge.yml from disk, returns null if not found */
export function readForgeConfig(projectRoot: string): ForgeConfig | null {
  const filePath = specforgePath(projectRoot, 'forge.yml');
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  return yaml.load(content) as ForgeConfig;
}
