import fs from 'node:fs';
import path from 'node:path';

const SPECFORGE_SECTION_START = '## SpecForge';
const SPECFORGE_SECTION_MARKER = '<!-- specforge:start -->';
const SPECFORGE_SECTION_END = '<!-- specforge:end -->';

/** Generates the SpecForge section content for CLAUDE.md */
export function generateSpecForgeSection(constitutionSummary: string): string {
  const lines = [
    SPECFORGE_SECTION_MARKER,
    SPECFORGE_SECTION_START,
    '',
    '### Constitution Summary',
    constitutionSummary,
    '',
    '### Active Context',
    '- Currently working on: (none)',
    '- Active spec: (none)',
    '- Active plan: (none)',
    '- Next task: (none)',
    '',
    '### Skills',
    '- Constitution: .specforge/skills/constitution.md',
    '- Specify: .specforge/skills/specify.md',
    '- Clarify: .specforge/skills/clarify.md',
    '- Plan: .specforge/skills/plan.md',
    '- Tasks: .specforge/skills/tasks.md',
    '- Implement: .specforge/skills/implement.md',
    '- Review: .specforge/skills/review.md',
    '- Status: .specforge/skills/status.md',
    '',
    '### Hooks',
    '- PreToolUse: Constitution guard, task alignment check',
    '- PostToolUse: Progress update, history log',
    SPECFORGE_SECTION_END,
  ];

  return lines.join('\n');
}

/** Extracts a brief summary from the constitution file */
export function extractConstitutionSummary(constitutionPath: string): string {
  if (!fs.existsSync(constitutionPath)) {
    return '(No constitution defined yet — run /forge.constitution)';
  }

  const content = fs.readFileSync(constitutionPath, 'utf-8');
  const lines: string[] = [];

  // Extract Mission
  const missionMatch = content.match(/\*\*Mission:\*\*\s*(.+)/);
  if (missionMatch && !missionMatch[1].includes('{')) {
    lines.push(`- Mission: ${missionMatch[1].trim()}`);
  }

  // Extract Stack
  const stackMatch = content.match(/\*\*Stack:\*\*\s*(.+)/);
  if (stackMatch && !stackMatch[1].includes('{')) {
    lines.push(`- Stack: ${stackMatch[1].trim()}`);
  }

  // Extract Anti-Patterns
  const antiMatch = content.match(/\*\*Anti-Patterns:\*\*\s*(.+)/);
  if (antiMatch && !antiMatch[1].includes('{')) {
    lines.push(`- Anti-Patterns: ${antiMatch[1].trim()}`);
  }

  // Extract Testing
  const testMatch = content.match(/\*\*Testing:\*\*\s*(.+)/);
  if (testMatch && !testMatch[1].includes('{')) {
    lines.push(`- Testing: ${testMatch[1].trim()}`);
  }

  if (lines.length === 0) {
    return '(Constitution has template placeholders — run /forge.constitution to fill them in)';
  }

  return lines.join('\n');
}

/** Updates or creates CLAUDE.md with the SpecForge section */
export function updateClaudeMd(projectRoot: string, constitutionPath: string): void {
  const claudeMdPath = path.join(projectRoot, 'CLAUDE.md');
  const summary = extractConstitutionSummary(constitutionPath);
  const section = generateSpecForgeSection(summary);

  if (!fs.existsSync(claudeMdPath)) {
    // Create new CLAUDE.md
    fs.writeFileSync(claudeMdPath, section + '\n', 'utf-8');
    return;
  }

  let content = fs.readFileSync(claudeMdPath, 'utf-8');

  // Check for existing SpecForge section with markers
  const startIdx = content.indexOf(SPECFORGE_SECTION_MARKER);
  const endIdx = content.indexOf(SPECFORGE_SECTION_END);

  if (startIdx !== -1 && endIdx !== -1) {
    // Replace existing section
    const before = content.substring(0, startIdx);
    const after = content.substring(endIdx + SPECFORGE_SECTION_END.length);
    content = before + section + after;
  } else {
    // Append section
    content = content.trimEnd() + '\n\n' + section + '\n';
  }

  fs.writeFileSync(claudeMdPath, content, 'utf-8');
}
