---
description: Verify the SQL Server database connection and print schema for all tables.
---

Verify the database connection and schema for the Employee Directory app.

Steps:
1. Check that `.env.local` exists and contains: `DB_SERVER`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_PORT`.
   - Do NOT print credential values. Only confirm each key is present or missing.
2. Write a temporary Node.js script (do NOT save it permanently) that:
   - Connects to SQL Server using `mssql` and the env vars above.
   - Runs this query for each table (Employees, Departments, Tickets):
     `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '<table>' ORDER BY ORDINAL_POSITION`
   - Prints each result as a labelled table.
   - Checks row counts: `SELECT COUNT(*) FROM Employees`, `SELECT COUNT(*) FROM Departments`, `SELECT COUNT(*) FROM Tickets`
   - Closes the connection.
3. Run the script and report the schema output.
4. Confirm columns match the TypeScript types in `types/employee.ts`, `types/department.ts`, `types/ticket.ts`.
5. Flag any mismatch between DB schema and TypeScript types.

Connection notes (already resolved — do not re-investigate unless an error occurs):
- Instance: DESKTOP-538KP3R\SQLEXPRESS, TCP on localhost:1433
- Auth: SQL Server auth via DB_USER / DB_PASSWORD env vars
- Windows Authentication does NOT work with the mssql/tedious driver over TCP

Rules:
- Delete the temporary script after running it.
- Never log or print connection strings or passwords.
