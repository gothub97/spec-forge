# CLAUDE.md — SpecForge

## What is this project?

SpecForge is a spec-driven development toolkit built exclusively for Claude Code. You are building it. Read the full specification before writing any code.

## Required Reading (in this order)

1. `docs/SPEC.md` — **Read this first. This is the complete specification for what you are building.**
2. `docs/ARCHITECTURE.md` — Technical decisions and design principles
3. `docs/CONSTITUTION.md` — Guide for the constitution feature
4. `docs/EXTENSION.md` — VS Code extension specification

## Project Constitution

### Mission
Build an open-source, Claude Code-native spec-driven development toolkit with a CLI, skill system, and VS Code extension.

### Tech Stack
- **Monorepo:** npm workspaces + Turborepo
- **Language:** TypeScript (strict mode)
- **CLI:** Node.js >= 18, `commander` for CLI framework
- **YAML:** `js-yaml`
- **VS Code Extension:** VS Code Extension API + React 18 + Tailwind CSS + esbuild
- **Testing:** Vitest for unit/integration tests
- **Linting:** ESLint + Prettier

### Code Quality Rules
- TypeScript strict mode — no `any` types
- Every public function has JSDoc comments
- Every CLI command has unit tests
- Meaningful variable names — no abbreviations
- Files under 300 lines — extract when larger
- Imports sorted: node builtins → external → internal → relative

### Architecture Rules
- Files are the database — all state lives in `.specforge/` as YAML and Markdown
- No network calls — everything is offline
- Skills are Markdown files, not code
- Hooks are lightweight JS scripts
- The VS Code extension reads files directly — no server

### Git Conventions
- Branch: `feat/description`, `fix/description`, `docs/description`
- Commits: conventional commits (`feat:`, `fix:`, `docs:`, `chore:`)
- Small, focused commits — one logical change per commit

### AI Guardrails (for you, Claude Code)
- **Autonomous:** Create files, write code, run tests, fix lint errors, update package.json
- **Ask before:** Adding new dependencies, changing the monorepo structure, deviating from the spec
- **Never:** Push to git, publish to npm, modify this CLAUDE.md without asking

## Current Milestone

### v0.1.0 — Foundation (START HERE)

Build in this order:

1. **Monorepo scaffolding** — Root `package.json`, `turbo.json`, workspace structure
2. **`packages/cli`** — Basic CLI with `specforge init` command
3. **`packages/skills`** — Write all 8 skill Markdown files
4. **`packages/hooks`** — Pre-edit and post-edit hook scripts
5. **Wire `specforge init`** — It should create `.specforge/`, copy skills, generate constitution template, create/update CLAUDE.md
6. **`specforge status`** — Read `forge.yml` and display project state
7. **`specforge sync`** — Re-sync CLAUDE.md from constitution
8. **`specforge validate`** — Lint all `.specforge/` artifacts

## Repo Structure

```
specforge/
├── packages/
│   ├── cli/                    # specforge CLI (start here)
│   │   ├── src/
│   │   │   ├── commands/       # init, status, sync, validate, export
│   │   │   ├── lib/            # core logic (file generation, parsing, sync)
│   │   │   └── index.ts        # CLI entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── skills/                 # Claude Code skill files (.md)
│   │   ├── constitution.md
│   │   ├── specify.md
│   │   ├── clarify.md
│   │   ├── plan.md
│   │   ├── tasks.md
│   │   ├── implement.md
│   │   ├── review.md
│   │   └── status.md
│   ├── hooks/                  # Claude Code hooks (.js)
│   │   ├── pre-edit.js
│   │   └── post-edit.js
│   └── vscode/                 # VS Code extension (v0.3.0 — not yet)
├── templates/                  # Default templates shipped with CLI
│   ├── constitution.md
│   ├── spec.md
│   └── plan.md
├── docs/                       # Specifications (already written)
│   ├── SPEC.md
│   ├── ARCHITECTURE.md
│   ├── CONSTITUTION.md
│   └── EXTENSION.md
├── package.json                # Monorepo root
├── turbo.json
├── tsconfig.base.json
├── CLAUDE.md                   # This file
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## How to Work

When I ask you to build something:

1. **Read the spec first** — Always re-read the relevant section of `docs/SPEC.md` before coding
2. **Build incrementally** — One command/feature at a time, test before moving on
3. **Follow the milestone order** — Don't skip ahead
4. **Run tests** — After every meaningful change
5. **Commit logically** — Small, focused commits with conventional commit messages