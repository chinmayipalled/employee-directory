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
    const result = await this.pool.request().query<EmployeeRow>(`
      SELECT
        e.EmployeeId, e.FirstName, e.LastName, e.Email,
        e.DepartmentId, d.DepartmentName,
        e.JobTitle, e.HireDate, e.IsActive
      FROM Employees e
      JOIN Departments d ON e.DepartmentId = d.DepartmentId
      WHERE e.IsActive = 1
      ORDER BY e.LastName, e.FirstName
    `)
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

    const duplicate = await this.pool.request()
      .input('Email', sql.NVarChar, Email)
      .query('SELECT EmployeeId FROM Employees WHERE Email = @Email')

    if (duplicate.recordset.length > 0) {
      throw new ConflictException('Email already in use')
    }

    const insert = await this.pool.request()
      .input('FirstName', sql.NVarChar, FirstName)
      .input('LastName', sql.NVarChar, LastName)
      .input('Email', sql.NVarChar, Email)
      .input('DepartmentId', sql.Int, DepartmentId)
      .input('JobTitle', sql.NVarChar, JobTitle)
      .input('HireDate', sql.NVarChar, HireDate)
      .query<{ EmployeeId: number }>(`
        INSERT INTO Employees (FirstName, LastName, Email, DepartmentId, JobTitle, HireDate, IsActive)
        OUTPUT INSERTED.EmployeeId
        VALUES (@FirstName, @LastName, @Email, @DepartmentId, @JobTitle, @HireDate, 1)
      `)

    const newId = insert.recordset[0].EmployeeId

    const full = await this.pool.request()
      .input('EmployeeId', sql.Int, newId)
      .query<EmployeeRow>(`
        SELECT
          e.EmployeeId, e.FirstName, e.LastName, e.Email,
          e.DepartmentId, d.DepartmentName,
          e.JobTitle, e.HireDate, e.IsActive
        FROM Employees e
        JOIN Departments d ON e.DepartmentId = d.DepartmentId
        WHERE e.EmployeeId = @EmployeeId
      `)

    return full.recordset[0]
  }

  async deactivate(id: number): Promise<{ EmployeeId: number }> {
    await this.pool.request()
      .input('EmployeeId', sql.Int, id)
      .query('UPDATE Employees SET IsActive = 0 WHERE EmployeeId = @EmployeeId')

    return { EmployeeId: id }
  }
}
