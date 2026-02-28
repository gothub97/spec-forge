# Skill: /forge.constitution

> Create or update the project constitution.

## When to Use

- At project start, to define governance and principles
- When adding new architectural rules or quality standards
- When amending existing policies

## Behavior

### If No Constitution Exists

Guide the user through defining each section:

1. **Project Identity** — What is this project? Who is it for? How do we measure success?
2. **Quality Standards** — Testing requirements, coverage thresholds, code review rules, performance budgets
3. **UX Principles** — Design system, accessibility requirements, responsiveness
4. **Architecture** — Tech stack, patterns to follow, anti-patterns to avoid, dependency policy
5. **Team Rules** — Branch strategy, commit conventions, documentation requirements
6. **AI Guardrails** — What you (Claude Code) can do autonomously, what needs approval, what is forbidden

Ask focused questions for each section. Don't overwhelm — start with the essentials and note that sections can be amended later.

Write the result to `.specforge/constitution.md`.

### If Constitution Exists

1. Read the existing constitution at `.specforge/constitution.md`
2. Ask the user which section they want to amend
3. Show the current content of that section
4. Apply the targeted amendment — never rewrite the entire document
5. Log the change in `.specforge/history/decisions.md` with:
   - Date
   - Section changed
   - What changed and why

### After Any Change

1. Update `constitution.last_updated` and `constitution.hash` in `.specforge/forge.yml`
2. If `settings.auto_sync_claude_md` is true, update the `## SpecForge` section in CLAUDE.md with a summary of key principles

## Output

- `.specforge/constitution.md`
- `.specforge/forge.yml` (updated)
- `.specforge/history/decisions.md` (appended)
- `CLAUDE.md` (SpecForge section updated, if auto-sync enabled)

## Constitution Schema

```markdown
# Constitution — {Project Name}

## Project Identity
- **Mission:** {one-line mission statement}
- **Target Users:** {who this is for}
- **Success Metrics:** {how we measure success}

## Quality Standards
- **Testing:** {unit, integration, e2e requirements}
- **Coverage:** {minimum thresholds}
- **Code Review:** {rules and expectations}
- **Performance:** {budgets and benchmarks}

## UX Principles
- **Design System:** {framework, component library}
- **Accessibility:** {WCAG level, requirements}
- **Responsiveness:** {breakpoints, mobile-first?}

## Architecture
- **Stack:** {languages, frameworks, databases}
- **Patterns:** {architecture patterns to follow}
- **Anti-Patterns:** {explicitly forbidden approaches}
- **Dependencies:** {policy on third-party deps}

## Team Rules
- **Branching:** {strategy}
- **Commits:** {convention}
- **Documentation:** {what must be documented}

## AI Guardrails
- **Autonomous Actions:** {what Claude can do without asking}
- **Approval Required:** {what needs human sign-off}
- **Forbidden Actions:** {what Claude must never do}
```
