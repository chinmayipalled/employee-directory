# Rule: TypeScript Standards

## No `any` type — ever
`any` disables TypeScript's protection. Use `unknown` and narrow it, or define a proper interface.

```ts
// Wrong
const result: any = await pool.request().query(...)
function handleClick(event: any) {}

// Correct
const result = await pool.request().query<EmployeeRow>(...)
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {}
```

If you are tempted to write `any`, that is a signal to stop and define the correct type instead.

## Always define interfaces for API responses
Every `fetch()` call must know the shape of what it receives.

```ts
// Define this in types/employee.ts
interface Employee {
  EmployeeId: number
  FirstName: string
  LastName: string
  Email: string
  Department: string
  JobTitle: string
  HireDate: string
  IsActive: boolean
}

interface ApiResponse<T> {
  data: T | null
  error: string | null
}

// Use it when fetching
const res = await fetch('/api/employees')
const { data, error }: ApiResponse<Employee[]> = await res.json()
```

## Always define return types on functions
Return types make your intent explicit and catch mistakes before runtime.

```ts
// Wrong — return type inferred, easy to accidentally change
async function fetchEmployees() {
  const res = await fetch('/api/employees')
  return res.json()
}

// Correct — return type declared explicitly
async function fetchEmployees(): Promise<ApiResponse<Employee[]>> {
  const res = await fetch('/api/employees')
  return res.json()
}

// Correct — component return type
function EmployeeTable({ employees }: { employees: Employee[] }): JSX.Element {
  return <table>...</table>
}
```

## Define prop interfaces for every component
```ts
// Wrong
function EmployeeTable({ employees, onDeactivate }: any) {}

// Correct
interface EmployeeTableProps {
  employees: Employee[]
  onDeactivate: (id: number) => void
}

function EmployeeTable({ employees, onDeactivate }: EmployeeTableProps): JSX.Element {}
```
