# Rule: Folder Structure

## Principle: Organize by concern, then by feature

```
employee-directory/
├── app/
│   ├── layout.tsx                      # includes NavBar — persists across all pages
│   ├── globals.css
│   ├── page.tsx                        # /  — Employees page
│   ├── departments/
│   │   └── page.tsx                    # /departments — Departments page
│   ├── tickets/
│   │   └── page.tsx                    # /tickets — Tickets page
│   └── api/                            # BACKEND — all API routes live here
│       ├── employees/
│       │   ├── route.ts                # GET /api/employees, POST /api/employees
│       │   └── [id]/
│       │       └── route.ts            # PATCH /api/employees/[id]
│       ├── departments/
│       │   └── route.ts                # GET /api/departments
│       └── tickets/
│           └── route.ts                # GET /api/tickets
├── components/                         # FRONTEND — all React components
│   ├── nav-bar.tsx                     # top navigation bar (use client)
│   ├── employee-table.tsx
│   ├── search-input.tsx
│   ├── add-employee-modal.tsx
│   ├── deactivate-dialog.tsx
│   ├── department-table.tsx
│   ├── ticket-table.tsx
│   └── ticket-filters.tsx
├── lib/
│   └── db.ts                           # shared DB connection pool
├── types/
│   ├── employee.ts                     # Employee, NewEmployeePayload, ApiResponse
│   ├── department.ts                   # Department
│   └── ticket.ts                       # Ticket, TicketFilters
└── database/
    ├── setup.sql                       # initial schema + seed data
    └── migrate-001-departments-tickets.sql  # migration: Departments + Tickets tables
```

## Backend — `app/api/<feature>/`

All database-touching code lives here. Components never import from `lib/db.ts` directly.

```
app/api/employees/route.ts        → GET (list active), POST (add)
app/api/employees/[id]/route.ts   → PATCH (deactivate)
app/api/departments/route.ts      → GET (list with employee count)
app/api/tickets/route.ts          → GET (list, optional ?status and ?priority filters)
```

## Frontend — `components/`

All React components live here. Each feature gets its own file(s).

## The hard boundary

- Backend files (`app/api/`) talk to the database.
- Frontend files (`components/`, `app/**/page.tsx`) talk to the backend via `fetch('/api/...')`.
- Neither crosses into the other's territory.

## Shared code

- `lib/db.ts` — DB connection pool, imported only by API routes
- `types/*.ts` — TypeScript interfaces, imported by both backend and frontend
- `database/*.sql` — SQL scripts, run manually via sqlcmd or SSMS
