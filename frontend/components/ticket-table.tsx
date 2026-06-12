import type { Ticket, TicketStatus, TicketPriority } from '@/types/ticket'

const STATUS_STYLES: Record<TicketStatus, string> = {
  'Open':        'bg-blue-100 text-blue-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  'Resolved':    'bg-green-100 text-green-800',
  'Closed':      'bg-gray-100 text-gray-600',
}

const PRIORITY_STYLES: Record<TicketPriority, string> = {
  'High':   'bg-red-100 text-red-800',
  'Medium': 'bg-orange-100 text-orange-800',
  'Low':    'bg-green-100 text-green-800',
}

interface TicketTableProps {
  tickets: Ticket[]
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function TicketTable({ tickets }: TicketTableProps): JSX.Element {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">No tickets found.</div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Title', 'Assigned Employee', 'Department', 'Status', 'Priority', 'Created'].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {tickets.map((ticket) => (
            <tr key={ticket.TicketId} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
                {ticket.Title}
              </td>
              <td className="px-6 py-4 text-gray-600">{ticket.EmployeeFullName}</td>
              <td className="px-6 py-4 text-gray-600">{ticket.DepartmentName}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[ticket.Status]}`}>
                  {ticket.Status}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_STYLES[ticket.Priority]}`}>
                  {ticket.Priority}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500">{formatDate(ticket.CreatedDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
