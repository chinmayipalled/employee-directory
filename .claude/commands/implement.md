---
description: Implement the feature described in SPEC.md. Run /spec first if SPEC.md does not exist.
---

You are implementing a feature for the Employee Directory app driven entirely by SPEC.md.

Steps you MUST follow in order:

1. **Read SPEC.md** — understand every acceptance criterion, API contract, and SQL query before touching any file.
2. **Read existing files** — read `types/employee.ts`, `lib/db.ts`, and any component files that will be modified. Never assume their contents.
3. **Implement types first** — add or update TypeScript interfaces in `types/employee.ts` to match the spec's Data Contract.
4. **Implement the API route** — write the route under `app/api/employees/route.ts` (or a sub-route). Use parameterized `mssql` queries exactly as specified in the spec. No ORMs.
5. **Implement UI** — build or update React components. Tailwind only. Mark `use client` only where required.
6. **Wire everything together** — update `app/page.tsx` if needed.
7. **Run type check** — run `npx tsc --noEmit` and fix every error before reporting done.

Rules:
- Zero `any` types. If you are tempted to use `any`, define a proper type instead.
- All SQL parameters use `@param` syntax with `mssql` `request.input()`.
- No comments that explain what the code does. Name things clearly.
- Do not implement anything listed under "Out of Scope" in SPEC.md.
- If SPEC.md is missing a detail you need, stop and ask the user — do not guess.
