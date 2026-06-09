# Employee Directory — Claude Code Project Guide

## Project Overview
A single-page Employee Directory web app. One page, one database table, four features.
Built spec-first: always write SPEC.md for a feature before writing any application code.

## Tech Stack
| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Framework  | Next.js 14 — App Router                        |
| Language   | TypeScript — strict mode, zero `any` types      |
| Styling    | Tailwind CSS                                    |
| Database   | SQL Server via `mssql` npm package — no ORM     |

## Hard Rules
- **No `any` in TypeScript.** Use `unknown` and narrow, or define proper types.
- **No ORM.** All DB access goes through raw `mssql` parameterized queries.
- **No ORMs, no Prisma, no Drizzle, no TypeORM.**
- **Spec first.** For every feature, a SPEC.md must exist and be approved before implementation starts.
- **One page.** No routing beyond `/`. All four features live on the root page.
- **No comments explaining what code does.** Name things well instead.
- **Parameterized queries only.** Never concatenate user input into SQL strings.

## Features
1. **View employees** — load and display all active employees on page load.
2. **Search by name** — real-time client-side filter as the user types; no page reload.
3. **Add employee** — modal/form; new employee appears in table after saving.
4. **Deactivate employee** — toggle active status; employee disappears from the active list.

## Database
- Package: `mssql`
- Table: `Employees` (single table)
- Expected columns: `EmployeeId`, `FirstName`, `LastName`, `Email`, `Department`, `JobTitle`, `HireDate`, `IsActive`
- Connection config lives in environment variables — never hardcode credentials.
- Required env vars: `DB_SERVER`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_PORT`

## Project Structure (target)
```
employee-directory/
├── CLAUDE.md
├── SPEC.md                  # written before each feature, updated per feature
├── .claude/
│   ├── settings.json        # hooks, permissions
│   ├── commands/            # custom slash commands
│   └── agents/              # sub-agents
├── app/
│   ├── layout.tsx
│   ├── page.tsx             # single page — all features here
│   ├── globals.css
│   └── api/
│       └── employees/
│           └── route.ts     # API routes for DB operations
├── components/              # React components
├── lib/
│   └── db.ts                # mssql connection pool
├── types/
│   └── employee.ts          # shared TypeScript types
├── .env.local               # DB credentials (gitignored)
└── next.config.ts
```

## Development Workflow
1. Receive feature requirement.
2. Run `/spec` to draft SPEC.md for that feature.
3. Review and approve the spec.
4. Run `/implement` to build from the spec.
5. Run `/typecheck` to confirm zero TypeScript errors.
6. Run `/verify-feature` to manually confirm the feature matches the spec.

## Environment Setup
```bash
npm install
# create .env.local with DB credentials
npm run dev
```

## Key Constraints for Claude
- Always read `types/employee.ts` before writing any component that touches employee data.
- Always read `lib/db.ts` before writing any API route.
- SQL queries go in API routes under `app/api/`, never in components.
- Tailwind only — no inline `style` props, no external CSS libraries.
- `use client` only on components that genuinely need browser APIs or event handlers.
