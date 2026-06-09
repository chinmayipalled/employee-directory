# Skill: Next.js API Route Rules

## Rule: File locations

All API routes live under `app/api/`. Follow this structure:

```
app/
└── api/
    └── employees/
        ├── route.ts           # GET (list), POST (add)
        └── [id]/
            └── route.ts       # PATCH (deactivate by ID)
```

- `GET /api/employees` — fetch all active employees
- `POST /api/employees` — add a new employee
- `PATCH /api/employees/[id]` — deactivate an employee by ID

---

## Rule: DB calls go in API routes only — never in components

Components call `fetch('/api/employees')`. They never import `lib/db.ts` directly.

**Wrong:**
```ts
// Inside a React component
import { getPool } from '@/lib/db'  // ❌ never do this in a component
```

**Correct:**
```ts
// Inside a React component
const res = await fetch('/api/employees')
const { data, error } = await res.json()
```

---

## Rule: Validate input before touching the database

For `POST` and `PATCH` routes, validate the request body first. If validation fails, return `400` immediately — do not open a DB connection.

```ts
export async function POST(request: Request) {
  const body = await request.json()
  const { FirstName, LastName, Email, Department, JobTitle, HireDate } = body

  // Validate first
  if (!FirstName || !LastName || !Email || !Department || !JobTitle || !HireDate) {
    return NextResponse.json(
      { data: null, error: 'All fields are required' },
      { status: 400 }
    )
  }

  // Only reach the DB after validation passes
  try {
    const pool = await getPool()
    // ... insert query
  } catch (err) {
    console.error(err)
    return NextResponse.json({ data: null, error: 'Failed to add employee' }, { status: 500 })
  }
}
```

---

## Rule: Route handler export naming

Use named exports matching the HTTP method. Next.js App Router requires this.

```ts
export async function GET(request: Request) { ... }
export async function POST(request: Request) { ... }
export async function PATCH(request: Request, { params }: { params: { id: string } }) { ... }
```
