'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Ticket, ApiResponse } from '@/types/employee'

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
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function TicketDetailPage(): JSX.Element {
  const params = useParams()
  const router = useRouter()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    async function loadTicket(): Promise<void> {
      try {
        const res = await fetch(`/api/tickets/${params.id}`)
        const { data, error: apiError }: ApiResponse<Ticket> = await res.json()
        if (apiError || !data) {
          setError(apiError ?? 'Ticket not found')
          return
        }
        setTicket(data)
      } catch {
        setError('Failed to load ticket')
      } finally {
        setIsLoading(false)
      }
    }
    loadTicket()
  }, [params.id])

  async function handleDelete(): Promise<void> {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/tickets/${params.id}`, { method: 'DELETE' })
      const { error: apiError }: ApiResponse<{ TicketID: number }> = await res.json()
      if (apiError) {
        setError(apiError)
        return
      }
      router.push('/tickets')
    } catch {
      setError('Failed to delete ticket')
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/tickets"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Tickets
          </Link>
          {ticket && !showConfirm && (
            <button
              onClick={() => setShowConfirm(true)}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
            >
              Delete Ticket
            </button>
          )}
        </div>

        {showConfirm && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
            <p className="text-sm text-red-700 font-medium">Are you sure you want to delete this ticket?</p>
            <div className="flex gap-3 ml-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting…' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-20 text-gray-400">Loading ticket…</div>
        )}

        {!isLoading && error && (
          <div className="text-center py-20 text-red-500">{error}</div>
        )}

        {!isLoading && !error && ticket && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm text-gray-400 font-medium mb-1">T-{ticket.TicketID}</p>
                <h1 className="text-2xl font-bold text-gray-900">{ticket.TicketName}</h1>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${TYPE_STYLES[ticket.TicketType] ?? ''}`}>
                {ticket.TicketType}
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-700 leading-relaxed">{ticket.Description}</p>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</dt>
                <dd>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[ticket.Status] ?? ''}`}>
                    {ticket.Status}
                  </span>
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Priority</dt>
                <dd>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_STYLES[ticket.Priority] ?? ''}`}>
                    {ticket.Priority}
                  </span>
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Raised By</dt>
                <dd className="text-sm text-gray-800">
                  {ticket.EmployeeId ? (
                    <Link
                      href={`/employees/${ticket.EmployeeId}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {ticket.RaisedBy}
                    </Link>
                  ) : (
                    ticket.RaisedBy
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Department</dt>
                <dd className="text-sm text-gray-800 flex items-center gap-2">
                  <Link
                    href={`/departments/${ticket.DeptID}`}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 hover:bg-blue-200"
                  >
                    D-{ticket.DeptID}
                  </Link>
                  {ticket.DepartmentName}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Created</dt>
                <dd className="text-sm text-gray-800">{formatDate(ticket.CreatedAt)}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </main>
  )
}
