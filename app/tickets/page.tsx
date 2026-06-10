'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Ticket, ApiResponse } from '@/types/employee'
import RaiseTicketModal from '@/components/raise-ticket-modal'

const PRIORITY_STYLES: Record<string, string> = {
  Low: 'bg-gray-100 text-gray-700',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-700',
}

const STATUS_STYLES: Record<string, string> = {
  Open: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-orange-100 text-orange-700',
  Resolved: 'bg-green-100 text-green-700',
}

const TYPE_STYLES: Record<string, string> = {
  HR: 'bg-purple-100 text-purple-700',
  IT: 'bg-cyan-100 text-cyan-700',
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function TicketsPage(): JSX.Element {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function loadTickets(): Promise<void> {
      try {
        const res = await fetch('/api/tickets')
        const { data, error }: ApiResponse<Ticket[]> = await res.json()
        if (error || !data) {
          setFetchError(error ?? 'Failed to fetch tickets')
          return
        }
        setTickets(data)
      } catch {
        setFetchError('Failed to fetch tickets')
      } finally {
        setIsLoading(false)
      }
    }
    loadTickets()
  }, [])

  function handleTicketCreated(ticket: Ticket): void {
    setTickets((prev) => [ticket, ...prev])
    setIsModalOpen(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
            <p className="text-gray-500 mt-1">HR and IT support tickets</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            + Raise Ticket
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-20 text-gray-400">Loading tickets…</div>
        )}

        {!isLoading && fetchError && (
          <div className="text-center py-20 text-red-500">{fetchError}</div>
        )}

        {!isLoading && !fetchError && tickets.length === 0 && (
          <div className="text-center py-20 text-gray-400">No tickets raised yet.</div>
        )}

        {!isLoading && !fetchError && tickets.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Ticket ID', 'Name', 'Type', 'Priority', 'Status', 'Department', 'Raised By', 'Created'].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.TicketID}
                    onClick={() => window.location.href = `/tickets/${ticket.TicketID}`}
                    className="hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-medium text-gray-500">T-{ticket.TicketID}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">{ticket.TicketName}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${TYPE_STYLES[ticket.TicketType] ?? ''}`}>
                        {ticket.TicketType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_STYLES[ticket.Priority] ?? ''}`}>
                        {ticket.Priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[ticket.Status] ?? ''}`}>
                        {ticket.Status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{ticket.DepartmentName}</td>
                    <td className="px-6 py-4">
                      {ticket.EmployeeId ? (
                        <Link
                          href={`/employees/${ticket.EmployeeId}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {ticket.RaisedBy}
                        </Link>
                      ) : (
                        <span className="text-gray-600">{ticket.RaisedBy}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(ticket.CreatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <RaiseTicketModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleTicketCreated}
        />
      )}
    </main>
  )
}
