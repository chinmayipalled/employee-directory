import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common'
import { EmployeesService } from './employees.service'
import { CreateEmployeeDto } from './dto/create-employee.dto'

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  findAll() {
    return this.employeesService.findAll()
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeesService.create(dto)
  }

  @Patch(':id')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.deactivate(id)
  }
}
