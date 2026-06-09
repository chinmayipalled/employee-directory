-- ============================================================
-- Employee Directory — Database Setup
-- Run this entire script in SSMS once connected to your server
-- ============================================================

-- Step 1: Create the database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'EmployeeDirectory')
BEGIN
    CREATE DATABASE EmployeeDirectory;
END
GO

-- Step 2: Switch to the new database
USE EmployeeDirectory;
GO

-- Step 3: Create the Employees table
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_NAME = 'Employees'
)
BEGIN
    CREATE TABLE Employees (
        EmployeeId  INT           IDENTITY(1,1) PRIMARY KEY,
        FirstName   NVARCHAR(100) NOT NULL,
        LastName    NVARCHAR(100) NOT NULL,
        Email       NVARCHAR(255) NOT NULL UNIQUE,
        Department  NVARCHAR(100) NOT NULL,
        JobTitle    NVARCHAR(100) NOT NULL,
        HireDate    DATE          NOT NULL,
        IsActive    BIT           NOT NULL DEFAULT 1
    );
    PRINT 'Employees table created.';
END
ELSE
BEGIN
    PRINT 'Employees table already exists — skipping create.';
END
GO

-- Step 4: Insert 10 sample employees
-- (James is inactive on purpose to test the status badge and deactivate feature)
INSERT INTO Employees (FirstName, LastName, Email, Department, JobTitle, HireDate, IsActive)
VALUES
    ('Alice',   'Johnson',   'alice.johnson@company.com',   'Engineering',  'Software Engineer',    '2021-03-15', 1),
    ('Bob',     'Martinez',  'bob.martinez@company.com',    'Engineering',  'Senior Developer',     '2019-07-01', 1),
    ('Carol',   'Smith',     'carol.smith@company.com',     'HR',           'HR Manager',           '2018-01-10', 1),
    ('David',   'Lee',       'david.lee@company.com',       'Finance',      'Financial Analyst',    '2022-06-20', 1),
    ('Emma',    'Brown',     'emma.brown@company.com',      'Marketing',    'Marketing Specialist', '2020-11-05', 1),
    ('Frank',   'Wilson',    'frank.wilson@company.com',    'Engineering',  'DevOps Engineer',      '2021-09-12', 1),
    ('Grace',   'Taylor',    'grace.taylor@company.com',    'HR',           'Recruiter',            '2023-02-28', 1),
    ('Henry',   'Anderson',  'henry.anderson@company.com',  'Finance',      'Accountant',           '2017-04-14', 1),
    ('Isla',    'Thomas',    'isla.thomas@company.com',     'Marketing',    'Content Writer',       '2022-08-30', 1),
    ('James',   'Jackson',   'james.jackson@company.com',   'Engineering',  'QA Engineer',          '2020-05-18', 0);
GO

-- Step 5: Verify — should return 10 rows
SELECT
    EmployeeId,
    FirstName,
    LastName,
    Department,
    JobTitle,
    HireDate,
    CASE WHEN IsActive = 1 THEN 'Active' ELSE 'Inactive' END AS Status
FROM Employees
ORDER BY EmployeeId;
GO
