---
name: ts-rules
description: TypeScript strict mode rules — no any, unknown-and-narrow at boundaries
metadata:
  type: project
---

TypeScript is in strict mode. Zero `any` types are permitted anywhere in the codebase.

At the DB boundary (raw `mssql` result rows), use `unknown` and narrow with a type guard or explicit cast to a defined interface. Never use `as any`.

`@ts-ignore` and `@ts-expect-error` are not permitted as fixes — they mask real bugs.

**Why:** Project requirement enforced by strict tsconfig. Also catches real bugs early.

**How to apply:** When a type error appears, define the correct type rather than suppressing it. Run `/typecheck` after every implementation session.
