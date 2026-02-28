# Skill: /forge.implement

> Execute tasks according to the plan, governed by the constitution.

## When to Use

- After tasks are generated
- When ready to write code for a feature

## Prerequisites

- Tasks must exist for this feature (`.specforge/tasks/NNN-slug.yml`)

## Behavior

1. Read the constitution, spec, plan, and task list
2. Identify the next task(s) to work on:
   - Status is `pending`
   - All `depends_on` tasks are `done`
   - Prefer tasks in ID order
3. For each task, run a **Forge Cycle**

## Forge Cycle

For each task:

### 1. Build
- Read the task description and acceptance criteria carefully
- Read the plan section referenced by `plan_ref`
- Write the code according to the task description
- Only modify files listed in the task's `files` array (unless new files are clearly needed)

### 2. Validate
- Run relevant tests (if they exist)
- Run linter on changed files
- Run type checker
- Check for constitution violations:
  - Anti-patterns from Architecture section
  - Quality standards (testing, coverage)
  - AI guardrails (staying within autonomous scope)

### 3. Verify
- Check each acceptance criterion for the task
- Confirm the change doesn't break existing functionality

### 4. Update
- Mark the task status as `done` in `.specforge/tasks/NNN-slug.yml`
- Update progress counters
- Log the action in `.specforge/history/NNN-slug.log.md`

## Error Handling

- If validation fails, attempt self-correction (up to `forge_max_retries` from forge.yml, default 3)
- If still failing after retries, mark the task as `blocked` with error details:
  ```yaml
  status: "blocked"
  blocked_reason: "TypeScript compilation error in auth.service.ts: ..."
  ```
- Move on to the next unblocked task

## After All Tasks

Generate a summary:
- Tasks completed
- Tasks blocked (with reasons)
- Tasks remaining
- Suggest running `/forge.review` if all tasks are done

## Output

- Modified source code files
- `.specforge/tasks/NNN-slug.yml` (task statuses updated)
- `.specforge/history/NNN-slug.log.md` (actions logged)
