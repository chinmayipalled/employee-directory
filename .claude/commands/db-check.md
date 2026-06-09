---
description: Verify the SQL Server database connection and print the Employees table schema.
---

Verify the database connection and schema for the Employee Directory app.

Steps:
1. Check that `.env.local` exists and contains: `DB_SERVER`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_PORT`.
   - Do NOT print credential values. Only confirm each key is present or missing.
2. Write a temporary Node.js script (do NOT save it permanently) that:
   - Connects to SQL Server using `mssql` and the env vars above.
   - Runs: `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Employees' ORDER BY ORDINAL_POSITION`
   - Prints the result as a table.
   - Closes the connection.
3. Run the script and report the schema output.
4. Confirm which columns map to the TypeScript `Employee` type in `types/employee.ts` (if that file exists).
5. Flag any mismatch between the DB schema and the TypeScript types.

Rules:
- Delete the temporary script after running it.
- Never log or print connection strings or passwords.
