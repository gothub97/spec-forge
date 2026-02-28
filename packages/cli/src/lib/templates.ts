/** Default constitution template content */
export const CONSTITUTION_TEMPLATE = `# Constitution — {Project Name}

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
`;

/** Default spec template content */
export const SPEC_TEMPLATE = `# Spec — {Feature Name}

> Status: draft
> Created: {date}

## Overview
{What this feature does and why it matters}

## User Stories
- As a {role}, I want {action}, so that {benefit}

## Acceptance Criteria
- [ ] {testable condition for "done"}

## Edge Cases
- {what could go wrong}

## Dependencies
- {what this feature depends on}

## Out of Scope
- {explicitly excluded items}

## Open Questions
- {unresolved decisions — blocks planning}
`;

/** Default plan template content */
export const PLAN_TEMPLATE = `# Plan — {Feature Name}

> Spec: {path to spec}
> Status: draft
> Complexity: {S/M/L/XL}

## Technical Approach
{How this will be built}

## File Changes
### New Files
- {path} — {purpose}

### Modified Files
- {path} — {what changes}

### Deleted Files
- {path} — {why}

## Data Model
{Schema changes, migrations}

## API Design
{Endpoints, contracts}

## Component Breakdown
{UI components, if applicable}

## Testing Strategy
- **Unit Tests:** {what and where}
- **Integration Tests:** {what and where}
- **E2E Tests:** {what and where}

## Risk Assessment
- {what could go wrong technically}

## Estimated Complexity
{T-shirt size with justification}
`;
