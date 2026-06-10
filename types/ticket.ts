export interface Ticket {
  TicketId: number
  Title: string
  Description: string | null
  EmployeeId: number
  EmployeeFullName: string
  DepartmentName: string
  Status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  Priority: 'Low' | 'Medium' | 'High'
  CreatedDate: string
}

export type TicketStatus = Ticket['Status']
export type TicketPriority = Ticket['Priority']
