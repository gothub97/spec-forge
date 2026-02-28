# Skill: /forge.status

> Give a clear overview of project progress.

## When to Use

- To check overall project status
- To find blocked tasks
- To see recent activity
- At the start of a session to get oriented

## Behavior

1. Read `.specforge/forge.yml` for project metadata and feature list
2. Read all task files from `.specforge/tasks/`
3. Read recent history from `.specforge/history/`
4. Aggregate and display

## Report Format

```
# SpecForge Status — {Project Name}

## Overall Progress
{total tasks done} / {total tasks} ({percentage}%)
████████░░░░░░░░ 50%

## Features
| Feature | Status | Progress | Blocked |
|---------|--------|----------|---------|
| 001-user-auth | in_progress | 3/8 (37%) | 0 |
| 002-dashboard | draft | — | — |

## Blocked Tasks
- 001-auth-T05: "Add OAuth provider" — blocked by: 001-auth-T03
  Reason: Login endpoint not yet implemented

## Recent Activity (last 10)
- 2026-02-28 14:30 — 001-auth-T02 marked done
- 2026-02-28 14:15 — 001-auth-T02 started
- 2026-02-28 13:00 — 001-auth-T01 marked done
```

## Details

### Per-Feature Status
For each feature, show:
- Feature name and current status (draft/specified/planned/in_progress/review/done)
- Task progress (done/total)
- Number of blocked tasks
- Link to spec, plan, and task files

### Blocked Task Details
For each blocked task, show:
- Task ID and title
- What it's blocked by (dependency task IDs)
- Blocked reason (if set by implement skill)

### Recent Activity
- Read from `.specforge/history/` files
- Show the last 10 logged actions
- Include timestamp, task ID, and action description

## Output

Display the status report directly to the user. No files are written.
