import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import type { Department, DepartmentEmployee, DepartmentDetail } from '@/types/employee'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const deptId = parseInt(params.id, 10)

  if (isNaN(deptId)) {
    return NextResponse.json({ data: null, error: 'Department not found' }, { status: 404 })
  }

  try {
    const pool = await getPool()

    const deptResult = await pool
      .request()
      .input('DeptID', deptId)
      .query<Department>(
        'SELECT DeptID, DepartmentName, Description FROM Departments WHERE DeptID = @DeptID'
      )

    if (deptResult.recordset.length === 0) {
      return NextResponse.json({ data: null, error: 'Department not found' }, { status: 404 })
    }

    const employeeResult = await pool
      .request()
      .input('DeptID', deptId)
      .query<DepartmentEmployee>(
        `SELECT EmployeeId, FirstName, LastName, JobTitle, HireDate
         FROM Employees
         WHERE DeptID = @DeptID AND IsActive = 1
         ORDER BY LastName, FirstName`
      )

    const detail: DepartmentDetail = {
      ...deptResult.recordset[0],
      employees: employeeResult.recordset,
    }

    return NextResponse.json({ data: detail, error: null }, { status: 200 })
  } catch (err) {
    console.error('GET /api/departments/[id]', err)
    return NextResponse.json({ data: null, error: 'Failed to load department' }, { status: 500 })
  }
}
