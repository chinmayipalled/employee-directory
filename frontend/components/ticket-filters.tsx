'use client'

import type { TicketStatus, TicketPriority } from '@/types/ticket'

const STATUSES: TicketStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed']
const PRIORITIES: TicketPriority[] = ['Low', 'Medium', 'High']

interface TicketFiltersProps {
  status: TicketStatus | ''
  priority: TicketPriority | ''
  onStatusChange: (value: TicketStatus | '') => void
  onPriorityChange: (value: TicketPriority | '') => void
}

export default function TicketFilters({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
}: TicketFiltersProps): JSX.Element {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as TicketStatus | '')}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="">All Statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value as TicketPriority | '')}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="">All Priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  )
}
