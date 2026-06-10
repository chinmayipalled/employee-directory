# Skill: SQL Query Rules

## Rule: Always parameterized inputs — never string concatenation

Every value from a user request (body, query string, route param) must go through `request.input()`.

**Wrong:**
```ts
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

Never call `sql.connect()` inside a route handler.

```ts
import { getPool } from '@/lib/db'
const pool = await getPool()
const result = await pool.request().input(...).query(...)
```

---

## Rule: Type every query result

```ts
const result = await pool.request()
  .query<Employee>('SELECT * FROM Employees WHERE IsActive = 1')
const employees: Employee[] = result.recordset
```

---

## Rule: Conditional WHERE clauses — flag pattern

When filters are optional query params, build the WHERE clause safely:

```ts
const request = pool.request()
let where = 'WHERE 1=1'

if (status) {
  request.input('Status', sql.NVarChar, status)
  where += ' AND t.Status = @Status'
}
if (priority) {
  request.input('Priority', sql.NVarChar, priority)
  where += ' AND t.Priority = @Priority'
}

const result = await request.query<Ticket>(`
  SELECT t.*, e.FirstName + ' ' + e.LastName AS EmployeeFullName, d.DepartmentName
  FROM Tickets t
  JOIN Employees e ON t.EmployeeId = e.EmployeeId
  JOIN Departments d ON e.DepartmentId = d.DepartmentId
  ${where}
  ORDER BY t.CreatedDate DESC
`)
```

---

## Rule: Multi-table joins follow FK chain

The FK chain is: `Departments → Employees → Tickets`

Whenever you need DepartmentName on a ticket or employee query, join through this chain:

```sql
FROM Tickets t
JOIN Employees e ON t.EmployeeId = e.EmployeeId
JOIN Departments d ON e.DepartmentId = d.DepartmentId
```

---

## Rule: Validate enum inputs before hitting the DB

For Status and Priority, validate against allowed values before executing the query:

```ts
const VALID_STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed']
const VALID_PRIORITIES = ['Low', 'Medium', 'High']

if (status && !VALID_STATUSES.includes(status)) {
  return NextResponse.json({ data: null, error: 'Invalid status value' }, { status: 400 })
}
```

---

## Rule: Migration scripts go under `database/`

All schema changes are written as numbered SQL migration files:
```
database/setup.sql                          ← initial schema + seed
database/migrate-001-departments-tickets.sql ← Departments + Tickets + Employee FK
```

Never apply destructive schema changes (DROP COLUMN, DROP TABLE) without first migrating existing data.
