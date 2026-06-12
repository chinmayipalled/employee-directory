# Employee Directory

A full-stack Employee Directory app with a **NestJS REST API backend** and a **Next.js 14 frontend**. Manages employees, departments, and support tickets with a relational SQL Server schema.

## Architecture

```
┌─────────────────────────────────┐     ┌────────────────────────────────┐
│  frontend/  (Next.js 14)        │────▶│  backend/  (NestJS)            │
│  http://localhost:3000          │     │  http://localhost:3001          │
│                                 │     │                                 │
│  app/page.tsx         (/)       │     │  GET  /employees                │
│  app/departments/page.tsx       │     │  POST /employees                │
│  app/tickets/page.tsx           │     │  PATCH /employees/:id           │
│  components/                    │     │  GET  /departments              │
│  types/                         │     │  GET  /tickets                  │
└─────────────────────────────────┘     └──────────────┬─────────────────┘
                                                       │
                                               ┌───────▼───────┐
                                               │  SQL Server   │
                                               │  EmployeeDir  │
                                               └───────────────┘
```

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
| Frontend | Next.js 14 — App Router, TypeScript, Tailwind CSS |
| Backend | NestJS 10 — modules, controllers, services, DI |
| Database | SQL Server via `mssql` npm package — no ORM, parameterized queries only |
| Language | TypeScript strict mode throughout, zero `any` |

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
- SQL Server (any edition) with TCP enabled on port 1433
- Mixed-mode authentication enabled on the SQL Server instance

## Getting Started

### 1. Create the database and schema

Run `database/setup.sql` in SSMS — creates the `Employees` table and inserts 10 sample rows.

Then run `database/migrate-001-departments-tickets.sql` — creates `Departments` and `Tickets` tables, migrates existing employee department data to FK references, and inserts 10 sample tickets.

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

### 3. Configure backend environment

Create `backend/.env`:

```
DB_SERVER=localhost
DB_NAME=EmployeeDirectory
DB_PORT=1433
DB_USER=emp_app
DB_PASSWORD=your_password
```

### 4. Configure frontend environment

Create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 5. Install and run

**Terminal 1 — Backend (NestJS on port 3001):**
```bash
cd backend
npm install
npm run start:dev
```

**Terminal 2 — Frontend (Next.js on port 3000):**
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
employee-directory/
├── backend/                          # NestJS REST API
│   ├── src/
│   │   ├── main.ts                   # bootstrap, CORS config
│   │   ├── app.module.ts             # root module
│   │   ├── database/
│   │   │   └── database.module.ts   # global SQL pool provider
│   │   ├── employees/
│   │   │   ├── dto/create-employee.dto.ts
│   │   │   ├── employees.controller.ts
│   │   │   ├── employees.module.ts
│   │   │   └── employees.service.ts
│   │   ├── departments/
│   │   │   ├── departments.controller.ts
│   │   │   ├── departments.module.ts
│   │   │   └── departments.service.ts
│   │   └── tickets/
│   │       ├── tickets.controller.ts
│   │       ├── tickets.module.ts
│   │       └── tickets.service.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/                         # Next.js 14 App Router
│   ├── app/
│   │   ├── layout.tsx               # root layout — includes NavBar
│   │   ├── page.tsx                 # / — Employees page
│   │   ├── departments/
│   │   │   ├── page.tsx             # /departments
│   │   │   └── loading.tsx
│   │   └── tickets/
│   │       └── page.tsx             # /tickets
│   ├── components/
│   │   ├── nav-bar.tsx
│   │   ├── employee-table.tsx
│   │   ├── search-input.tsx
│   │   ├── add-employee-modal.tsx
│   │   ├── deactivate-dialog.tsx
│   │   ├── department-table.tsx
│   │   ├── ticket-table.tsx
│   │   └── ticket-filters.tsx
│   ├── types/
│   │   ├── employee.ts
│   │   ├── department.ts
│   │   └── ticket.ts
│   └── package.json
└── database/
    ├── setup.sql                     # initial schema + seed data
    └── migrate-001-departments-tickets.sql
```

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employees` | List all active employees (with DepartmentName via JOIN) |
| POST | `/employees` | Add a new employee |
| PATCH | `/employees/:id` | Deactivate an employee (sets IsActive = 0) |
| GET | `/departments` | List all departments with active employee count |
| GET | `/tickets` | List tickets; optional `?status=` and `?priority=` query params |
