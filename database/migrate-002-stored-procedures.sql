USE EmployeeDirectory;
GO

-- =============================================
-- usp_GetActiveEmployees
-- Returns all active employees with department name, ordered by last/first name.
-- =============================================
CREATE OR ALTER PROCEDURE usp_GetActiveEmployees
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        e.EmployeeId,
        e.FirstName,
        e.LastName,
        e.Email,
        e.DepartmentId,
        d.DepartmentName,
        e.JobTitle,
        e.HireDate,
        e.IsActive
    FROM Employees e
    JOIN Departments d ON e.DepartmentId = d.DepartmentId
    WHERE e.IsActive = 1
    ORDER BY e.LastName, e.FirstName;
END;
GO

-- =============================================
-- usp_CreateEmployee
-- Validates no duplicate email, inserts the employee, returns the full row.
-- Raises error 50001 (severity 16) on duplicate email.
-- =============================================
CREATE OR ALTER PROCEDURE usp_CreateEmployee
    @FirstName   NVARCHAR(100),
    @LastName    NVARCHAR(100),
    @Email       NVARCHAR(255),
    @DepartmentId INT,
    @JobTitle    NVARCHAR(100),
    @HireDate    DATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM Employees WHERE Email = @Email)
    BEGIN
        RAISERROR('Email already in use', 16, 1);
        RETURN;
    END;

    DECLARE @NewId INT;

    INSERT INTO Employees (FirstName, LastName, Email, DepartmentId, JobTitle, HireDate, IsActive)
    VALUES (@FirstName, @LastName, @Email, @DepartmentId, @JobTitle, @HireDate, 1);

    SET @NewId = SCOPE_IDENTITY();

    SELECT
        e.EmployeeId,
        e.FirstName,
        e.LastName,
        e.Email,
        e.DepartmentId,
        d.DepartmentName,
        e.JobTitle,
        e.HireDate,
        e.IsActive
    FROM Employees e
    JOIN Departments d ON e.DepartmentId = d.DepartmentId
    WHERE e.EmployeeId = @NewId;
END;
GO

-- =============================================
-- usp_DeactivateEmployee
-- Sets IsActive = 0 for the given employee.
-- =============================================
CREATE OR ALTER PROCEDURE usp_DeactivateEmployee
    @EmployeeId INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Employees
    SET IsActive = 0
    WHERE EmployeeId = @EmployeeId;
END;
GO

-- =============================================
-- usp_GetDepartments
-- Returns all departments with active employee count, ordered by name.
-- =============================================
CREATE OR ALTER PROCEDURE usp_GetDepartments
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        d.DepartmentId,
        d.DepartmentName,
        COUNT(e.EmployeeId) AS ActiveEmployeeCount
    FROM Departments d
    LEFT JOIN Employees e ON e.DepartmentId = d.DepartmentId AND e.IsActive = 1
    GROUP BY d.DepartmentId, d.DepartmentName
    ORDER BY d.DepartmentName;
END;
GO

-- =============================================
-- usp_GetTickets
-- Returns tickets with optional status and priority filters.
-- NULL parameter means no filter on that column.
-- =============================================
CREATE OR ALTER PROCEDURE usp_GetTickets
    @FilterStatus   NVARCHAR(50)  = NULL,
    @FilterPriority NVARCHAR(20)  = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        t.TicketId,
        t.Title,
        t.Description,
        t.Status,
        t.Priority,
        t.EmployeeId,
        e.FirstName + ' ' + e.LastName AS EmployeeFullName,
        d.DepartmentName,
        t.CreatedDate
    FROM Tickets t
    JOIN Employees e ON t.EmployeeId = e.EmployeeId
    JOIN Departments d ON e.DepartmentId = d.DepartmentId
    WHERE
        (@FilterStatus   IS NULL OR t.Status   = @FilterStatus)
        AND (@FilterPriority IS NULL OR t.Priority = @FilterPriority)
    ORDER BY t.CreatedDate DESC;
END;
GO
