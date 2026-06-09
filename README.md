# Employee Directory

A single-page Employee Directory web app built with Next.js 14, TypeScript, Tailwind CSS, and SQL Server.

## Features

- **View employees** — all active employees load on page start with Full Name, Department, Job Title, Hire Date, and status badge
- **Search by name** — real-time client-side filter as you type, no page reload
- **Add employee** — modal form to add a new employee; appears in the table immediately after saving
- **Deactivate employee** — confirmation dialog marks the employee inactive; row disappears from the table (no record is ever deleted)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 — App Router |
| Language | TypeScript (strict, zero `any`) |
| Styling | Tailwind CSS |
| Database | SQL Server via `mssql` — no ORM |

## Prerequisites

- Node.js 18+
- SQL Server (any edition) with a database named `EmployeeDirectory`
- The `Employees` table created via `database/setup.sql`

## Getting Started

### 1. Create the database

Run `database/setup.sql` in SSMS or `sqlcmd` against your SQL Server instance. This creates the `Employees` table and inserts 10 sample rows.

### 2. Create a SQL login for the app

```sql
CREATE LOGIN emp_app WITH PASSWORD = 'your_password';
USE EmployeeDirectory;
CREATE USER emp_app FOR LOGIN emp_app;
ALTER ROLE db_datareader ADD MEMBER emp_app;
ALTER ROLE db_datawriter ADD MEMBER emp_app;
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
│   ├── page.tsx                  # single page — root UI
│   ├── layout.tsx
│   ├── globals.css
│   └── api/employees/
│       ├── route.ts              # GET (list), POST (add)
│       └── [id]/route.ts         # PATCH (deactivate)
├── components/
│   ├── employee-table.tsx
│   ├── search-input.tsx
│   ├── add-employee-modal.tsx
│   └── deactivate-dialog.tsx
├── lib/db.ts                     # mssql connection pool
├── types/employee.ts             # shared TypeScript interfaces
└── database/setup.sql            # DB setup script
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run type-check` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |
