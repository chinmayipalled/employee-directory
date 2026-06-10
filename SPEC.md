# SPEC.md — Employee Directory

---

## Feature 1: View Employees

### Goal
Display all active employees from the database when the page loads.

### Acceptance Criteria
- [ ] All active employees (`IsActive = 1`) are loaded from the database on page load
- [ ] Each row displays **Full Name** (FirstName + LastName combined)
- [ ] Each row displays **Department**
- [ ] Each row displays **Job Title**
- [ ] Each row displays **Hire Date** formatted as a readable date (e.g. `Mar 15, 2021`)
- [ ] Each row displays a **Status badge** — green `Active` badge for active employees
- [ ] Inactive employees (`IsActive = 0`) are **not shown** in the list
- [ ] A loading state is shown while data is being fetched
- [ ] If no active employees exist, display: `No employees found.`
- [ ] Table has clear column headers: Full Name, Department, Job Title, Hire Date, Status

---

## Feature 2: Search Employees

### Goal
Allow users to filter the employee table in real time as they type a name, without reloading the page or hitting the server.

### Acceptance Criteria
- [ ] A search input is visible above the employee table at all times
- [ ] Placeholder text reads: `Search by name…`
- [ ] As the user types, the table filters to show only employees whose First Name or Last Name contains the search term (case-insensitive)
- [ ] Filtering is instant — no submit button, no page reload, no API call per keystroke
- [ ] Clearing the input restores the full employee list
- [ ] Searching with only whitespace shows the full list (trimmed empty string = no filter)
- [ ] If no employees match the search, display: `No employees match your search.`
- [ ] Search input has `aria-label` of `Search employees by name` for accessibility

---

## Feature 3: Add Employee

### Goal
Allow users to add a new employee via a form. The new employee appears in the table immediately after saving.

### Acceptance Criteria
- [ ] An **Add Employee** button is visible above the table
- [ ] Clicking the button opens a **modal form**
- [ ] The form collects the following fields:
  - First Name (required)
  - Last Name (required)
  - Email (required, must be valid email format)
  - Department (required)
  - Job Title (required)
  - Hire Date (required)
- [ ] All fields are validated before submission — empty required fields show an error message
- [ ] On successful save, the modal closes and the new employee appears in the table without a page reload
- [ ] The new employee is saved to the database with `IsActive = 1` by default
- [ ] If the email already exists in the database, display an error: `Email already in use.`
- [ ] A loading/submitting state is shown on the Save button while the request is in flight
- [ ] Closing the modal (cancel or X button) discards the form without saving

---

## Feature 4: Deactivate Employee

### Goal
Allow users to mark an employee as inactive. The employee disappears from the table. No record is ever deleted from the database.

### Acceptance Criteria
- [ ] Each employee row has a **Deactivate** button
- [ ] Clicking Deactivate shows a **confirmation dialog** before taking any action
- [ ] The confirmation dialog displays: `Are you sure you want to deactivate [Full Name]?`
- [ ] The dialog has a **Confirm** button and a **Cancel** button
- [ ] Clicking Cancel closes the dialog and does nothing
- [ ] Clicking Confirm sets `IsActive = 0` for that employee in the database
- [ ] After confirmation, the row is **removed from the table** without a page reload
- [ ] The employee record is **never deleted** from the database — only `IsActive` is updated
- [ ] A loading state is shown on the Confirm button while the request is in flight
- [ ] If the deactivation request fails, display an error message and keep the row in the table

---

## Feature 5: Department Page

### Goal
Allow users to click a department link on the Employee Directory to view that department's details (ID, name, description) and its active employees on a dedicated page.

### Acceptance Criteria

**Happy path**
- [ ] A new `Departments` table exists with `DeptID`, `DepartmentName`, and `Description`
- [ ] The `Employees` table has a `DeptID` foreign key column linking to `Departments.DeptID`
- [ ] Each row in the employee table renders the `DeptID` as a clickable link (e.g. `D-3`)
- [ ] Clicking the link navigates to `/departments/[id]`
- [ ] The department page displays: Department ID, Department Name, and Description
- [ ] The department page lists all **active** employees in that department: Full Name, Job Title, Hire Date

**Edge cases**
- [ ] If the department ID in the URL does not exist, the page shows: "Department not found."
- [ ] If a department has no active employees, the list shows: "No active employees in this department."
- [ ] If `Description` is null or empty, the UI shows: "No description available."
- [ ] If the API call fails, the page shows: "Failed to load department."

**UI behavior**
- [ ] The department page shows a loading state while data is being fetched
- [ ] A "← Back to Directory" link at the top returns the user to `/`

### Data Contract

**New table — `Departments`**

| Column | TS Type | SQL Type | Required | Notes |
|---|---|---|---|---|
| `DeptID` | `number` | `INT IDENTITY(1,1) PK` | yes | auto-generated |
| `DepartmentName` | `string` | `NVARCHAR(100) NOT NULL UNIQUE` | yes | |
| `Description` | `string \| null` | `NVARCHAR(500) NULL` | no | |

**Modified table — `Employees`**

| Column | Change |
|---|---|
| `DeptID` | New `INT NOT NULL` FK → `Departments.DeptID` |
| `Department` | Kept as-is (not removed) |

**TypeScript types (add to `types/employee.ts`)**

```ts
interface Department {
  DeptID: number
  DepartmentName: string
  Description: string | null
}

interface DepartmentEmployee {
  EmployeeId: number
  FirstName: string
  LastName: string
  JobTitle: string
  HireDate: string
}

interface DepartmentDetail extends Department {
  employees: DepartmentEmployee[]
}
```

### API Contract

**GET `/api/departments/[id]`**

- `id` comes from the URL param — must be a valid integer.
- No request body.
- Success `200`: `{ data: DepartmentDetail, error: null }`
- Not found `404`: `{ data: null, error: 'Department not found' }`
- Server error `500`: `{ data: null, error: 'Failed to load department' }`

### UI Behavior

1. **`components/employee-table.tsx`** — the Department column renders `DeptID` as a `<Link href="/departments/[deptId]">D-{deptId}</Link>` in addition to the department name.
2. **`app/departments/[id]/page.tsx`** — new Next.js page that:
   - Fetches from `GET /api/departments/[id]`
   - Shows a loading indicator while fetching
   - Renders: Department ID badge, Department Name as `<h1>`, Description paragraph
   - Renders a table of active employees: Full Name, Job Title, Hire Date
   - Renders "← Back to Directory" link at the top
3. **`components/department-detail.tsx`** — client component receiving `DepartmentDetail` as props; renders the detail card and employee list.

### SQL Queries

**DDL — create Departments table and add DeptID to Employees**
```sql
CREATE TABLE Departments (
  DeptID          INT           IDENTITY(1,1) PRIMARY KEY,
  DepartmentName  NVARCHAR(100) NOT NULL UNIQUE,
  Description     NVARCHAR(500) NULL
);

ALTER TABLE Employees
  ADD DeptID INT NULL
  CONSTRAINT FK_Employees_Departments FOREIGN KEY REFERENCES Departments(DeptID);
```

**Migration — seed Departments from existing Department names and back-fill Employees.DeptID**
```sql
INSERT INTO Departments (DepartmentName)
SELECT DISTINCT Department FROM Employees WHERE Department IS NOT NULL;

UPDATE e
SET e.DeptID = d.DeptID
FROM Employees e
JOIN Departments d ON e.Department = d.DepartmentName;

ALTER TABLE Employees
  ALTER COLUMN DeptID INT NOT NULL;
```

**Fetch department details**
```sql
SELECT DeptID, DepartmentName, Description
FROM Departments
WHERE DeptID = @DeptID;
```

**Fetch active employees for a department**
```sql
SELECT EmployeeId, FirstName, LastName, JobTitle, HireDate
FROM Employees
WHERE DeptID = @DeptID AND IsActive = 1
ORDER BY LastName, FirstName;
```

### Out of Scope
- Creating, editing, or deleting departments via the UI
- Filtering the employee directory by department
- Removing the `Department` (text) column from `Employees`
- Pagination on the department employee list
- Showing inactive employees on the department page

---

## Feature 6: Ticket Generation Page

### Goal
Allow users to raise HR or IT tickets from a dedicated Tickets page, capturing all required information in a single form.

### Acceptance Criteria

**Happy path**
- [ ] A **Tickets** link appears in the top navigation bar
- [ ] Clicking it navigates to `/tickets`
- [ ] The page shows a list of all existing tickets (TicketID, Name, Type, Priority, Status, Department, Raised By)
- [ ] A **Raise Ticket** button opens a form
- [ ] The form has the following required fields: Ticket Name, Description, Ticket Type (HR / IT), Raised By (employee name — free text), Department (dropdown from existing departments), Priority (Low / Medium / High), Status (Open / In Progress / Resolved)
- [ ] Submitting a valid form saves the ticket to the database and shows it in the list immediately without a page reload
- [ ] A generated **Ticket ID** (e.g. `T-12`) is shown for each ticket in the list

**Edge cases**
- [ ] Submitting with any required field empty shows a field-level error message
- [ ] If the API call fails, an error message is shown: "Failed to raise ticket"
- [ ] If there are no tickets yet, the page shows: "No tickets raised yet."

**UI behavior**
- [ ] A loading state is shown while tickets are being fetched
- [ ] The form shows a loading/submitting state on the Submit button while the request is in flight
- [ ] Closing the form (Cancel / X) discards the input without saving

### Data Contract

**New table — `Tickets`**

| Column | TS Type | SQL Type | Required | Notes |
|---|---|---|---|---|
| `TicketID` | `number` | `INT IDENTITY(1,1) PK` | yes | auto-generated |
| `TicketName` | `string` | `NVARCHAR(200) NOT NULL` | yes | |
| `Description` | `string` | `NVARCHAR(1000) NOT NULL` | yes | |
| `TicketType` | `'HR' \| 'IT'` | `NVARCHAR(10) NOT NULL` | yes | |
| `RaisedBy` | `string` | `NVARCHAR(200) NOT NULL` | yes | free text — employee name |
| `DeptID` | `number` | `INT NOT NULL FK → Departments.DeptID` | yes | |
| `Priority` | `'Low' \| 'Medium' \| 'High'` | `NVARCHAR(10) NOT NULL` | yes | |
| `Status` | `'Open' \| 'In Progress' \| 'Resolved'` | `NVARCHAR(20) NOT NULL` | yes | default `'Open'` |
| `CreatedAt` | `string` | `DATETIME NOT NULL DEFAULT GETDATE()` | yes | auto-set |

**TypeScript types (add to `types/employee.ts`)**

```ts
type TicketType = 'HR' | 'IT'
type TicketPriority = 'Low' | 'Medium' | 'High'
type TicketStatus = 'Open' | 'In Progress' | 'Resolved'

interface Ticket {
  TicketID: number
  TicketName: string
  Description: string
  TicketType: TicketType
  RaisedBy: string
  DeptID: number
  DepartmentName: string
  Priority: TicketPriority
  Status: TicketStatus
  CreatedAt: string
}

interface NewTicketPayload {
  TicketName: string
  Description: string
  TicketType: TicketType
  RaisedBy: string
  DeptID: number
  Priority: TicketPriority
  Status: TicketStatus
}
```

### API Contract

**GET `/api/tickets`**
- Returns all tickets ordered by newest first.
- Success `200`: `{ data: Ticket[], error: null }`
- Server error `500`: `{ data: null, error: 'Failed to fetch tickets' }`

**POST `/api/tickets`**
- Creates a new ticket.
- Request body: `NewTicketPayload`
- Success `201`: `{ data: Ticket, error: null }`
- Validation error `400`: `{ data: null, error: 'All fields are required' }`
- Server error `500`: `{ data: null, error: 'Failed to raise ticket' }`

### UI Behavior

1. **Nav bar** — add a **Tickets** link to `app/layout.tsx` pointing to `/tickets`.
2. **`app/tickets/page.tsx`** — client page that:
   - Fetches all tickets from `GET /api/tickets` on load
   - Shows a loading state while fetching
   - Renders a **Raise Ticket** button at the top right
   - Renders a ticket list table: Ticket ID, Name, Type badge, Priority badge, Status badge, Department, Raised By, Created At
   - Shows "No tickets raised yet." when the list is empty
3. **`components/raise-ticket-modal.tsx`** — client modal component with the ticket form:
   - Fields: Ticket Name (text), Description (textarea), Ticket Type (HR / IT select), Raised By (text), Department (dropdown populated from `GET /api/departments`), Priority (Low / Medium / High select), Status (Open / In Progress / Resolved select — defaults to Open)
   - Validates all fields on submit
   - On success, calls `onSuccess(newTicket)` to update the list and closes
   - Cancel / X closes without saving

### SQL Queries

**DDL — create Tickets table**
```sql
CREATE TABLE Tickets (
  TicketID    INT            IDENTITY(1,1) PRIMARY KEY,
  TicketName  NVARCHAR(200)  NOT NULL,
  Description NVARCHAR(1000) NOT NULL,
  TicketType  NVARCHAR(10)   NOT NULL,
  RaisedBy    NVARCHAR(200)  NOT NULL,
  DeptID      INT            NOT NULL CONSTRAINT FK_Tickets_Departments FOREIGN KEY REFERENCES Departments(DeptID),
  Priority    NVARCHAR(10)   NOT NULL,
  Status      NVARCHAR(20)   NOT NULL DEFAULT 'Open',
  CreatedAt   DATETIME       NOT NULL DEFAULT GETDATE()
);
```

**GET /api/tickets — fetch all tickets**
```sql
SELECT t.TicketID, t.TicketName, t.Description, t.TicketType,
       t.RaisedBy, t.DeptID, d.DepartmentName,
       t.Priority, t.Status, t.CreatedAt
FROM Tickets t
JOIN Departments d ON t.DeptID = d.DeptID
ORDER BY t.CreatedAt DESC;
```

**POST /api/tickets — insert new ticket**
```sql
INSERT INTO Tickets (TicketName, Description, TicketType, RaisedBy, DeptID, Priority, Status)
OUTPUT INSERTED.TicketID, INSERTED.TicketName, INSERTED.Description, INSERTED.TicketType,
       INSERTED.RaisedBy, INSERTED.DeptID, INSERTED.Priority, INSERTED.Status, INSERTED.CreatedAt
VALUES (@TicketName, @Description, @TicketType, @RaisedBy, @DeptID, @Priority, @Status);
```

### Out of Scope
- Editing or deleting tickets
- Assigning tickets to specific employees
- Ticket comments or activity log
- Email notifications on ticket creation
- Filtering or searching tickets by type/status/priority
