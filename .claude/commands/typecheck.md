---
description: Run TypeScript type checking and report all errors with file + line references.
---

Run the following command and report results:

```
npx tsc --noEmit
```

If there are errors:
- List each error with file path, line number, and the TypeScript message.
- For each error, identify the root cause (missing type, wrong shape, implicit `any`, etc.).
- Fix every error. Do not suppress errors with `@ts-ignore` or `as any` casts.
- Re-run after fixing to confirm zero errors.

If there are zero errors, confirm: "TypeScript: 0 errors."

Rules:
- Never use `@ts-ignore`, `@ts-expect-error`, or `as any` as a fix.
- If a type is genuinely unknown at the boundary (e.g., raw DB row), use `unknown` and narrow it properly.
