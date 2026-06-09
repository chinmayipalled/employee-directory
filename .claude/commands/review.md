---
description: /review — Audit the current implementation against SPEC.md and all rules. Reports issues by category.
---

You are performing a code review of the Employee Directory implementation.

Read SPEC.md first. Then read every file that was changed or created for the current feature. Then check each category below and report findings.

---

## 1. Unsafe SQL
- [ ] Are all user-supplied values passed through `request.input()` with a SQL type?
- [ ] Is there any string concatenation or template literals used to build SQL queries?
- [ ] Is the shared pool from `lib/db.ts` used — not a new `sql.connect()` inside the route?

Flag any violation as: **[SQL] <file>:<line> — <description>**

## 2. Missing Input Validation
- [ ] Does every POST/PATCH route validate the request body before touching the database?
- [ ] Are required fields checked for presence and non-empty values?
- [ ] Does an invalid/incomplete request return HTTP 400 before any DB call is made?

Flag any violation as: **[VALIDATION] <file>:<line> — <description>**

## 3. Missing Error Handling
- [ ] Is every DB call wrapped in a try/catch?
- [ ] Does the catch block return a `{ data: null, error: '...' }` response with status 500?
- [ ] Does every `fetch()` on the client side check for `error` in the response before using `data`?

Flag any violation as: **[ERROR-HANDLING] <file>:<line> — <description>**

## 4. Naming Violations
- [ ] Variables and functions: camelCase?
- [ ] React components: PascalCase?
- [ ] File names: kebab-case?
- [ ] No abbreviations (emp, dept, id shortened to something unclear)?

Flag any violation as: **[NAMING] <file>:<line> — <description>**

## 5. TypeScript Violations
- [ ] Any use of `any` type anywhere?
- [ ] Are all API response shapes typed with an interface?
- [ ] Do all functions have explicit return types?
- [ ] Are all component props typed with an interface?

Flag any violation as: **[TYPESCRIPT] <file>:<line> — <description>**

## 6. SPEC Compliance
- [ ] Does the implementation satisfy every acceptance criterion in SPEC.md?
- [ ] Is anything listed as Out of Scope accidentally implemented?
- [ ] Does the UI match the exact behavior described in the spec (messages, states, field names)?

Flag any violation as: **[SPEC] <criterion> — <what is missing or wrong>**

---

## Report format

Produce a table at the end:

| Category | File | Issue |
|---|---|---|
| SQL | app/api/employees/route.ts:12 | User input concatenated into query string |
| SPEC | Acceptance Criterion 3 | Error message text does not match spec |

If no issues found in a category, write: ✅ <Category> — clean.

Ask the user whether to fix the flagged issues before closing.
