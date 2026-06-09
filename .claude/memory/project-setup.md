---
name: project-setup
description: Core project constraints and spec-first workflow for the Employee Directory app
metadata:
  type: project
---

Next.js 14 App Router, TypeScript strict, Tailwind CSS, SQL Server via mssql npm package. No ORM.

The project is built spec-first: SPEC.md must be written and approved before any application code is written for a feature.

Four features total: View employees, Search by name (real-time client-side), Add employee (modal form), Deactivate employee.

Single page at `/` — no routing.

**Why:** Intern AI-driven development practice. The goal is to drive the entire build through Claude Code using specs, not starter code.

**How to apply:** Always check whether SPEC.md exists and is current before implementing. Use `/spec` to create it, `/implement` to build from it.
