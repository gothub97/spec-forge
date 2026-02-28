# SpecForge — Architecture

## Design Principles

1. **Files are the database.** All state lives in `.specforge/` as human-readable YAML and Markdown. No SQLite, no binary formats. This means Claude Code can read and write state natively, and Git tracks every change.

2. **Skills over prompts.** Instead of injecting prompts at runtime (like Spec Kit), SpecForge uses skill files that Claude Code reads on demand. This leverages Claude Code's built-in skill system and keeps instructions versioned alongside the project.

3. **Hooks enforce the constitution.** Rather than hoping Claude follows the rules, hooks actively verify compliance on every file edit. The constitution is not advisory — it's enforced.

4. **The extension is read-heavy, write-light.** The VS Code extension primarily reads `.specforge/` artifacts. Writes are limited to task status updates (drag-and-drop) and settings. Claude Code does the heavy lifting.

5. **Monorepo, independent packages.** CLI, skills, hooks, and the extension are separate packages. You can use the CLI + skills without the extension, and vice versa.

---

## Data Flow

```
User describes feature
        │
        ▼
Claude Code reads skill → reads constitution → generates artifact
        │
        ▼
Artifact written to .specforge/ (YAML or MD)
        │
        ├──► Git tracks the change
        ├──► CLAUDE.md auto-updated (if active context changed)
        ├──► VS Code extension detects change via FileSystemWatcher
        │         │
        │         ▼
        │    Views re-render (Tree, Kanban, Timeline)
        │
        ▼
Hooks run on file edits during implementation
        │
        ├──► PreToolUse: validates against constitution + task scope
        └──► PostToolUse: runs lint, updates task status, logs history
```

---

## Key Technical Decisions

### Why YAML for tasks (not Markdown)?

Markdown is great for human-authored prose (specs, plans, constitution). But tasks need to be machine-readable for the VS Code extension — parsing status, dependencies, effort, and progress from Markdown is fragile. YAML provides a clean schema with native support in both Node.js and VS Code webviews.

### Why not an MCP server for the extension?

The extension reads files directly because:
- No process to manage — just a file watcher
- Instant updates — no server round-trip
- Works offline
- Simpler architecture

An MCP server will be added later (v0.5.0) for external integrations (GitHub Issues, Linear, etc.), not for the extension itself.

### Why monorepo with Turborepo?

Three packages (CLI, skills/hooks, extension) share types and templates. Turborepo handles build orchestration with caching. Alternatives considered: nx (too heavy), plain workspaces (no build orchestration).

### Why React for webviews (not Svelte/vanilla)?

- Largest ecosystem for drag-and-drop, timeline, and charting libraries
- Most VS Code extension examples use React
- Tailwind integration is straightforward
- Team familiarity (assumption for open source contributors)

---

## Security Considerations

- **No network calls.** SpecForge CLI and extension are fully offline. No telemetry, no analytics, no external APIs.
- **No secrets in artifacts.** The constitution and specs should never contain secrets. The CLI should warn if it detects patterns like API keys in artifacts.
- **Hook safety.** Hooks execute locally and are version-controlled. They should be reviewed like any other code in the repo.