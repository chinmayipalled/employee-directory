import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import type { Employee } from '@/types/employee'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const employeeId = parseInt(params.id, 10)

  if (isNaN(employeeId)) {
    return NextResponse.json({ data: null, error: 'Invalid employee ID' }, { status: 400 })
  }

  try {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('EmployeeId', employeeId)
      .query<Employee>(`
        SELECT e.EmployeeId, e.FirstName, e.LastName, e.Email, e.Department,
               e.DeptID, e.JobTitle, e.HireDate, e.IsActive
        FROM Employees e
        WHERE e.EmployeeId = @EmployeeId
      `)

    if (result.recordset.length === 0) {
      return NextResponse.json({ data: null, error: 'Employee not found' }, { status: 404 })
    }

    return NextResponse.json({ data: result.recordset[0], error: null }, { status: 200 })
  } catch (err) {
    console.error(`GET /api/employees/${employeeId}`, err)
    return NextResponse.json({ data: null, error: 'Failed to fetch employee' }, { status: 500 })
  }
}

export async function PATCH(
  _request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const employeeId = parseInt(params.id)

  if (isNaN(employeeId)) {
    return NextResponse.json({ data: null, error: 'Invalid employee ID' }, { status: 400 })
  }

  try {
    const pool = await getPool()

    const existing = await pool.request()
      .input('EmployeeId', employeeId)
      .query('SELECT EmployeeId FROM Employees WHERE EmployeeId = @EmployeeId')

    if (existing.recordset.length === 0) {
      return NextResponse.json({ data: null, error: 'Employee not found' }, { status: 404 })
    }

    await pool.request()
      .input('EmployeeId', employeeId)
      .query('UPDATE Employees SET IsActive = 0 WHERE EmployeeId = @EmployeeId')

    return NextResponse.json({ data: { EmployeeId: employeeId }, error: null }, { status: 200 })
  } catch (err) {
    console.error(`PATCH /api/employees/${employeeId}`, err)
    return NextResponse.json({ data: null, error: 'Failed to deactivate employee' }, { status: 500 })
  }
}
