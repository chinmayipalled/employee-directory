-- ============================================================
-- Migration 001: Departments + Tickets tables
-- Run this entire script in SSMS connected to EmployeeDirectory
-- ============================================================

USE EmployeeDirectory;
GO

-- ── Step 1: Create Departments table ────────────────────────
IF NOT EXISTS (
  SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Departments'
)
BEGIN
  CREATE TABLE Departments (
    DepartmentId   INT           IDENTITY(1,1) PRIMARY KEY,
    DepartmentName NVARCHAR(100) NOT NULL UNIQUE
  );
  PRINT 'Departments table created.';
END
ELSE
  PRINT 'Departments table already exists — skipping.';
GO

-- ── Step 2: Populate Departments from existing Employee data ─
IF NOT EXISTS (SELECT 1 FROM Departments)
BEGIN
  INSERT INTO Departments (DepartmentName)
  SELECT DISTINCT Department FROM Employees ORDER BY Department;
  PRINT 'Departments populated from Employees.Department.';
END
ELSE
  PRINT 'Departments already has rows — skipping insert.';
GO

-- ── Step 3: Add DepartmentId FK column to Employees ─────────
IF NOT EXISTS (
  SELECT * FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'Employees' AND COLUMN_NAME = 'DepartmentId'
)
BEGIN
  ALTER TABLE Employees ADD DepartmentId INT NULL;
  PRINT 'DepartmentId column added to Employees.';
END
ELSE
  PRINT 'DepartmentId column already exists — skipping.';
GO

-- ── Step 4: Backfill DepartmentId from Department text ───────
UPDATE e
SET e.DepartmentId = d.DepartmentId
FROM Employees e
JOIN Departments d ON e.Department = d.DepartmentName
WHERE e.DepartmentId IS NULL;
PRINT 'Employees.DepartmentId backfilled.';
GO

-- ── Step 5: Make DepartmentId NOT NULL ───────────────────────
ALTER TABLE Employees ALTER COLUMN DepartmentId INT NOT NULL;
PRINT 'DepartmentId set to NOT NULL.';
GO

-- ── Step 6: Add FK constraint ────────────────────────────────
IF NOT EXISTS (
  SELECT * FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
  WHERE CONSTRAINT_NAME = 'FK_Employees_Departments'
)
BEGIN
  ALTER TABLE Employees
    ADD CONSTRAINT FK_Employees_Departments
    FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId);
  PRINT 'FK_Employees_Departments constraint added.';
END
ELSE
  PRINT 'FK constraint already exists — skipping.';
GO

-- ── Step 7: Drop old Department text column ──────────────────
IF EXISTS (
  SELECT * FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'Employees' AND COLUMN_NAME = 'Department'
)
BEGIN
  ALTER TABLE Employees DROP COLUMN Department;
  PRINT 'Department text column dropped.';
END
ELSE
  PRINT 'Department column already gone — skipping.';
GO

-- ── Step 8: Create Tickets table ─────────────────────────────
IF NOT EXISTS (
  SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Tickets'
)
BEGIN
  CREATE TABLE Tickets (
    TicketId    INT            IDENTITY(1,1) PRIMARY KEY,
    Title       NVARCHAR(200)  NOT NULL,
    Description NVARCHAR(1000) NULL,
    EmployeeId  INT            NOT NULL,
    Status      NVARCHAR(50)   NOT NULL DEFAULT 'Open',
    Priority    NVARCHAR(20)   NOT NULL DEFAULT 'Medium',
    CreatedDate DATETIME       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Tickets_Employees
      FOREIGN KEY (EmployeeId) REFERENCES Employees(EmployeeId)
  );
  PRINT 'Tickets table created.';
END
ELSE
  PRINT 'Tickets table already exists — skipping.';
GO

-- ── Step 9: Insert sample tickets ────────────────────────────
IF NOT EXISTS (SELECT 1 FROM Tickets)
BEGIN
  INSERT INTO Tickets (Title, Description, EmployeeId, Status, Priority, CreatedDate)
  VALUES
    ('Fix login page crash',       'Users report 500 error on login',          1, 'Open',        'High',   '2026-05-01'),
    ('Update onboarding docs',     'HR requested new-hire guide update',        3, 'In Progress', 'Medium', '2026-05-03'),
    ('Budget report Q1',           'Finance needs Q1 summary by month-end',     4, 'Open',        'High',   '2026-05-05'),
    ('CI pipeline failing',        'Build breaks on feature branches',          6, 'In Progress', 'High',   '2026-05-07'),
    ('Write blog post on Next.js', NULL,                                        9, 'Open',        'Low',    '2026-05-10'),
    ('Refactor auth module',       'Remove legacy session handling',            2, 'Resolved',    'Medium', '2026-05-12'),
    ('Post Q2 job listings',       'Three open engineering roles',              7, 'Open',        'Medium', '2026-05-14'),
    ('Annual accounts review',     NULL,                                        8, 'Closed',      'Low',    '2026-05-15'),
    ('Deploy hotfix v2.1.1',       'Critical patch for prod',                   1, 'Resolved',    'High',   '2026-05-18'),
    ('SEO audit',                  'Review meta tags across all pages',         5, 'Open',        'Low',    '2026-05-20');
  PRINT '10 sample tickets inserted.';
END
ELSE
  PRINT 'Tickets already has rows — skipping.';
GO

-- ── Verify ───────────────────────────────────────────────────
SELECT 'Departments' AS TableName, COUNT(*) AS Rows FROM Departments
UNION ALL
SELECT 'Employees',                COUNT(*)          FROM Employees
UNION ALL
SELECT 'Tickets',                  COUNT(*)          FROM Tickets;
GO

SELECT e.EmployeeId, e.FirstName, e.LastName, d.DepartmentName
FROM Employees e
JOIN Departments d ON e.DepartmentId = d.DepartmentId
ORDER BY e.EmployeeId;
GO
