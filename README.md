# 🔨 SpecForge

**Spec-Driven Development, built for Claude Code.**

SpecForge is an open-source toolkit that brings structured, specification-driven development to Claude Code. Unlike generic spec tools, SpecForge is designed from the ground up to leverage Claude Code's native capabilities — skills, CLAUDE.md, hooks, and MCP.

## Why SpecForge?

AI coding agents are powerful, but without structure they produce inconsistent, context-poor code. Existing tools like GitHub's Spec Kit solve part of this problem, but they're agent-agnostic — meaning they can't leverage what makes Claude Code uniquely capable.

SpecForge fixes that with two integrated layers:

| Layer | What | For whom |
|-------|------|----------|
| **SpecForge CLI + Skills** | Claude Code native spec-driven workflow | Developers using Claude Code |
| **SpecForge VS Code Extension** | Visual PM dashboard over specs and tasks | PMs, tech leads, and developers |

Both layers share the same spec artifacts — Claude Code produces them, the extension visualizes them.

## Core Concepts

- **Constitution** — A living governance document that defines your project's philosophy, quality standards, UX principles, architecture decisions, and team rules. It feeds directly into CLAUDE.md.
- **Specifications** — Structured requirement documents that describe *what* and *why*, not *how*.
- **Plans** — Technical architecture and implementation strategy derived from specs.
- **Tasks** — Actionable, trackable units of work generated from plans.
- **Forge Cycles** — Iterative implement → validate → refine loops that Claude Code executes autonomously.

## Quick Start

```bash
# Install SpecForge globally
npm install -g specforge

# Initialize in your project
specforge init

# Launch Claude Code — SpecForge skills are automatically available
claude
```

## Documentation

- [Full Specification](./docs/SPEC.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Constitution Guide](./docs/CONSTITUTION.md)
- [VS Code Extension](./docs/EXTENSION.md)
- [Contributing](./CONTRIBUTING.md)

## License

MIT