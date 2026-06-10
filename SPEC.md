# Feature: Departments, Tickets & Navigation

---

## Goal

Extend the Employee Directory into a three-page app — Employees, Departments, and Tickets — linked by a top navigation bar, with a relational schema where employees belong to a department and tickets are assigned to employees.

---

## Acceptance Criteria

### Schema Migration
- The `Department` (NVARCHAR) column is removed from the `Employees` table.
- A `DepartmentId` (INT, FK) column replaces it, referencing `Departments.DepartmentId`.
- Existing employee rows are migrated: each distinct department name becomes a row in `Departments`, and `Employees.DepartmentId` is populated accordingly.
- The `Tickets` table is created with all required columns.
- All foreign key constraints are enforced at the database level.

### Navigation Bar
- A persistent top navigation bar appears on every page.
- It contains three links: **Employees**, **Departments**, **Tickets**.
- The active page link is visually highlighted.
- Clicking a link navigates to that page without a full reload (Next.js client-side routing).

### Departments Page (`/departments`)
- Displays a table of all departments: Department ID and Department Name.
- Shows the count of active employees in each department.
- If no departments exist, shows an empty state message.

### Tickets Page (`/tickets`)
- Displays a table of all tickets with columns: **Title**, **Assigned Employee** (full name), **Department** (via join through Employee), **Status**, **Priority**, **Created Date**.
- A **Status** dropdown filters the table: All / Open / In Progress / Resolved / Closed. Defaults to All.
- A **Priority** dropdown filters the table: All / Low / Medium / High. Defaults to All.
- Both filters can be applied simultaneously.
- If no tickets match the active filters, shows an empty state message ("No tickets found").
- If the ticket list fails to load, shows an inline error message.
- Tickets are sorted by CreatedDate descending (newest first) by default.

### Edge Cases
- A department with no employees still appears in the Departments table with a count of 0.
- A ticket assigned to an inactive employee still appears in the Tickets table.
- Dropdowns show "All" as the default selected option and reset the filter when selected.

---

## Data Contract

### Departments Table
| Column | SQL Type | Required | Notes |
|--------|----------|----------|-------|
| DepartmentId | INT IDENTITY PK | yes | auto-generated |
| DepartmentName | NVARCHAR(100) | yes | must be unique |

### Employees Table (modified)
| Column | Change |
|--------|--------|
| Department (NVARCHAR) | **removed** |
| DepartmentId (INT FK) | **added** — references Departments.DepartmentId, NOT NULL |

### Tickets Table
| Column | SQL Type | Required | Notes |
|--------|----------|----------|-------|
| TicketId | INT IDENTITY PK | yes | auto-generated |
| Title | NVARCHAR(200) | yes | |
| Description | NVARCHAR(1000) | no | nullable |
| EmployeeId | INT FK | yes | references Employees.EmployeeId |
| Status | NVARCHAR(50) | yes | one of: Open, In Progress, Resolved, Closed |
| Priority | NVARCHAR(20) | yes | one of: Low, Medium, High |
| CreatedDate | DATETIME | yes | default GETDATE() |

### TypeScript Types

```ts
interface Department {
  DepartmentId: number
  DepartmentName: string
  EmployeeCount: number   // computed, not a column
}

interface Ticket {
  TicketId: number
  Title: string
  Description: string | null
  EmployeeId: number
  EmployeeFullName: string   // computed via join
  DepartmentName: string     // computed via join
  Status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  Priority: 'Low' | 'Medium' | 'High'
  CreatedDate: string
}
```

---

## API Contract

### GET `/api/departments`
Returns all departments with active employee count.

**Response:**
```ts
ApiResponse<Department[]>
```

**Errors:**
- `500` — `{ data: null, error: 'Failed to fetch departments' }`

---

### GET `/api/tickets`
Returns all tickets. Accepts optional query params for filtering.

**Query params:**
| Param | Type | Values |
|-------|------|--------|
| status | string | Open \| In Progress \| Resolved \| Closed |
| priority | string | Low \| Medium \| High |

Both params are optional. Omitting them returns all tickets.

**Response:**
```ts
ApiResponse<Ticket[]>
```

**Errors:**
- `400` — `{ data: null, error: 'Invalid status value' }`
- `400` — `{ data: null, error: 'Invalid priority value' }`
- `500` — `{ data: null, error: 'Failed to fetch tickets' }`

---

## UI Behavior

### Navigation Bar (`components/nav-bar.tsx`)
- Rendered inside `app/layout.tsx` so it persists across all pages.
- Contains links: `Employees → /`, `Departments → /departments`, `Tickets → /tickets`.
- Uses Next.js `<Link>` for client-side navigation.
- Active link detected via `usePathname()` hook and styled with a distinct color/underline.

### Departments Page (`app/departments/page.tsx`)
- On load, fetches `GET /api/departments`.
- Renders a table with columns: Department ID, Department Name, Active Employees.
- Shows a loading skeleton while fetching.
- Shows an empty state if the array is empty.

### Tickets Page (`app/tickets/page.tsx`)
- On load, fetches `GET /api/tickets` (no filters).
- Renders two dropdowns above the table: **Status** and **Priority** (`components/ticket-filters.tsx`).
- On dropdown change, re-fetches `GET /api/tickets?status=X&priority=Y` with whichever params are active.
- Renders results in `components/ticket-table.tsx` with columns: Title, Assigned Employee, Department, Status, Priority, Created Date.
- Status is displayed as a color-coded badge (Open = blue, In Progress = yellow, Resolved = green, Closed = grey).
- Priority is displayed as a badge (High = red, Medium = orange, Low = green).
- Shows empty state if no results match filters.

---

## SQL Queries

### Migration — create Departments and populate from existing Employee data
```sql
CREATE TABLE Departments (
  DepartmentId   INT           IDENTITY(1,1) PRIMARY KEY,
  DepartmentName NVARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO Departments (DepartmentName)
SELECT DISTINCT Department FROM Employees ORDER BY Department;

ALTER TABLE Employees ADD DepartmentId INT NULL;

UPDATE e
SET e.DepartmentId = d.DepartmentId
FROM Employees e
JOIN Departments d ON e.Department = d.DepartmentName;

ALTER TABLE Employees ALTER COLUMN DepartmentId INT NOT NULL;

ALTER TABLE Employees
  ADD CONSTRAINT FK_Employees_Departments
  FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId);

ALTER TABLE Employees DROP COLUMN Department;
```

### Migration — create Tickets table
```sql
CREATE TABLE Tickets (
  TicketId    INT            IDENTITY(1,1) PRIMARY KEY,
  Title       NVARCHAR(200)  NOT NULL,
  Description NVARCHAR(1000) NULL,
  EmployeeId  INT            NOT NULL,
  Status      NVARCHAR(50)   NOT NULL DEFAULT 'Open',
  Priority    NVARCHAR(20)   NOT NULL DEFAULT 'Medium',
  CreatedDate DATETIME       NOT NULL DEFAULT GETDATE(),
  CONSTRAINT FK_Tickets_Employees FOREIGN KEY (EmployeeId)
    REFERENCES Employees(EmployeeId)
);
```

### GET /api/departments
```sql
SELECT
  d.DepartmentId,
  d.DepartmentName,
  COUNT(e.EmployeeId) AS EmployeeCount
FROM Departments d
LEFT JOIN Employees e
  ON e.DepartmentId = d.DepartmentId AND e.IsActive = 1
GROUP BY d.DepartmentId, d.DepartmentName
ORDER BY d.DepartmentName;
```

### GET /api/tickets (no filters)
```sql
SELECT
  t.TicketId,
  t.Title,
  t.Description,
  t.EmployeeId,
  e.FirstName + ' ' + e.LastName AS EmployeeFullName,
  d.DepartmentName,
  t.Status,
  t.Priority,
  t.CreatedDate
FROM Tickets t
JOIN Employees e ON t.EmployeeId = e.EmployeeId
JOIN Departments d ON e.DepartmentId = d.DepartmentId
ORDER BY t.CreatedDate DESC;
```

### GET /api/tickets?status=Open&priority=High
```sql
SELECT
  t.TicketId,
  t.Title,
  t.Description,
  t.EmployeeId,
  e.FirstName + ' ' + e.LastName AS EmployeeFullName,
  d.DepartmentName,
  t.Status,
  t.Priority,
  t.CreatedDate
FROM Tickets t
JOIN Employees e ON t.EmployeeId = e.EmployeeId
JOIN Departments d ON e.DepartmentId = d.DepartmentId
WHERE t.Status = @Status
  AND t.Priority = @Priority
ORDER BY t.CreatedDate DESC;
```
*(Each filter is only added to the WHERE clause when the corresponding query param is present.)*

---

## Out of Scope

- Adding, editing, or deleting departments from the UI (read-only for now)
- Adding or editing tickets from the UI (read-only for now)
- Updating ticket status from the UI
- Deleting tickets
- Pagination on the tickets or departments table
- Sorting tickets by columns other than CreatedDate
- Real-time ticket updates / websockets
- Assigning tickets to multiple employees
- Any changes to the existing Add Employee or Deactivate Employee features
