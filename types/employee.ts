export interface Employee {
  EmployeeId: number
  FirstName: string
  LastName: string
  Email: string
  Department: string
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
