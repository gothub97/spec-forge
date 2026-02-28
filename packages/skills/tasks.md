# Skill: /forge.tasks

> Generate an actionable, trackable task list from a plan.

## When to Use

- After a plan is written
- When ready to break a feature into implementable units

## Prerequisites

- A plan must exist for this feature
- If `require_plan_before_tasks` is true in `forge.yml`, the feature must have status `planned`

## Behavior

1. Read the plan from `.specforge/plans/`
2. Read the spec from `.specforge/specs/` for acceptance criteria
3. Read the constitution for quality standards
4. Break the plan into atomic, implementable tasks
5. Define dependencies between tasks
6. Suggest an execution order respecting dependencies

## Task Design Principles

- **Atomic** — Each task produces a verifiable, working increment
- **Ordered** — Dependencies are explicit and form a valid DAG
- **Testable** — Each task has clear acceptance criteria
- **Traceable** — Every task links back to spec and plan sections

## Task Schema (YAML)

```yaml
feature: "NNN-slug"
spec: "specs/NNN-slug.md"
plan: "plans/NNN-slug.md"
created: "ISO-8601"
updated: "ISO-8601"
status: "pending"
progress:
  total: N
  done: 0
  in_progress: 0
  pending: N
  blocked: 0

tasks:
  - id: "NNN-slug-T01"
    title: "Short description"
    description: |
      Detailed instructions for implementation.
      Include specific files, functions, and patterns to use.
    status: "pending"
    depends_on: []
    estimated_effort: "s"    # xs | s | m | l | xl
    acceptance_criteria:
      - "Criterion 1"
      - "Criterion 2"
    files:
      - "path/to/file.ts"
    spec_ref: "specs/NNN-slug.md#section"
    plan_ref: "plans/NNN-slug.md#section"
```

## Effort Guidelines

- **xs** — Trivial change, <15 min (rename, config change, simple fix)
- **s** — Small, focused change, <1 hour (add a function, write a test)
- **m** — Moderate, 1-3 hours (new module, API endpoint, component)
- **l** — Large, 3-8 hours (significant feature piece, complex logic)
- **xl** — Very large, 1-2 days (should probably be split further)

## After Writing

1. Save to `.specforge/tasks/NNN-{slug}.yml`
2. Update the feature entry in `.specforge/forge.yml`:
   - Set `tasks` path
   - Set status to `in_progress`
3. Report the task count, effort breakdown, and suggested execution order

## Output

- `.specforge/tasks/NNN-feature-name.yml`
- `.specforge/forge.yml` (updated)
