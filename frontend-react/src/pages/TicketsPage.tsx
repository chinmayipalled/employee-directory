import { useEffect, useState } from 'react'
import type { Ticket, TicketStatus, TicketPriority } from '@/types/ticket'
import TicketFilters from '@/components/TicketFilters'
import TicketTable from '@/components/TicketTable'

const API_URL = import.meta.env.VITE_API_URL as string

export default function TicketsPage(): JSX.Element {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [status, setStatus] = useState<TicketStatus | ''>('')
  const [priority, setPriority] = useState<TicketPriority | ''>('')

  useEffect(() => {
    async function loadTickets(): Promise<void> {
      setIsLoading(true)
      setFetchError(null)
      try {
        const params = new URLSearchParams()
        if (status) params.set('status', status)
        if (priority) params.set('priority', priority)
        const query = params.toString() ? `?${params.toString()}` : ''

        const res = await fetch(`${API_URL}/tickets${query}`)
        if (!res.ok) {
          const body = await res.json().catch(() => ({})) as { message?: string }
          setFetchError(body.message ?? 'Failed to load tickets')
          return
        }
        const data: Ticket[] = await res.json()
        setTickets(data)
      } catch {
        setFetchError('Failed to load tickets')
      } finally {
        setIsLoading(false)
      }
    }
    loadTickets()
  }, [status, priority])

  return (
    <main className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-500 mt-1">All support tickets across departments</p>
        </div>

        <div className="mb-6">
          <TicketFilters
            status={status}
            priority={priority}
            onStatusChange={setStatus}
            onPriorityChange={setPriority}
          />
        </div>

        {isLoading && (
          <div className="text-center py-20 text-gray-400">Loading tickets…</div>
        )}

        {!isLoading && fetchError && (
          <div className="text-center py-20 text-red-500">{fetchError}</div>
        )}

        {!isLoading && !fetchError && (
          <TicketTable tickets={tickets} />
        )}
      </div>
    </main>
  )
}
