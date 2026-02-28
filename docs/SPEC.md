# SpecForge — Full Specification

> Version: 0.1.0-draft
> Status: Pre-implementation
> Target: Claude Code (exclusive)

---

## 1. Vision

SpecForge is a spec-driven development toolkit that treats Claude Code as a first-class runtime. It provides a structured workflow from project philosophy to shipped features, while giving PMs and leads a visual dashboard via a VS Code extension.

The core insight: Claude Code has capabilities (skills, hooks, MCP, CLAUDE.md, multi-turn agentic loops) that no other AI coding agent offers in the same way. SpecForge is built to exploit all of them.

### 1.1 What SpecForge Is

- A Claude Code skill system for structured spec-driven development
- A CLI for scaffolding and managing spec artifacts
- A VS Code extension for visualizing and managing specs, plans, and tasks
- An opinionated workflow that enforces quality through constitution-governed development

### 1.2 What SpecForge Is Not

- Not agent-agnostic — it is Claude Code only, by design
- Not a project management replacement — it's a bridge between specs and implementation
- Not a code generator — Claude Code generates the code; SpecForge provides the structure

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   VS Code Extension                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │  Kanban   │  │   Tree   │  │  Timeline / Gantt │  │
│  │  Board    │  │   View   │  │      View         │  │
│  └────┬─────┘  └────┬─────┘  └────────┬──────────┘  │
│       └──────────────┼─────────────────┘             │
│                      │ reads / watches               │
└──────────────────────┼───────────────────────────────┘
                       │
          ┌────────────▼────────────┐
          │   .specforge/ directory  │
          │                         │
          │  constitution.md        │
          │  specs/                 │
          │    ├── 001-feature.md   │
          │    └── 002-feature.md   │
          │  plans/                 │
          │    ├── 001-feature.md   │
          │    └── 002-feature.md   │
          │  tasks/                 │
          │    ├── 001-feature.yml  │
          │    └── 002-feature.yml  │
          │  forge.yml (state)      │
          │  history/               │
          └────────────┬────────────┘
                       │
          ┌────────────▼────────────┐
          │   Claude Code Runtime    │
          │                         │
          │  CLAUDE.md (auto-synced)│
          │  Skills (read on demand)│
          │  Hooks (pre/post tool)  │
          │  MCP (optional servers) │
          └─────────────────────────┘
```

### 2.1 Artifact Directory Structure

All SpecForge artifacts live in `.specforge/` at the project root:

```
.specforge/
├── constitution.md          # Project governance & philosophy
├── forge.yml                # Project state & configuration
├── specs/
│   ├── 001-user-auth.md     # Feature specification
│   └── 002-dashboard.md
├── plans/
│   ├── 001-user-auth.md     # Technical implementation plan
│   └── 002-dashboard.md
├── tasks/
│   ├── 001-user-auth.yml    # Structured task list (YAML)
│   └── 002-dashboard.yml
├── history/
│   ├── 001-user-auth.log.md # Forge cycle log
│   └── decisions.md         # Architecture Decision Records
└── templates/
    ├── spec.md              # Custom spec template
    ├── plan.md              # Custom plan template
    └── constitution.md      # Constitution template
```

---

## 3. Layer 1 — Claude Code Skills & CLI

### 3.1 CLI: `specforge`

The CLI handles scaffolding and artifact management. It is intentionally thin — the intelligence lives in Claude Code skills.

#### Commands

| Command | Description |
|---------|-------------|
| `specforge init` | Initialize `.specforge/` in the current project. Generates templates, updates CLAUDE.md, installs skills and hooks. |
| `specforge status` | Show current state: active specs, task progress, forge cycle status. |
| `specforge sync` | Re-sync CLAUDE.md with constitution and active spec context. |
| `specforge export` | Export specs/tasks to JSON for external tools. |
| `specforge validate` | Lint all artifacts for structural correctness. |

#### `specforge init` — Detailed Behavior

1. Create `.specforge/` directory structure
2. Generate default `constitution.md` from interactive prompts or template
3. Create/update `CLAUDE.md` at project root:
   - Inject constitution summary
   - Register SpecForge skill paths
   - Add hook configurations
4. Install Claude Code skills to `.specforge/skills/`
5. Configure hooks in `.claude/settings.json`
6. Create `forge.yml` with project metadata

### 3.2 Claude Code Skills

Skills are the core of SpecForge. Each skill is a markdown file that Claude Code reads before performing an action. They live in `.specforge/skills/` and are referenced from CLAUDE.md.

#### Skill: `/forge.constitution`

**Purpose:** Create or update the project constitution.

**Behavior:**
1. If no constitution exists, guide the user through defining:
   - **Project Identity** — What is this project? Who is it for?
   - **Quality Standards** — Testing requirements, code review rules, coverage thresholds
   - **UX Principles** — Design system, accessibility requirements, performance budgets
   - **Architecture Decisions** — Tech stack, patterns, constraints, anti-patterns
   - **Team Rules** — Branch strategy, commit conventions, PR process, documentation requirements
   - **AI Guardrails** — What Claude Code should and should NOT do autonomously
2. If constitution exists, allow targeted amendments (never full rewrites)
3. Auto-sync relevant sections to CLAUDE.md
4. Log the change in `history/decisions.md`

**Output:** `.specforge/constitution.md`

**Constitution Schema:**

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

#### Skill: `/forge.specify`

**Purpose:** Create a feature specification.

**Behavior:**
1. Accept a natural language description of the feature (what + why)
2. Read the constitution for constraints and principles
3. Generate a structured spec with:
   - **Overview** — What this feature does and why it matters
   - **User Stories** — As a {role}, I want {action}, so that {benefit}
   - **Acceptance Criteria** — Testable conditions for "done"
   - **Edge Cases** — What could go wrong
   - **Dependencies** — What this feature depends on
   - **Out of Scope** — Explicitly excluded items
   - **Open Questions** — Unresolved decisions (blocks planning)
4. Auto-number the spec (next available `NNN-slug.md`)
5. If open questions exist, prompt the user to resolve them before proceeding

**Output:** `.specforge/specs/NNN-feature-name.md`

#### Skill: `/forge.clarify`

**Purpose:** Challenge and refine an existing spec.

**Behavior:**
1. Read the target spec and the constitution
2. Identify ambiguities, contradictions, missing edge cases, and constitution violations
3. Present findings as numbered questions with suggested answers
4. Update the spec based on user responses
5. Mark the spec as "clarified" in `forge.yml`

#### Skill: `/forge.plan`

**Purpose:** Create a technical implementation plan from a spec.

**Behavior:**
1. Read the spec and constitution
2. Analyze the existing codebase (file structure, patterns, dependencies)
3. Generate a plan with:
   - **Technical Approach** — How this will be built
   - **File Changes** — New files, modified files, deleted files
   - **Data Model** — Schema changes, migrations
   - **API Design** — Endpoints, contracts
   - **Component Breakdown** — UI components (if applicable)
   - **Testing Strategy** — What tests, where, how
   - **Risk Assessment** — What could go wrong technically
   - **Estimated Complexity** — T-shirt size (S/M/L/XL) with justification
4. Cross-reference against constitution architecture rules
5. Flag any deviations from established patterns

**Output:** `.specforge/plans/NNN-feature-name.md`

#### Skill: `/forge.tasks`

**Purpose:** Generate an actionable, trackable task list from a plan.

**Behavior:**
1. Read the plan and constitution
2. Break the plan into atomic, implementable tasks
3. Each task has:
   - `id` — Unique identifier (e.g., `001-auth-T01`)
   - `title` — Short description
   - `description` — Detailed instructions for Claude Code
   - `status` — `pending` | `in_progress` | `done` | `blocked` | `skipped`
   - `depends_on` — List of task IDs this depends on
   - `estimated_effort` — `xs` | `s` | `m` | `l` | `xl`
   - `acceptance_criteria` — How to verify this task is done
   - `files` — Expected files to create/modify
   - `spec_ref` — Link back to the spec section
   - `plan_ref` — Link back to the plan section
4. Output as structured YAML (machine-readable for the extension)
5. Suggest an execution order respecting dependencies

**Output:** `.specforge/tasks/NNN-feature-name.yml`

**Task YAML Schema:**

```yaml
feature: "001-user-auth"
spec: "specs/001-user-auth.md"
plan: "plans/001-user-auth.md"
created: "2026-02-28T12:00:00Z"
updated: "2026-02-28T12:00:00Z"
status: "in_progress"          # overall feature status
progress:
  total: 8
  done: 3
  in_progress: 1
  pending: 4
  blocked: 0

tasks:
  - id: "001-auth-T01"
    title: "Create User model and migration"
    description: |
      Create the User model with fields: id, email, password_hash,
      created_at, updated_at. Add database migration.
    status: "done"
    depends_on: []
    estimated_effort: "s"
    acceptance_criteria:
      - "User model exists with all required fields"
      - "Migration runs successfully"
      - "Model has proper validations"
    files:
      - "src/models/user.ts"
      - "src/migrations/001_create_users.ts"
    spec_ref: "specs/001-user-auth.md#user-stories"
    plan_ref: "plans/001-user-auth.md#data-model"

  - id: "001-auth-T02"
    title: "Implement authentication service"
    description: |
      Create AuthService with login, register, and token refresh methods.
      Use bcrypt for password hashing, JWT for tokens.
    status: "in_progress"
    depends_on: ["001-auth-T01"]
    estimated_effort: "m"
    acceptance_criteria:
      - "Login returns valid JWT on correct credentials"
      - "Register creates user and returns JWT"
      - "Invalid credentials return 401"
      - "Passwords are hashed with bcrypt"
    files:
      - "src/services/auth.service.ts"
      - "src/utils/jwt.ts"
    spec_ref: "specs/001-user-auth.md#acceptance-criteria"
    plan_ref: "plans/001-user-auth.md#technical-approach"
```

#### Skill: `/forge.implement`

**Purpose:** Execute tasks according to the plan, governed by the constitution.

**Behavior:**
1. Read constitution, spec, plan, and task list
2. Identify the next task(s) to work on (respecting dependency order)
3. For each task, run a **Forge Cycle**:
   - **Build** — Write the code according to task description and plan
   - **Validate** — Run relevant tests, linters, type checks
   - **Verify** — Check against acceptance criteria
   - **Update** — Mark task status in YAML, log in history
4. If validation fails, attempt self-correction (up to 3 retries)
5. If still failing, mark task as `blocked` with error details and move on
6. After all tasks, generate a summary report

**Forge Cycle Hooks:**

```
PreToolUse (before any file edit):
  → Read constitution AI Guardrails
  → Check if edit aligns with architecture rules
  → Verify file is expected per task definition

PostToolUse (after any file edit):
  → Run lint on changed file
  → Update task progress in YAML
  → Log action in history
```

#### Skill: `/forge.review`

**Purpose:** Review completed work against specs and constitution.

**Behavior:**
1. Read the spec, plan, and completed task list
2. For each acceptance criterion, verify it is met
3. Check for constitution violations (architecture, testing, quality)
4. Generate a review report with:
   - ✅ Criteria met
   - ⚠️ Partial / needs attention
   - ❌ Not met
5. If issues found, generate corrective tasks automatically

#### Skill: `/forge.status`

**Purpose:** Give a clear overview of project progress.

**Behavior:**
1. Aggregate all task files
2. Show per-feature and total progress
3. Identify blocked tasks and their blockers
4. Show recent history (last 10 actions)

### 3.3 Claude Code Integration Points

#### CLAUDE.md Auto-Sync

SpecForge maintains a `## SpecForge` section in CLAUDE.md that includes:

```markdown
## SpecForge

### Constitution Summary
{auto-generated summary of key principles}

### Active Context
- Currently working on: {feature name}
- Active spec: {path to spec}
- Active plan: {path to plan}
- Next task: {task ID and title}

### Skills
- Constitution: .specforge/skills/constitution.md
- Specify: .specforge/skills/specify.md
- Clarify: .specforge/skills/clarify.md
- Plan: .specforge/skills/plan.md
- Tasks: .specforge/skills/tasks.md
- Implement: .specforge/skills/implement.md
- Review: .specforge/skills/review.md
- Status: .specforge/skills/status.md

### Hooks
- PreToolUse: Constitution guard, task alignment check
- PostToolUse: Lint, progress update, history log
```

#### Hooks Configuration

```json
// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "edit|create",
        "command": "node .specforge/hooks/pre-edit.js"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "edit|create",
        "command": "node .specforge/hooks/post-edit.js"
      }
    ]
  }
}
```

---

## 4. Layer 2 — VS Code Extension

### 4.1 Overview

The VS Code extension reads the `.specforge/` directory and provides three synchronized views for managing specs, plans, and tasks visually.

**Extension ID:** `specforge.specforge-vscode`

### 4.2 Views

#### 4.2.1 Kanban Board

A drag-and-drop board showing tasks by status.

**Columns:** Pending → In Progress → In Review → Done → Blocked

**Cards show:**
- Task title
- Feature label (color-coded)
- Effort badge (xs/s/m/l/xl)
- Dependency indicator (🔗 if has dependencies)
- Assignee (if applicable — future multi-agent support)

**Interactions:**
- Drag task between columns → updates YAML status
- Click task → opens detail panel with description, acceptance criteria, linked files
- Click file link → opens file in editor
- Filter by feature, effort, status

#### 4.2.2 Tree View (Sidebar)

Hierarchical view in the VS Code sidebar:

```
📋 SpecForge
├── 📜 Constitution
├── 📦 Features
│   ├── 001-user-auth
│   │   ├── 📄 Spec (clarified ✅)
│   │   ├── 📐 Plan (approved ✅)
│   │   └── ✅ Tasks (3/8 done)
│   │       ├── ✅ T01 — Create User model
│   │       ├── 🔄 T02 — Auth service
│   │       ├── ⬜ T03 — Login endpoint
│   │       └── ...
│   └── 002-dashboard
│       ├── 📄 Spec (draft)
│       ├── 📐 Plan (not started)
│       └── ⬜ Tasks (not generated)
├── 📊 Progress (37% complete)
└── 📜 History
```

**Interactions:**
- Click any artifact → opens in editor
- Right-click feature → "Open in Kanban", "Run Forge Cycle"
- Status icons update in real-time via file watcher

#### 4.2.3 Timeline / Gantt View

A horizontal timeline showing tasks across features.

**Features:**
- Tasks shown as bars, length proportional to estimated effort
- Dependencies shown as arrows between bars
- Color-coded by feature
- Current date marker
- Critical path highlighting (longest dependency chain)
- Drag to adjust estimates → updates YAML

#### 4.2.4 Dashboard (Webview Panel)

A main dashboard combining key metrics:

- **Progress ring** — overall % complete
- **Feature cards** — quick status per feature
- **Recent activity** — last 10 forge actions from history
- **Blocked items** — tasks needing attention
- **Constitution health** — any recent violations flagged by review

### 4.3 File Watching

The extension uses `vscode.workspace.createFileSystemWatcher` on `.specforge/**` to:

- Auto-refresh all views when YAML/MD files change
- Show notifications on task status changes
- Update badge counts on the SpecForge sidebar icon

### 4.4 Commands

| Command | Palette Name | Description |
|---------|-------------|-------------|
| `specforge.openKanban` | SpecForge: Open Kanban Board | Opens kanban webview |
| `specforge.openTimeline` | SpecForge: Open Timeline | Opens timeline webview |
| `specforge.openDashboard` | SpecForge: Open Dashboard | Opens dashboard webview |
| `specforge.refreshAll` | SpecForge: Refresh Views | Force-refresh all views |
| `specforge.openConstitution` | SpecForge: Open Constitution | Opens constitution.md |
| `specforge.runForge` | SpecForge: Run Forge Cycle | Triggers Claude Code forge.implement |

### 4.5 Tech Stack (Extension)

- **Framework:** VS Code Extension API
- **Webviews:** React + Tailwind (bundled with esbuild)
- **Data layer:** Direct YAML/Markdown file parsing (no database)
- **YAML parsing:** `js-yaml`
- **Markdown parsing:** `marked` or `remark`
- **Kanban:** Custom React component or `@hello-pangea/dnd`
- **Timeline:** Custom SVG-based or `vis-timeline`

---

## 5. Forge State — `forge.yml`

Central state file tracking project-level metadata:

```yaml
version: "0.1.0"
project:
  name: "My Project"
  initialized: "2026-02-28T12:00:00Z"

constitution:
  path: "constitution.md"
  last_updated: "2026-02-28T12:00:00Z"
  hash: "sha256:abc123..."

features:
  - id: "001-user-auth"
    slug: "user-auth"
    spec: "specs/001-user-auth.md"
    plan: "plans/001-user-auth.md"
    tasks: "tasks/001-user-auth.yml"
    status: "in_progress"       # draft | specified | planned | in_progress | review | done
    created: "2026-02-28T12:00:00Z"
  - id: "002-dashboard"
    slug: "dashboard"
    spec: "specs/002-dashboard.md"
    plan: null
    tasks: null
    status: "draft"
    created: "2026-02-28T13:00:00Z"

settings:
  auto_sync_claude_md: true
  forge_max_retries: 3
  require_clarify_before_plan: true
  require_plan_before_tasks: true
```

---

## 6. Workflow

The standard SpecForge workflow is linear but allows iteration:

```
 ┌──────────────┐
 │  /forge.     │
 │  constitution│ ◄──── Define once, amend as needed
 └──────┬───────┘
        ▼
 ┌──────────────┐
 │  /forge.     │
 │  specify     │ ◄──── Per feature
 └──────┬───────┘
        ▼
 ┌──────────────┐
 │  /forge.     │
 │  clarify     │ ◄──── Optional but recommended
 └──────┬───────┘
        ▼
 ┌──────────────┐
 │  /forge.     │
 │  plan        │
 └──────┬───────┘
        ▼
 ┌──────────────┐
 │  /forge.     │
 │  tasks       │
 └──────┬───────┘
        ▼
 ┌──────────────┐     ┌──────────────┐
 │  /forge.     │────►│  /forge.     │
 │  implement   │     │  review      │
 └──────┬───────┘     └──────┬───────┘
        │                     │
        └─────── loop ◄───────┘
```

**Enforcement rules (configurable in forge.yml):**
- Cannot plan without a clarified spec
- Cannot generate tasks without a plan
- Cannot implement without tasks
- Review happens automatically after all tasks complete

---

## 7. Differentiators vs Spec Kit

| Aspect | Spec Kit | SpecForge |
|--------|----------|-----------|
| Agent support | Any (Copilot, Claude, Gemini, Cursor...) | Claude Code only |
| Integration depth | Generic prompts | Skills, hooks, CLAUDE.md, MCP |
| Task tracking | Markdown checklist | Structured YAML with dependencies |
| Visual tooling | None | VS Code extension (Kanban, Tree, Gantt) |
| Constitution | Static markdown | Living doc synced to CLAUDE.md |
| Validation | Manual | Automated hooks (lint, test, criteria check) |
| History | None | Full forge cycle logs + ADRs |
| Iteration | Linear | Forge cycles with auto-retry and self-correction |

---

## 8. Milestones

### v0.1.0 — Foundation
- [ ] CLI: `specforge init`
- [ ] Constitution skill + template
- [ ] Specify skill + template
- [ ] Clarify skill
- [ ] CLAUDE.md auto-sync
- [ ] Basic `forge.yml` state management

### v0.2.0 — Full Workflow
- [ ] Plan skill
- [ ] Tasks skill (YAML output)
- [ ] Implement skill with forge cycles
- [ ] Review skill
- [ ] Status skill
- [ ] Pre/Post hooks

### v0.3.0 — VS Code Extension
- [ ] Tree view (sidebar)
- [ ] Kanban board (webview)
- [ ] File watcher + auto-refresh
- [ ] Task detail panel

### v0.4.0 — Advanced Views
- [ ] Timeline / Gantt view
- [ ] Dashboard with metrics
- [ ] Constitution health check
- [ ] Blocked task alerts

### v0.5.0 — Ecosystem
- [ ] MCP server for external integrations
- [ ] Export to GitHub Issues / Linear / Jira
- [ ] Multi-feature dependency graph
- [ ] Team collaboration features

---

## 9. Tech Stack

### Layer 1 (CLI + Skills)
- **Runtime:** Node.js (>=18)
- **Language:** TypeScript
- **CLI framework:** `commander` or `yargs`
- **YAML:** `js-yaml`
- **Markdown:** Template literals (simple generation)
- **Hashing:** Node `crypto`
- **Publishing:** npm

### Layer 2 (VS Code Extension)
- **Framework:** VS Code Extension API
- **Webview UI:** React 18 + Tailwind CSS
- **Bundler:** esbuild
- **YAML parsing:** `js-yaml`
- **Markdown rendering:** `marked`
- **Drag-and-drop:** `@hello-pangea/dnd`
- **Timeline:** Custom SVG or `vis-timeline`
- **Publishing:** VS Code Marketplace

---

## 10. Repository Structure

```
specforge/
├── packages/
│   ├── cli/                    # specforge CLI
│   │   ├── src/
│   │   │   ├── commands/       # init, status, sync, validate, export
│   │   │   ├── lib/            # core logic
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── skills/                 # Claude Code skill files
│   │   ├── constitution.md
│   │   ├── specify.md
│   │   ├── clarify.md
│   │   ├── plan.md
│   │   ├── tasks.md
│   │   ├── implement.md
│   │   ├── review.md
│   │   └── status.md
│   ├── hooks/                  # Claude Code hooks
│   │   ├── pre-edit.js
│   │   └── post-edit.js
│   └── vscode/                 # VS Code extension
│       ├── src/
│       │   ├── extension.ts    # activation, commands, providers
│       │   ├── providers/      # tree view, webview providers
│       │   ├── parsers/        # YAML/MD parsing
│       │   └── webview/        # React app for kanban, timeline, dashboard
│       │       ├── App.tsx
│       │       ├── views/
│       │       └── components/
│       ├── package.json
│       └── tsconfig.json
├── templates/                  # Default templates shipped with CLI
│   ├── constitution.md
│   ├── spec.md
│   └── plan.md
├── docs/
│   ├── SPEC.md                 # This document
│   ├── ARCHITECTURE.md
│   ├── CONSTITUTION.md         # Guide for writing constitutions
│   └── EXTENSION.md
├── package.json                # Monorepo root (workspaces)
├── turbo.json                  # Turborepo config
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```