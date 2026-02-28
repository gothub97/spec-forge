# Skill: /forge.review

> Review completed work against specs and constitution.

## When to Use

- After all tasks for a feature are done
- When the user wants to verify a feature meets its spec
- Periodically during implementation to check progress

## Behavior

1. Read the spec from `.specforge/specs/`
2. Read the plan from `.specforge/plans/`
3. Read the task list from `.specforge/tasks/`
4. Read the constitution from `.specforge/constitution.md`

## Review Checklist

### Acceptance Criteria Verification
For each acceptance criterion in the spec:
- Examine the relevant code and tests
- Determine if the criterion is met
- Mark as one of:
  - **Met** — Criterion is fully satisfied with evidence
  - **Partial** — Partially implemented, needs attention
  - **Not Met** — Missing or incorrect implementation

### Constitution Compliance
Check against each constitution section:
- **Architecture** — Are patterns followed? Any anti-patterns used?
- **Quality Standards** — Are tests written? Does coverage meet thresholds?
- **Team Rules** — Are commit conventions followed? Is documentation present?
- **AI Guardrails** — Were any forbidden actions taken?

### Code Quality
- Are there obvious bugs or edge cases not handled?
- Is error handling adequate?
- Are there security concerns?
- Is the code consistent with existing project patterns?

## Report Format

```markdown
# Review — NNN-feature-name

## Acceptance Criteria
- [x] Criterion 1 — Met. Verified by test in `test/auth.test.ts`
- [~] Criterion 2 — Partial. Login works but error messages are generic
- [ ] Criterion 3 — Not met. No rate limiting implemented

## Constitution Compliance
- Architecture: PASS — Server components used, no anti-patterns
- Quality: WARNING — Missing integration tests for error paths
- Team Rules: PASS — Conventional commits used

## Issues Found
1. [PARTIAL] Generic error messages on login failure
   - Spec requires: "User sees specific error for invalid email vs wrong password"
   - Current: Returns generic "Invalid credentials"
   - Suggested fix: Differentiate error types in AuthService

2. [MISSING] Rate limiting on login endpoint
   - Spec requires: "Lock account after 5 failed attempts"
   - Suggested task: Add rate limiting middleware

## Corrective Tasks
(Auto-generated tasks to address issues found)
```

## After Review

1. Save report to `.specforge/history/NNN-slug.review.md`
2. If issues found, generate corrective tasks and append to `.specforge/tasks/NNN-slug.yml`
3. If all criteria met, update feature status to `done` in `.specforge/forge.yml`
4. If issues found, keep status as `in_progress`

## Output

- `.specforge/history/NNN-slug.review.md`
- `.specforge/tasks/NNN-slug.yml` (corrective tasks added, if needed)
- `.specforge/forge.yml` (status updated)
