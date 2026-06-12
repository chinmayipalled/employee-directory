import type { TicketStatus, TicketPriority } from '@/types/ticket'

interface TicketFiltersProps {
  status: TicketStatus | ''
  priority: TicketPriority | ''
  onStatusChange: (value: TicketStatus | '') => void
  onPriorityChange: (value: TicketPriority | '') => void
}

const STATUS_OPTIONS: TicketStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed']
const PRIORITY_OPTIONS: TicketPriority[] = ['Low', 'Medium', 'High']

export default function TicketFilters({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
}: TicketFiltersProps): JSX.Element {
  return (
    <div className="flex flex-wrap gap-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as TicketStatus | '')}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
          Priority
        </label>
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value as TicketPriority | '')}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All priorities</option>
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
