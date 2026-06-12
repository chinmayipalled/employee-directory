import { Injectable, Inject } from '@nestjs/common'
import * as sql from 'mssql'
import { SQL_POOL } from '../database/database.module'

interface TicketRow {
  TicketId: number
  Title: string
  Description: string
  Status: string
  Priority: string
  EmployeeId: number
  EmployeeFullName: string
  DepartmentName: string
  CreatedDate: string
}

@Injectable()
export class TicketsService {
  constructor(@Inject(SQL_POOL) private readonly pool: sql.ConnectionPool) {}

  async findAll(status?: string, priority?: string): Promise<TicketRow[]> {
    const request = this.pool.request()
    request.input('filterStatus', sql.NVarChar, status ?? null)
    request.input('filterPriority', sql.NVarChar, priority ?? null)

    const result = await request.query<TicketRow>(`
      SELECT
        t.TicketId, t.Title, t.Description, t.Status, t.Priority,
        t.EmployeeId,
        e.FirstName + ' ' + e.LastName AS EmployeeFullName,
        d.DepartmentName,
        t.CreatedDate
      FROM Tickets t
      JOIN Employees e ON t.EmployeeId = e.EmployeeId
      JOIN Departments d ON e.DepartmentId = d.DepartmentId
      WHERE
        (@filterStatus IS NULL OR t.Status = @filterStatus)
        AND (@filterPriority IS NULL OR t.Priority = @filterPriority)
      ORDER BY t.CreatedDate DESC
    `)
    return result.recordset
  }
}
