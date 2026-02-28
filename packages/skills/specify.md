# Skill: /forge.specify

> Create a feature specification.

## When to Use

- When starting a new feature
- When the user describes something they want to build

## Behavior

1. Accept a natural language description of the feature (what + why)
2. Read the constitution at `.specforge/constitution.md` for constraints and principles
3. Generate a structured spec with all required sections (see schema below)
4. Auto-number the spec: find the next available `NNN` prefix in `.specforge/specs/`
5. If open questions exist, prompt the user to resolve them before proceeding to planning

## Spec Sections

For each section, think carefully:

- **Overview** — What this feature does and why it matters. Be concrete.
- **User Stories** — Use the format: "As a {role}, I want {action}, so that {benefit}". Cover the primary use case and key variations.
- **Acceptance Criteria** — Testable conditions that define "done". Each criterion should be independently verifiable.
- **Edge Cases** — What could go wrong? Empty states, error conditions, boundary values, concurrent access, permission issues.
- **Dependencies** — What existing features, services, or infrastructure does this depend on?
- **Out of Scope** — Explicitly excluded items to prevent scope creep. Be specific about what this feature does NOT do.
- **Open Questions** — Unresolved decisions that block planning. Each question should have a suggested answer.

## Cross-Check

Before finalizing, verify:
- Acceptance criteria are testable (not vague)
- No contradiction with constitution architecture rules
- Dependencies are realistic (they exist or are planned)
- Scope is appropriately sized (not too large for a single spec)

## After Writing

1. Save to `.specforge/specs/NNN-{slug}.md`
2. Add a feature entry to `.specforge/forge.yml` with status `draft`
3. Report the spec path and any open questions to the user

## Output

- `.specforge/specs/NNN-feature-name.md`
- `.specforge/forge.yml` (updated with new feature entry)
