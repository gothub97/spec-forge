# SpecForge — Constitution Guide

## What is a Constitution?

The constitution is the single source of truth for how your project should be built. It governs every decision Claude Code makes — from architecture choices to code style to what it's allowed to do autonomously.

Think of it as the combination of:
- A tech lead's opinions, written down
- A style guide
- An architecture decision record
- An AI policy document

## Why It Matters

Without a constitution, Claude Code makes reasonable but inconsistent decisions. With one, every forge cycle produces code that feels like it came from the same developer. The constitution is auto-synced to CLAUDE.md, so Claude Code reads it at the start of every session.

## Writing a Good Constitution

### Start Small, Grow Intentionally

You don't need to fill every section on day one. A good starting constitution might be:

```markdown
# Constitution — My App

## Project Identity
- **Mission:** A task management app for small teams
- **Target Users:** Teams of 2-10 people

## Architecture
- **Stack:** Next.js 15, TypeScript, Prisma, PostgreSQL
- **Patterns:** Server components by default, client components only when needed
- **Anti-Patterns:** No `any` types. No barrel exports. No default exports.

## Quality Standards
- **Testing:** Every API route has integration tests. UI components have snapshot tests.
- **Coverage:** Minimum 70% line coverage

## AI Guardrails
- **Autonomous:** Create files, run tests, fix lint errors
- **Approval Required:** Delete files, change database schema, add dependencies
- **Forbidden:** Push to git, deploy, modify CI/CD config
```

That's enough to start. Add sections as you encounter decisions that should be codified.

### Be Specific, Not Aspirational

Bad: "We value clean code."
Good: "Functions must be under 40 lines. If a function exceeds 40 lines, extract helper functions."

Bad: "Performance matters."
Good: "No page should take more than 200ms to server-render. Bundle size must stay under 150KB gzipped."

### The AI Guardrails Section is Critical

This section defines Claude Code's autonomy boundary. Be explicit:

- **Autonomous Actions:** Things Claude can do in a forge cycle without stopping to ask. Example: creating new files, running tests, fixing lint errors, updating task status.
- **Approval Required:** Things Claude should propose but wait for confirmation. Example: adding new dependencies, changing the database schema, modifying shared interfaces.
- **Forbidden Actions:** Hard stops. Example: never push to git, never modify deployment config, never delete migration files.

### Amend, Don't Rewrite

The constitution should evolve through amendments, not rewrites. Each change is logged in `history/decisions.md` with context for why the change was made. This creates an Architecture Decision Record (ADR) naturally.

## Constitution Template

The default template is installed by `specforge init` at `.specforge/templates/constitution.md`. Customize it for your team.

## Syncing to CLAUDE.md

When you update the constitution, SpecForge automatically updates the `## SpecForge` section in CLAUDE.md with a summary. This ensures Claude Code always has the latest governance context without needing to read the full document on every turn.

You can trigger a manual sync with:

```bash
specforge sync
```