# Skill: Next.js API Route Rules

## Rule: File locations

```
app/api/
├── employees/
│   ├── route.ts          # GET (list active), POST (add)
│   └── [id]/route.ts     # PATCH (deactivate)
├── departments/
│   └── route.ts          # GET (list with employee count)
└── tickets/
    └── route.ts          # GET (list, optional ?status and ?priority)
```

---

## Rule: DB calls go in API routes only — never in components

```ts
// In a component — correct
const res = await fetch('/api/tickets?status=Open')
const { data, error }: ApiResponse<Ticket[]> = await res.json()
```

---

## Rule: Validate input before touching the database

For POST/PATCH routes, validate first. If validation fails, return 400 without opening a DB connection.

---

## Rule: Reading optional query params (GET with filters)

```ts
export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') ?? undefined
  const priority = searchParams.get('priority') ?? undefined

  const VALID_STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed']
  const VALID_PRIORITIES = ['Low', 'Medium', 'High']

  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ data: null, error: 'Invalid status value' }, { status: 400 })
  }
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return NextResponse.json({ data: null, error: 'Invalid priority value' }, { status: 400 })
  }

  // proceed to DB...
}
```

---

## Rule: Route handler export naming

```ts
export async function GET(request: Request): Promise<NextResponse> { ... }
export async function POST(request: Request): Promise<NextResponse> { ... }
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> { ... }
```

---

## Rule: Always use the { data, error } envelope

```ts
// Success
return NextResponse.json({ data: result.recordset, error: null }, { status: 200 })

// Failure
return NextResponse.json({ data: null, error: 'Failed to fetch tickets' }, { status: 500 })
```
