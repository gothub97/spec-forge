# SpecForge — VS Code Extension

## Overview

The SpecForge VS Code extension is the visual layer over your `.specforge/` artifacts. It turns structured YAML and Markdown into interactive views that give PMs, tech leads, and developers a real-time picture of project progress — without ever opening a terminal.

## Installation

Search for `SpecForge` in the VS Code Extensions marketplace, or:

```bash
code --install-extension specforge.specforge-vscode
```

## Views

### 1. Tree View (Sidebar)

**Location:** Activity Bar → SpecForge icon

The tree view is always visible and provides quick navigation:

- **Constitution** — Click to open and edit
- **Features** — Expandable list showing spec → plan → tasks hierarchy
  - Status icons: ⬜ pending, 🔄 in progress, ✅ done, 🚫 blocked
  - Progress badges: "3/8 tasks done"
- **Progress** — Aggregate completion percentage
- **History** — Recent forge actions

**Context menu (right-click on feature):**
- Open Spec / Plan / Tasks in editor
- Show in Kanban Board
- Show in Timeline
- Copy feature summary to clipboard

### 2. Kanban Board (Webview Panel)

**Open:** Command Palette → `SpecForge: Open Kanban Board`

A full-width webview with drag-and-drop task management.

**Columns:**
| Column | Maps to status |
|--------|---------------|
| Backlog | `pending` (no dependencies met) |
| Ready | `pending` (all dependencies met) |
| In Progress | `in_progress` |
| Done | `done` |
| Blocked | `blocked` |

**Task Cards:**
```
┌─────────────────────────┐
│ 🏷 001-user-auth        │  ← Feature label (color)
│                         │
│ Create User model and   │  ← Title
│ migration               │
│                         │
│ 🔗 2 deps  ⏱ S         │  ← Dependencies + Effort
│ 📄 2 files              │  ← File count
└─────────────────────────┘
```

**Interactions:**
- **Drag between columns** → updates `status` in YAML file
- **Click card** → opens detail panel:
  - Full description
  - Acceptance criteria (with checkboxes)
  - Linked files (clickable → opens in editor)
  - Dependencies (clickable → highlights dependent cards)
  - Spec/plan references (clickable → opens source)
- **Filter bar** → filter by feature, effort size, or search by title
- **Group by** → feature or effort size

### 3. Timeline / Gantt View (Webview Panel)

**Open:** Command Palette → `SpecForge: Open Timeline`

Horizontal timeline showing all tasks across features.

**Layout:**
- Y-axis: Features (grouped) → Tasks
- X-axis: Relative time units (based on effort estimates)
- Bars: Task duration, color-coded by feature
- Arrows: Dependency links between tasks
- Markers: Current progress point

**Interactions:**
- **Hover bar** → tooltip with task details
- **Click bar** → opens task detail panel
- **Drag bar edges** → adjust effort estimate (updates YAML)
- **Toggle** → show/hide completed tasks
- **Critical path** → highlight button shows the longest dependency chain

### 4. Dashboard (Webview Panel)

**Open:** Command Palette → `SpecForge: Open Dashboard`

A single-page overview combining key metrics:

```
┌──────────────────────────────────────────────────┐
│  SpecForge Dashboard — My Project                │
├──────────┬──────────┬──────────┬─────────────────┤
│  ○ 37%   │ Features │ Blocked  │ Constitution    │
│  overall │ 2 active │ 1 task   │ ✅ No violations │
│          │ 1 done   │          │                 │
├──────────┴──────────┴──────────┴─────────────────┤
│  Feature Progress                                │
│  ████████████░░░░░░░░  001-user-auth (62%)      │
│  ██░░░░░░░░░░░░░░░░░  002-dashboard (12%)      │
├──────────────────────────────────────────────────┤
│  Recent Activity                                 │
│  • T01 completed — User model created            │
│  • T02 started — Auth service                    │
│  • Constitution amended — added performance rule │
└──────────────────────────────────────────────────┘
```

## File Watching

The extension watches `.specforge/**/*.{yml,yaml,md}` for changes.

When a file changes:
1. Parse the updated file
2. Refresh affected views (Tree, Kanban, Timeline, Dashboard)
3. If a task status changed, show a subtle notification
4. Update badge count on the SpecForge activity bar icon

Debounce: 300ms (to handle rapid Claude Code edits during forge cycles)

## Settings

```json
{
  "specforge.autoRefresh": true,
  "specforge.kanbanColumns": ["pending", "in_progress", "done", "blocked"],
  "specforge.showNotifications": true,
  "specforge.timelineEffortScale": {
    "xs": 1, "s": 2, "m": 4, "l": 8, "xl": 16
  }
}
```

## Development

```bash
# From monorepo root
cd packages/vscode

# Install dependencies
npm install

# Development (watch mode)
npm run dev

# Package extension
npm run package

# Publish to marketplace
npm run publish
```

## Technical Notes

- Webviews use React 18 with Tailwind CSS, bundled via esbuild
- Communication between extension host and webview uses `postMessage`
- All data is parsed from files — no in-memory database
- Tree view uses native `vscode.TreeDataProvider`
- Kanban drag-and-drop uses `@hello-pangea/dnd`
- Timeline rendering uses custom SVG (no heavy dependencies)
