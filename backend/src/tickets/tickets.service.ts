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
    const result = await this.pool.request()
      .input('FilterStatus',   sql.NVarChar, status   ?? null)
      .input('FilterPriority', sql.NVarChar, priority ?? null)
      .query<TicketRow>(
        'EXEC usp_GetTickets @FilterStatus=@FilterStatus, @FilterPriority=@FilterPriority'
      )

    return result.recordset
  }
}
