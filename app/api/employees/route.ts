import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import type { Employee, NewEmployeePayload } from '@/types/employee'

export async function GET(): Promise<NextResponse> {
  try {
    const pool = await getPool()
    const result = await pool.request().query<Employee>(`
      SELECT
        e.EmployeeId, e.FirstName, e.LastName, e.Email,
        e.DepartmentId, d.DepartmentName,
        e.JobTitle, e.HireDate, e.IsActive
      FROM Employees e
      JOIN Departments d ON e.DepartmentId = d.DepartmentId
      WHERE e.IsActive = 1
      ORDER BY e.LastName, e.FirstName
    `)
    return NextResponse.json({ data: result.recordset, error: null }, { status: 200 })
  } catch (err) {
    console.error('GET /api/employees', err)
    return NextResponse.json({ data: null, error: 'Failed to fetch employees' }, { status: 500 })
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as Partial<NewEmployeePayload>
    const { FirstName, LastName, Email, DepartmentId, JobTitle, HireDate } = body

    if (!FirstName || !LastName || !Email || !DepartmentId || !JobTitle || !HireDate) {
      return NextResponse.json({ data: null, error: 'All fields are required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(Email)) {
      return NextResponse.json({ data: null, error: 'Invalid email format' }, { status: 400 })
    }

    const pool = await getPool()

    const duplicate = await pool.request()
      .input('Email', Email)
      .query('SELECT EmployeeId FROM Employees WHERE Email = @Email')

    if (duplicate.recordset.length > 0) {
      return NextResponse.json({ data: null, error: 'Email already in use.' }, { status: 409 })
    }

    const insert = await pool.request()
      .input('FirstName', FirstName)
      .input('LastName', LastName)
      .input('Email', Email)
      .input('DepartmentId', DepartmentId)
      .input('JobTitle', JobTitle)
      .input('HireDate', HireDate)
      .query<Employee>(`
        INSERT INTO Employees (FirstName, LastName, Email, DepartmentId, JobTitle, HireDate, IsActive)
        OUTPUT
          INSERTED.EmployeeId, INSERTED.FirstName, INSERTED.LastName, INSERTED.Email,
          INSERTED.DepartmentId, INSERTED.JobTitle, INSERTED.HireDate, INSERTED.IsActive
        VALUES (@FirstName, @LastName, @Email, @DepartmentId, @JobTitle, @HireDate, 1)
      `)

    const newEmployee = insert.recordset[0]
    const deptResult = await pool.request()
      .input('DepartmentId', DepartmentId)
      .query<{ DepartmentName: string }>('SELECT DepartmentName FROM Departments WHERE DepartmentId = @DepartmentId')

    const fullEmployee: Employee = {
      ...newEmployee,
      DepartmentName: deptResult.recordset[0]?.DepartmentName ?? '',
    }

    return NextResponse.json({ data: fullEmployee, error: null }, { status: 201 })
  } catch (err) {
    console.error('POST /api/employees', err)
    return NextResponse.json({ data: null, error: 'Failed to add employee' }, { status: 500 })
  }
}
