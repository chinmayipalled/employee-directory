import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import type { Ticket } from '@/types/employee'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const ticketId = parseInt(params.id, 10)

  if (isNaN(ticketId)) {
    return NextResponse.json({ data: null, error: 'Invalid ticket ID' }, { status: 400 })
  }

  try {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('TicketID', ticketId)
      .query<Ticket>(`
        SELECT t.TicketID, t.TicketName, t.Description, t.TicketType,
               t.RaisedBy, t.EmployeeId, t.DeptID, d.DepartmentName,
               t.Priority, t.Status, t.CreatedAt
        FROM Tickets t
        JOIN Departments d ON t.DeptID = d.DeptID
        WHERE t.TicketID = @TicketID
      `)

    if (result.recordset.length === 0) {
      return NextResponse.json({ data: null, error: 'Ticket not found' }, { status: 404 })
    }

    return NextResponse.json({ data: result.recordset[0], error: null }, { status: 200 })
  } catch (err) {
    console.error(`GET /api/tickets/${ticketId}`, err)
    return NextResponse.json({ data: null, error: 'Failed to load ticket' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const ticketId = parseInt(params.id, 10)

  if (isNaN(ticketId)) {
    return NextResponse.json({ data: null, error: 'Invalid ticket ID' }, { status: 400 })
  }

  try {
    const pool = await getPool()

    const existing = await pool
      .request()
      .input('TicketID', ticketId)
      .query('SELECT TicketID FROM Tickets WHERE TicketID = @TicketID')

    if (existing.recordset.length === 0) {
      return NextResponse.json({ data: null, error: 'Ticket not found' }, { status: 404 })
    }

    await pool
      .request()
      .input('TicketID', ticketId)
      .query('DELETE FROM Tickets WHERE TicketID = @TicketID')

    return NextResponse.json({ data: { TicketID: ticketId }, error: null }, { status: 200 })
  } catch (err) {
    console.error(`DELETE /api/tickets/${ticketId}`, err)
    return NextResponse.json({ data: null, error: 'Failed to delete ticket' }, { status: 500 })
  }
}
