---
name: db-rules
description: Database access rules — mssql only, parameterized queries, no ORM, connection pool
metadata:
  type: project
---

All DB access uses the `mssql` npm package with a shared connection pool in `lib/db.ts`.

No ORM is allowed (no Prisma, Drizzle, TypeORM, Sequelize).

All user-supplied values must go through `request.input('name', sql.Type, value)` — never string-concatenated into SQL.

**Why:** Project requirement. Also prevents SQL injection by design.

**How to apply:** When writing any API route, always import the pool from `lib/db.ts`, always parameterize, always type the result with `sql.IResult<T>`. See [[db-agent]] for detailed patterns.
