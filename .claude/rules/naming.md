# Rule: Naming Conventions

## Variables and functions — camelCase
```ts
// Correct
const employeeList = []
const isActive = true
function fetchEmployees() {}
function handleDeactivate() {}

// Wrong
const EmployeeList = []
const is_active = true
function FetchEmployees() {}
function handle_deactivate() {}
```

## React components — PascalCase
```ts
// Correct
function EmployeeTable() {}
function SearchInput() {}
function AddEmployeeModal() {}

// Wrong
function employeeTable() {}
function searchinput() {}
function add_employee_modal() {}
```

## Files — kebab-case
```
// Correct
employee-table.tsx
search-input.tsx
add-employee-modal.tsx
api-response.ts

// Wrong
EmployeeTable.tsx
searchInput.tsx
AddEmployeeModal.tsx
```

## Database columns — PascalCase (SQL Server convention)
```sql
-- Correct (matches the Employees table schema)
EmployeeId, FirstName, LastName, Email, Department, JobTitle, HireDate, IsActive

-- Wrong
employee_id, first_name, last_name
```

## No abbreviations
Name things fully so the code reads like plain English.
```ts
// Correct
const employeeId = params.id
const department = body.Department
function deactivateEmployee(id: number) {}

// Wrong
const empId = params.id
const dept = body.Department
function deactEmp(id: number) {}
```
