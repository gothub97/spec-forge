# Skill: /forge.plan

> Create a technical implementation plan from a spec.

## When to Use

- After a spec is clarified (or clarification is skipped)
- When ready to design the technical approach for a feature

## Prerequisites

- A spec must exist for this feature
- If `require_clarify_before_plan` is true in `forge.yml`, the spec must have status `specified` (clarified)

## Behavior

1. Read the spec from `.specforge/specs/`
2. Read the constitution at `.specforge/constitution.md`
3. Analyze the existing codebase:
   - File structure and conventions
   - Existing patterns and abstractions
   - Related code that will be affected
   - Available dependencies
4. Generate a plan with all required sections (see schema below)
5. Cross-reference against constitution architecture rules
6. Flag any deviations from established patterns

## Plan Sections

- **Technical Approach** — High-level strategy. How will this be built? What patterns will be used?
- **File Changes** — Organized into New Files, Modified Files, Deleted Files. Each entry includes the path and what changes.
- **Data Model** — Schema changes, migrations, new types/interfaces
- **API Design** — Endpoints, request/response contracts, error codes
- **Component Breakdown** — UI components if applicable (hierarchy, props, state)
- **Testing Strategy** — What tests are needed (unit, integration, e2e), where they live, what they cover
- **Risk Assessment** — Technical risks, performance concerns, security considerations
- **Estimated Complexity** — T-shirt size (S/M/L/XL) with justification

## Cross-Check

Before finalizing, verify:
- File changes follow existing project structure conventions
- Testing strategy meets constitution quality standards
- No architecture anti-patterns from the constitution
- Dependencies align with constitution dependency policy
- Complexity estimate is realistic

## After Writing

1. Save to `.specforge/plans/NNN-{slug}.md`
2. Update the feature entry in `.specforge/forge.yml`:
   - Set `plan` path
   - Set status to `planned`
3. Report the plan path and complexity estimate

## Output

- `.specforge/plans/NNN-feature-name.md`
- `.specforge/forge.yml` (updated)
