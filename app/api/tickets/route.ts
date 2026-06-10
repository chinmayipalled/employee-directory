import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import type { Ticket, TicketStatus, TicketPriority } from '@/types/ticket'

const VALID_STATUSES: TicketStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed']
const VALID_PRIORITIES: TicketPriority[] = ['Low', 'Medium', 'High']

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') ?? undefined
  const priority = searchParams.get('priority') ?? undefined

  if (status && !VALID_STATUSES.includes(status as TicketStatus)) {
    return NextResponse.json({ data: null, error: 'Invalid status value' }, { status: 400 })
  }
  if (priority && !VALID_PRIORITIES.includes(priority as TicketPriority)) {
    return NextResponse.json({ data: null, error: 'Invalid priority value' }, { status: 400 })
  }

  try {
    const pool = await getPool()
    const req = pool.request()
    let where = 'WHERE 1=1'

    if (status) {
      req.input('Status', status)
      where += ' AND t.Status = @Status'
    }
    if (priority) {
      req.input('Priority', priority)
      where += ' AND t.Priority = @Priority'
    }

    const result = await req.query<Ticket>(`
      SELECT
        t.TicketId,
        t.Title,
        t.Description,
        t.EmployeeId,
        e.FirstName + ' ' + e.LastName AS EmployeeFullName,
        d.DepartmentName,
        t.Status,
        t.Priority,
        CONVERT(NVARCHAR, t.CreatedDate, 23) AS CreatedDate
      FROM Tickets t
      JOIN Employees e ON t.EmployeeId = e.EmployeeId
      JOIN Departments d ON e.DepartmentId = d.DepartmentId
      ${where}
      ORDER BY t.CreatedDate DESC
    `)

    return NextResponse.json({ data: result.recordset, error: null }, { status: 200 })
  } catch (err) {
    console.error('GET /api/tickets', err)
    return NextResponse.json({ data: null, error: 'Failed to fetch tickets' }, { status: 500 })
  }
}
