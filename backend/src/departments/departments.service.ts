import { Injectable, Inject } from '@nestjs/common'
import * as sql from 'mssql'
import { SQL_POOL } from '../database/database.module'

interface DepartmentRow {
  DepartmentId: number
  DepartmentName: string
  ActiveEmployeeCount: number
}

@Injectable()
export class DepartmentsService {
  constructor(@Inject(SQL_POOL) private readonly pool: sql.ConnectionPool) {}

  async findAll(): Promise<DepartmentRow[]> {
    const result = await this.pool.request().query<DepartmentRow>('EXEC usp_GetDepartments')
    return result.recordset
  }
}
