import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import type { Department } from '@/types/department'

export async function GET(): Promise<NextResponse> {
  try {
    const pool = await getPool()
    const result = await pool.request().query<Department>(`
      SELECT
        d.DepartmentId,
        d.DepartmentName,
        COUNT(e.EmployeeId) AS EmployeeCount
      FROM Departments d
      LEFT JOIN Employees e
        ON e.DepartmentId = d.DepartmentId AND e.IsActive = 1
      GROUP BY d.DepartmentId, d.DepartmentName
      ORDER BY d.DepartmentName
    `)
    return NextResponse.json({ data: result.recordset, error: null }, { status: 200 })
  } catch (err) {
    console.error('GET /api/departments', err)
    return NextResponse.json({ data: null, error: 'Failed to fetch departments' }, { status: 500 })
  }
}
