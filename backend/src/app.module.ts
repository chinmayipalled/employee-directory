import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import { EmployeesModule } from './employees/employees.module'
import { DepartmentsModule } from './departments/departments.module'
import { TicketsModule } from './tickets/tickets.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    EmployeesModule,
    DepartmentsModule,
    TicketsModule,
  ],
})
export class AppModule {}
