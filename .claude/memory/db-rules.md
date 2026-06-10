---
name: db-rules
description: SQL Server connection details, auth method, and DB access rules for this project
metadata:
  type: project
---

## Connection (resolved 2026-06-10)

- Instance: `DESKTOP-538KP3R\SQLEXPRESS` (SQL Server Express 2025)
- TCP port: `1433` (manually enabled on SQLEXPRESS via xp_instance_regwrite)
- Auth: SQL Server auth — `emp_app` user, db_datareader + db_datawriter on EmployeeDirectory
- Mixed-mode auth enabled on the instance (was Windows-only by default)
- `lib/db.ts` reads all config from env vars — no hardcoded values

**Why Windows Auth was abandoned:** The mssql/tedious TDS driver cannot negotiate NTLM/SSPI over TCP on Windows. `trustedConnection: true` sends an empty identity and fails with "Login failed for user ''". sqlcmd works (uses named pipes + OS SSPI) but Node.js does not.

## DB access rules

- All DB access uses the `mssql` npm package with a shared connection pool in `lib/db.ts`.
- No ORM is allowed (no Prisma, Drizzle, TypeORM, Sequelize).
- All user-supplied values go through `request.input('name', sql.Type, value)` — never string-concatenated.
- For optional filter params, use the `WHERE 1=1 AND ...` flag pattern — see [[sql-skill]].

**How to apply:** When writing any API route, always import the pool from `lib/db.ts`, always parameterize, always type the result. See db-agent for detailed patterns and the full schema.
