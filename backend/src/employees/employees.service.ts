import { Injectable, Inject, BadRequestException, ConflictException } from '@nestjs/common'
import * as sql from 'mssql'
import { SQL_POOL } from '../database/database.module'
import { CreateEmployeeDto } from './dto/create-employee.dto'

interface EmployeeRow {
  EmployeeId: number
  FirstName: string
  LastName: string
  Email: string
  DepartmentId: number
  DepartmentName: string
  JobTitle: string
  HireDate: string
  IsActive: boolean
}

@Injectable()
export class EmployeesService {
  constructor(@Inject(SQL_POOL) private readonly pool: sql.ConnectionPool) {}

  async findAll(): Promise<EmployeeRow[]> {
    const result = await this.pool.request().query<EmployeeRow>('EXEC usp_GetActiveEmployees')
    return result.recordset
  }

  async create(dto: CreateEmployeeDto): Promise<EmployeeRow> {
    const { FirstName, LastName, Email, DepartmentId, JobTitle, HireDate } = dto

    if (!FirstName || !LastName || !Email || !DepartmentId || !JobTitle || !HireDate) {
      throw new BadRequestException('All fields are required')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(Email)) {
      throw new BadRequestException('Invalid email format')
    }

    try {
      const result = await this.pool.request()
        .input('FirstName',    sql.NVarChar, FirstName)
        .input('LastName',     sql.NVarChar, LastName)
        .input('Email',        sql.NVarChar, Email)
        .input('DepartmentId', sql.Int,      DepartmentId)
        .input('JobTitle',     sql.NVarChar, JobTitle)
        .input('HireDate',     sql.NVarChar, HireDate)
        .query<EmployeeRow>(
          'EXEC usp_CreateEmployee @FirstName=@FirstName, @LastName=@LastName, @Email=@Email, @DepartmentId=@DepartmentId, @JobTitle=@JobTitle, @HireDate=@HireDate'
        )

      return result.recordset[0]
    } catch (err: unknown) {
      const sqlErr = err as { message?: string }
      if (sqlErr.message?.includes('Email already in use')) {
        throw new ConflictException('Email already in use')
      }
      throw err
    }
  }

  async deactivate(id: number): Promise<{ EmployeeId: number }> {
    await this.pool.request()
      .input('EmployeeId', sql.Int, id)
      .query('EXEC usp_DeactivateEmployee @EmployeeId=@EmployeeId')

    return { EmployeeId: id }
  }
}
