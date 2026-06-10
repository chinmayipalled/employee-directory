# Employee Directory

A multi-page Employee Directory web app built with Next.js 14, TypeScript, Tailwind CSS, and SQL Server. Manages employees, departments, and support tickets with a relational schema.

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Employees | `/` | View, search, add, and deactivate employees |
| Departments | `/departments` | View all departments with active employee counts |
| Tickets | `/tickets` | View and filter support tickets by status and priority |

## Features

### Employees
- View all active employees — Full Name, Department, Job Title, Hire Date, status badge
- Real-time search by name as you type (client-side, no reload)
- Add employee via modal form with department dropdown
- Deactivate employee via confirmation dialog (record is never deleted, only marked inactive)

### Departments
- View all departments with active employee count per department
- Departments with zero employees are shown

### Tickets
- View all tickets with Assigned Employee, Department (via join), Status, and Priority
- Filter by **Status** — Open, In Progress, Resolved, Closed
- Filter by **Priority** — Low, Medium, High
- Both filters apply simultaneously
- Color-coded badges for Status and Priority

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 — App Router |
| Language | TypeScript (strict, zero `any`) |
| Styling | Tailwind CSS |
| Database | SQL Server via `mssql` — no ORM, parameterized queries only |

## Database Schema

```
Departments        Employees              Tickets
─────────────      ────────────────────   ──────────────────
DepartmentId  ──── DepartmentId (FK)      TicketId
DepartmentName     EmployeeId        ──── EmployeeId (FK)
                   FirstName              Title
                   LastName               Description
                   Email                  Status
                   JobTitle               Priority
                   HireDate               CreatedDate
                   IsActive
```

## Prerequisites

- Node.js 18+
- SQL Server (any edition) with TCP enabled
- Mixed-mode authentication enabled on the SQL Server instance

## Getting Started

### 1. Create the database and schema

Run `database/setup.sql` in SSMS — creates the `Employees` table and inserts 10 sample rows.

Then run `database/migrate-001-departments-tickets.sql` — creates `Departments` and `Tickets` tables, migrates existing employee department data to use FK references, and inserts 10 sample tickets.

### 2. Enable SQL Server auth and create an app login

If SQL Server is Windows-auth only, enable mixed-mode first (requires service restart), then:

```sql
CREATE LOGIN emp_app WITH PASSWORD = 'your_password';
USE EmployeeDirectory;
CREATE USER emp_app FOR LOGIN emp_app;
ALTER ROLE db_datareader ADD MEMBER emp_app;
ALTER ROLE db_datawriter ADD MEMBER emp_app;
GRANT SELECT ON Departments TO emp_app;
GRANT SELECT ON Tickets TO emp_app;
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```
DB_SERVER=localhost
DB_NAME=EmployeeDirectory
DB_PORT=1433
DB_USER=emp_app
DB_PASSWORD=your_password
```

### 4. Install dependencies and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
employee-directory/
├── app/
│   ├── layout.tsx                    # root layout — includes NavBar
│   ├── page.tsx                      # / — Employees page
│   ├── departments/
│   │   ├── page.tsx                  # /departments
│   │   └── loading.tsx               # loading skeleton
│   ├── tickets/
│   │   └── page.tsx                  # /tickets
│   └── api/
│       ├── employees/
│       │   ├── route.ts              # GET (list), POST (add)
│       │   └── [id]/route.ts         # PATCH (deactivate)
│       ├── departments/
│       │   └── route.ts              # GET (list with employee count)
│       └── tickets/
│           └── route.ts              # GET (list, ?status and ?priority filters)
├── components/
│   ├── nav-bar.tsx                   # top navigation bar
│   ├── employee-table.tsx
│   ├── search-input.tsx
│   ├── add-employee-modal.tsx
│   ├── deactivate-dialog.tsx
│   ├── department-table.tsx
│   ├── ticket-table.tsx
│   └── ticket-filters.tsx
├── lib/
│   └── db.ts                         # mssql connection pool
├── types/
│   ├── employee.ts
│   ├── department.ts
│   └── ticket.ts
└── database/
    ├── setup.sql                     # initial schema + seed data
    └── migrate-001-departments-tickets.sql
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run type-check` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |
