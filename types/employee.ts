export interface Employee {
  EmployeeId: number
  FirstName: string
  LastName: string
  Email: string
  Department: string
  DeptID: number
  JobTitle: string
  HireDate: string
  IsActive: boolean
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface NewEmployeePayload {
  FirstName: string
  LastName: string
  Email: string
  Department: string
  JobTitle: string
  HireDate: string
}

export interface Department {
  DeptID: number
  DepartmentName: string
  Description: string | null
}

export interface DepartmentEmployee {
  EmployeeId: number
  FirstName: string
  LastName: string
  JobTitle: string
  HireDate: string
}

export interface DepartmentDetail extends Department {
  employees: DepartmentEmployee[]
}

export type TicketType = 'HR' | 'IT'
export type TicketPriority = 'Low' | 'Medium' | 'High'
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved'

export interface Ticket {
  TicketID: number
  TicketName: string
  Description: string
  TicketType: TicketType
  RaisedBy: string
  EmployeeId: number
  DeptID: number
  DepartmentName: string
  Priority: TicketPriority
  Status: TicketStatus
  CreatedAt: string
}

export interface NewTicketPayload {
  TicketName: string
  Description: string
  TicketType: TicketType
  EmployeeId: number
  DeptID: number
  Priority: TicketPriority
  Status: TicketStatus
}
