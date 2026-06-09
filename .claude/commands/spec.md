---
description: Draft a SPEC.md for the next feature. Pass the feature name as the argument (e.g. /spec "Add Employee").
---

You are writing a feature spec for the Employee Directory app before any code is written.

Feature to spec: $ARGUMENTS

Write (or overwrite) `SPEC.md` in the project root with the following sections:

## Feature: <name>

### Goal
One sentence — what user problem does this solve?

### Acceptance Criteria
Bullet list. Each item must be testable and unambiguous. Cover:
- Happy path behavior
- Edge cases (empty states, validation failures, duplicate data)
- UI behavior (loading states, error messages)

### Data Contract
List every field involved:
- Column name, TypeScript type, validation rules, whether it is required

### API Contract
For each endpoint this feature needs:
- Method + path
- Request body shape (TypeScript interface)
- Response body shape (TypeScript interface)
- Error responses and status codes

### UI Behavior
Describe the user interaction step by step. Reference specific components by name.

### SQL Queries
Write the exact parameterized `mssql` query (or queries) this feature requires.
Use `@param` style for all parameters. No string concatenation.

### Out of Scope
Explicitly list anything that might seem related but will NOT be built in this feature.

---
Rules:
- Do not write any application code. Spec only.
- Do not create any files other than SPEC.md.
- Ask the user to review and approve before closing.
