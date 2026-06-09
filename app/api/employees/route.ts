import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import type { Employee, NewEmployeePayload } from '@/types/employee'

export async function GET(): Promise<NextResponse> {
  try {
    const pool = await getPool()
    const result = await pool.request()
      .query<Employee>('SELECT * FROM Employees WHERE IsActive = 1 ORDER BY LastName, FirstName')

    return NextResponse.json({ data: result.recordset, error: null }, { status: 200 })
  } catch (err) {
    console.error('GET /api/employees', err)
    return NextResponse.json({ data: null, error: 'Failed to fetch employees' }, { status: 500 })
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as Partial<NewEmployeePayload>
    const { FirstName, LastName, Email, Department, JobTitle, HireDate } = body

    if (!FirstName || !LastName || !Email || !Department || !JobTitle || !HireDate) {
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
      .input('Department', Department)
      .input('JobTitle', JobTitle)
      .input('HireDate', HireDate)
      .query<Employee>(`
        INSERT INTO Employees (FirstName, LastName, Email, Department, JobTitle, HireDate, IsActive)
        OUTPUT INSERTED.*
        VALUES (@FirstName, @LastName, @Email, @Department, @JobTitle, @HireDate, 1)
      `)

    return NextResponse.json({ data: insert.recordset[0], error: null }, { status: 201 })
  } catch (err) {
    console.error('POST /api/employees', err)
    return NextResponse.json({ data: null, error: 'Failed to add employee' }, { status: 500 })
  }
}
