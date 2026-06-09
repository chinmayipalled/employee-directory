# Rule: Folder Structure

## Principle: Organize by concern, then by feature

Code is split into two concerns — backend and frontend — and within each, grouped by feature.

```
employee-directory/
├── app/
│   ├── page.tsx                        # single page — root UI
│   ├── layout.tsx
│   ├── globals.css
│   └── api/                            # BACKEND — all API routes live here
│       └── employees/
│           ├── route.ts                # GET /api/employees, POST /api/employees
│           └── [id]/
│               └── route.ts           # PATCH /api/employees/[id]
├── components/                         # FRONTEND — all React components
│   ├── employee-table.tsx
│   ├── search-input.tsx
│   ├── add-employee-modal.tsx
│   └── deactivate-dialog.tsx
├── lib/
│   └── db.ts                           # shared DB connection pool
└── types/
    └── employee.ts                     # shared TypeScript interfaces
```

## Backend — `app/api/<feature>/`
All database-touching code lives here. Components never import from `lib/db.ts` directly.

```
app/api/employees/route.ts        → handles GET (list) and POST (add)
app/api/employees/[id]/route.ts   → handles PATCH (deactivate)
```

## Frontend — `components/`
All React UI components live here, grouped by feature when the project grows.

```
components/employee-table.tsx      → renders the employee list
components/search-input.tsx        → the search box
components/add-employee-modal.tsx  → the add form modal
components/deactivate-dialog.tsx   → confirmation dialog
```

## The hard boundary
- Backend files (`app/api/`) talk to the database.
- Frontend files (`components/`) talk to the backend via `fetch('/api/...')`.
- Neither crosses into the other's territory.

## Shared code
- `lib/db.ts` — DB connection pool, imported only by API routes
- `types/employee.ts` — TypeScript interfaces, imported by both backend and frontend
