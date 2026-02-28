# Skill: /forge.clarify

> Challenge and refine an existing spec.

## When to Use

- After a spec is written, before planning
- When a spec has open questions
- When the user wants to stress-test a spec

## Behavior

1. Read the target spec from `.specforge/specs/`
2. Read the constitution at `.specforge/constitution.md`
3. Analyze the spec for:
   - **Ambiguities** — Vague language, undefined terms, unclear scope boundaries
   - **Contradictions** — Internal inconsistencies or conflicts with the constitution
   - **Missing edge cases** — Error states, empty states, boundary conditions not covered
   - **Constitution violations** — Architecture rules, quality standards, or guardrails that the spec ignores
   - **Untestable criteria** — Acceptance criteria that cannot be objectively verified
   - **Missing dependencies** — Implicit requirements not listed
4. Present findings as numbered questions, each with a suggested answer
5. Update the spec based on user responses
6. Resolve any open questions

## Question Format

Present each finding as:

```
1. [AMBIGUITY] "{quoted text from spec}"
   Issue: {what's unclear}
   Suggested resolution: {your recommendation}

2. [EDGE CASE] {scenario description}
   Issue: {why this matters}
   Suggested addition: {proposed spec text}
```

## After Clarification

1. Update the spec file with resolved items
2. Remove resolved open questions
3. Update the feature status to `specified` in `.specforge/forge.yml`
4. Report what changed

## Output

- `.specforge/specs/NNN-feature-name.md` (updated)
- `.specforge/forge.yml` (status updated to `specified`)
