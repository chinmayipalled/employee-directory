'use client'

import { useEffect, useState } from 'react'
import type { Employee } from '@/types/employee'
import EmployeeTable from '@/components/employee-table'
import SearchInput from '@/components/search-input'
import AddEmployeeModal from '@/components/add-employee-modal'
import DeactivateDialog from '@/components/deactivate-dialog'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function HomePage(): JSX.Element {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [employeeToDeactivate, setEmployeeToDeactivate] = useState<Employee | null>(null)
  const [isDeactivating, setIsDeactivating] = useState(false)

  useEffect(() => {
    async function loadEmployees(): Promise<void> {
      try {
        const res = await fetch(`${API_URL}/employees`)
        if (!res.ok) {
          const body = await res.json().catch(() => ({})) as { message?: string }
          setFetchError(body.message ?? 'Failed to load employees')
          return
        }
        const data: Employee[] = await res.json()
        setEmployees(data)
      } catch {
        setFetchError('Failed to load employees')
      } finally {
        setIsLoading(false)
      }
    }
    loadEmployees()
  }, [])

  const filteredEmployees = employees.filter((emp) =>
    `${emp.FirstName} ${emp.LastName}`
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase())
  )

  function handleAddSuccess(newEmployee: Employee): void {
    setEmployees((prev) => [...prev, newEmployee])
    setIsModalOpen(false)
  }

  async function handleDeactivateConfirm(): Promise<void> {
    if (!employeeToDeactivate) return
    setIsDeactivating(true)
    try {
      const res = await fetch(`${API_URL}/employees/${employeeToDeactivate.EmployeeId}`, {
        method: 'PATCH',
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { message?: string }
        alert(body.message ?? 'Failed to deactivate employee')
        return
      }
      setEmployees((prev) =>
        prev.filter((emp) => emp.EmployeeId !== employeeToDeactivate.EmployeeId)
      )
      setEmployeeToDeactivate(null)
    } catch {
      alert('Failed to deactivate employee. Please try again.')
    } finally {
      setIsDeactivating(false)
    }
  }

  return (
    <main className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Employee Directory</h1>
          <p className="text-gray-500 mt-1">View and manage all active employees</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            + Add Employee
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-20 text-gray-400">Loading employees…</div>
        )}

        {!isLoading && fetchError && (
          <div className="text-center py-20 text-red-500">{fetchError}</div>
        )}

        {!isLoading && !fetchError && filteredEmployees.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            {searchQuery.trim() ? 'No employees match your search.' : 'No employees found.'}
          </div>
        )}

        {!isLoading && !fetchError && filteredEmployees.length > 0 && (
          <EmployeeTable
            employees={filteredEmployees}
            onDeactivate={setEmployeeToDeactivate}
          />
        )}
      </div>

      {isModalOpen && (
        <AddEmployeeModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {employeeToDeactivate && (
        <DeactivateDialog
          employeeName={`${employeeToDeactivate.FirstName} ${employeeToDeactivate.LastName}`}
          isLoading={isDeactivating}
          onConfirm={handleDeactivateConfirm}
          onCancel={() => setEmployeeToDeactivate(null)}
        />
      )}
    </main>
  )
}
