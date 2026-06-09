# Skill: API Response Rules

## Rule: Always use the { data, error } envelope

Every API route must return a consistent response shape — success or failure.

```ts
// Success
return NextResponse.json({ data: result, error: null }, { status: 200 })

// Failure
return NextResponse.json({ data: null, error: 'Something went wrong' }, { status: 500 })
```

The client always checks `error` first before reading `data`.

---

## Rule: Use correct HTTP status codes

| Situation | Status code |
|---|---|
| Success (GET, read) | `200` |
| Success (POST, created) | `201` |
| Validation failed (missing/invalid fields) | `400` |
| Record not found | `404` |
| Duplicate / conflict (e.g. email exists) | `409` |
| Server or DB error | `500` |

---

## Rule: Always wrap DB calls in try/catch

Every route handler that touches the database must have a try/catch. Never let an unhandled DB error crash the route.

```ts
export async function GET() {
  try {
    const pool = await getPool()
    const result = await pool.request()
      .query<EmployeeRow>('SELECT * FROM Employees WHERE IsActive = 1')

    return NextResponse.json({ data: result.recordset, error: null }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ data: null, error: 'Failed to fetch employees' }, { status: 500 })
  }
}
```

---

## Rule: TypeScript response types

Define the response type so the client-side fetch is fully typed.

```ts
interface ApiResponse<T> {
  data: T | null
  error: string | null
}
```
