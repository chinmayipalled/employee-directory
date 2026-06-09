# Skill: SQL Query Rules

## Rule: Always parameterized inputs — never string concatenation

### What this means
Every value that comes from a user request (body, query string, route param) must be passed through `request.input()`. Never build SQL strings by joining or interpolating variables.

**Wrong:**
```ts
const result = await pool.request()
  .query(`SELECT * FROM Employees WHERE FirstName = '${name}'`)
```

**Correct:**
```ts
const result = await pool.request()
  .input('name', sql.NVarChar, name)
  .query('SELECT * FROM Employees WHERE FirstName = @name')
```

---

## Rule: Always use the shared connection pool

Never create a new `sql.connect()` inside a route handler. Always import the pool from `lib/db.ts`.

**Wrong:**
```ts
const pool = await sql.connect({ server: '...', ... })
```

**Correct:**
```ts
import { getPool } from '@/lib/db'
const pool = await getPool()
const result = await pool.request()
  .input(...)
  .query(...)
```

---

## Rule: Type every query result

Use a defined TypeScript interface for the result rows. Never use `any` or leave the result untyped.

```ts
interface EmployeeRow {
  EmployeeId: number
  FirstName: string
  LastName: string
  Email: string
  Department: string
  JobTitle: string
  HireDate: Date
  IsActive: boolean
}

const result = await pool.request()
  .query<EmployeeRow>('SELECT * FROM Employees WHERE IsActive = 1')

const employees: EmployeeRow[] = result.recordset
```
