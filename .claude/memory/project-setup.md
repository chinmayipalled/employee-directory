---
name: project-setup
description: Core project constraints, tech stack, current feature state, and spec-first workflow for the Employee Directory app
metadata:
  type: project
---

Next.js 14 App Router, TypeScript strict, Tailwind CSS, SQL Server via mssql npm package. No ORM.

The project is built spec-first: SPEC.md must be written and approved before any application code is written for a feature.

## Current state (as of 2026-06-10)

All four original features are implemented and committed to GitHub (chinmayipalled/employee-directory):
1. View employees ✅
2. Search by name (real-time client-side) ✅
3. Add employee (modal form) ✅
4. Deactivate employee (confirmation dialog) ✅

The app is expanding to three pages with a top navigation bar:
- `/` — Employees
- `/departments` — Departments (read-only table)
- `/tickets` — Tickets (table + status/priority filters)

SPEC.md has been written and is ready for implementation of: Departments table, Tickets table, schema migration, NavBar, and ticket filtering.

## Schema plan

- `Departments` table added (DepartmentId, DepartmentName)
- `Employees.Department` (NVARCHAR) → replaced with `DepartmentId` INT FK
- `Tickets` table added (TicketId, Title, Description, EmployeeId FK, Status, Priority, CreatedDate)

**Why:** Project started as single-page intern training exercise; expanding to demonstrate relational schema design and multi-page routing.

**How to apply:** Always check SPEC.md before implementing. Use `/spec` to create it, `/implement` to build from it. Run `/typecheck` after every implementation session.
