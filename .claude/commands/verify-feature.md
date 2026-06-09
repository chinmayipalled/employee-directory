---
description: Check the implemented feature against SPEC.md acceptance criteria line by line.
---

Verify the current implementation against every acceptance criterion in SPEC.md.

Steps:
1. Read `SPEC.md` — list every acceptance criterion.
2. For each criterion, read the relevant source files and determine: **PASS**, **FAIL**, or **PARTIAL**.
3. For FAIL or PARTIAL items, describe exactly what is missing or wrong (file + line if possible).
4. Report a summary table:

| # | Criterion (short) | Status | Notes |
|---|-------------------|--------|-------|
| 1 | ...               | PASS   |       |
| 2 | ...               | FAIL   | missing X in file Y |

5. If any items are FAIL or PARTIAL, ask whether to fix them now.

Rules:
- Do not run the dev server — check by reading code only.
- Do not modify any files during this command unless the user confirms fixes.
- Check SQL queries for parameterization — flag any string concatenation as a FAIL.
- Check for `any` types — flag each one as a FAIL.
