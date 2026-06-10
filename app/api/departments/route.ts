import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import type { Department } from '@/types/employee'

export async function GET(): Promise<NextResponse> {
  try {
    const pool = await getPool()
    const result = await pool
      .request()
      .query<Department>(
        'SELECT DeptID, DepartmentName, Description FROM Departments ORDER BY DepartmentName'
      )
    return NextResponse.json({ data: result.recordset, error: null }, { status: 200 })
  } catch (err) {
    console.error('GET /api/departments', err)
    return NextResponse.json({ data: null, error: 'Failed to load departments' }, { status: 500 })
  }
}
