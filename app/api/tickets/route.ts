import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import type { Ticket, NewTicketPayload } from '@/types/employee'

export async function GET(): Promise<NextResponse> {
  try {
    const pool = await getPool()
    const result = await pool.request().query<Ticket>(`
      SELECT t.TicketID, t.TicketName, t.Description, t.TicketType,
             t.RaisedBy, t.EmployeeId, t.DeptID, d.DepartmentName,
             t.Priority, t.Status, t.CreatedAt
      FROM Tickets t
      JOIN Departments d ON t.DeptID = d.DeptID
      ORDER BY t.CreatedAt DESC
    `)
    return NextResponse.json({ data: result.recordset, error: null }, { status: 200 })
  } catch (err) {
    console.error('GET /api/tickets', err)
    return NextResponse.json({ data: null, error: 'Failed to fetch tickets' }, { status: 500 })
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as Partial<NewTicketPayload>
    const { TicketName, Description, TicketType, EmployeeId, DeptID, Priority, Status } = body

    if (!TicketName || !Description || !TicketType || !EmployeeId || !DeptID || !Priority || !Status) {
      return NextResponse.json({ data: null, error: 'All fields are required' }, { status: 400 })
    }

    const pool = await getPool()

    const empResult = await pool
      .request()
      .input('EmployeeId', EmployeeId)
      .query<{ FirstName: string; LastName: string }>(
        'SELECT FirstName, LastName FROM Employees WHERE EmployeeId = @EmployeeId AND IsActive = 1'
      )

    if (empResult.recordset.length === 0) {
      return NextResponse.json({ data: null, error: 'Employee not found' }, { status: 400 })
    }

    const { FirstName, LastName } = empResult.recordset[0]
    const raisedBy = `${FirstName} ${LastName}`

    const insertResult = await pool
      .request()
      .input('TicketName', TicketName)
      .input('Description', Description)
      .input('TicketType', TicketType)
      .input('RaisedBy', raisedBy)
      .input('EmployeeId', EmployeeId)
      .input('DeptID', DeptID)
      .input('Priority', Priority)
      .input('Status', Status)
      .query<Omit<Ticket, 'DepartmentName'>>(`
        INSERT INTO Tickets (TicketName, Description, TicketType, RaisedBy, EmployeeId, DeptID, Priority, Status)
        OUTPUT INSERTED.TicketID, INSERTED.TicketName, INSERTED.Description, INSERTED.TicketType,
               INSERTED.RaisedBy, INSERTED.EmployeeId, INSERTED.DeptID,
               INSERTED.Priority, INSERTED.Status, INSERTED.CreatedAt
        VALUES (@TicketName, @Description, @TicketType, @RaisedBy, @EmployeeId, @DeptID, @Priority, @Status)
      `)

    const inserted = insertResult.recordset[0]

    const deptResult = await pool
      .request()
      .input('DeptID', inserted.DeptID)
      .query<{ DepartmentName: string }>('SELECT DepartmentName FROM Departments WHERE DeptID = @DeptID')

    const ticket: Ticket = {
      ...inserted,
      DepartmentName: deptResult.recordset[0]?.DepartmentName ?? '',
    }

    return NextResponse.json({ data: ticket, error: null }, { status: 201 })
  } catch (err) {
    console.error('POST /api/tickets', err)
    return NextResponse.json({ data: null, error: 'Failed to raise ticket' }, { status: 500 })
  }
}
