'use client'

import { useEffect, useState } from 'react'
import type {
  Ticket,
  NewTicketPayload,
  TicketType,
  TicketPriority,
  TicketStatus,
  Department,
  Employee,
  ApiResponse,
} from '@/types/employee'

interface RaiseTicketModalProps {
  onClose: () => void
  onSuccess: (ticket: Ticket) => void
}

const TICKET_TYPES: TicketType[] = ['HR', 'IT']
const PRIORITIES: TicketPriority[] = ['Low', 'Medium', 'High']
const STATUSES: TicketStatus[] = ['Open', 'In Progress', 'Resolved']

export default function RaiseTicketModal({ onClose, onSuccess }: RaiseTicketModalProps): JSX.Element {
  const [departments, setDepartments] = useState<Department[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fields, setFields] = useState<NewTicketPayload>({
    TicketName: '',
    Description: '',
    TicketType: 'HR',
    EmployeeId: 0,
    DeptID: 0,
    Priority: 'Medium',
    Status: 'Open',
  })

  useEffect(() => {
    async function loadData(): Promise<void> {
      const [deptRes, empRes] = await Promise.all([
        fetch('/api/departments'),
        fetch('/api/employees'),
      ])
      const { data: deptData }: ApiResponse<Department[]> = await deptRes.json()
      const { data: empData }: ApiResponse<Employee[]> = await empRes.json()

      if (deptData && deptData.length > 0) {
        setDepartments(deptData)
        setFields((prev) => ({ ...prev, DeptID: deptData[0].DeptID }))
      }
      if (empData && empData.length > 0) {
        setEmployees(empData)
        setFields((prev) => ({ ...prev, EmployeeId: empData[0].EmployeeId }))
      }
    }
    loadData()
  }, [])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void {
    const { name, value } = e.target
    setFields((prev) => ({
      ...prev,
      [name]: name === 'DeptID' || name === 'EmployeeId' ? parseInt(value, 10) : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setFormError(null)

    if (!fields.TicketName.trim() || !fields.Description.trim() || !fields.EmployeeId || !fields.DeptID) {
      setFormError('All fields are required')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      const { data, error }: ApiResponse<Ticket> = await res.json()
      if (error || !data) {
        setFormError(error ?? 'Failed to raise ticket')
        return
      }
      onSuccess(data)
    } catch {
      setFormError('Failed to raise ticket')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Raise a Ticket</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Name</label>
            <input
              name="TicketName"
              value={fields.TicketName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Laptop replacement request"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="Description"
              value={fields.Description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Describe the issue or request…"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Type</label>
              <select
                name="TicketType"
                value={fields.TicketType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TICKET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                name="Priority"
                value={fields.Priority}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Raised By</label>
              <select
                name="EmployeeId"
                value={fields.EmployeeId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {employees.map((emp) => (
                  <option key={emp.EmployeeId} value={emp.EmployeeId}>
                    {emp.FirstName} {emp.LastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="Status"
                value={fields.Status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              name="DeptID"
              value={fields.DeptID}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map((d) => (
                <option key={d.DeptID} value={d.DeptID}>{d.DepartmentName}</option>
              ))}
            </select>
          </div>

          {formError && <p className="text-sm text-red-500">{formError}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting…' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
