'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { Employee, ApiResponse } from '@/types/employee'

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function EmployeeDetailPage(): JSX.Element {
  const params = useParams()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadEmployee(): Promise<void> {
      try {
        const res = await fetch(`/api/employees/${params.id}`)
        const { data, error: apiError }: ApiResponse<Employee> = await res.json()
        if (apiError || !data) {
          setError(apiError ?? 'Employee not found')
          return
        }
        setEmployee(data)
      } catch {
        setError('Failed to load employee')
      } finally {
        setIsLoading(false)
      }
    }
    loadEmployee()
  }, [params.id])

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8"
        >
          ← Back to Directory
        </Link>

        {isLoading && (
          <div className="text-center py-20 text-gray-400">Loading employee…</div>
        )}

        {!isLoading && error && (
          <div className="text-center py-20 text-red-500">{error}</div>
        )}

        {!isLoading && !error && employee && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {employee.FirstName} {employee.LastName}
                </h1>
                <p className="text-gray-500 mt-1">{employee.JobTitle}</p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${employee.IsActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                {employee.IsActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</dt>
                <dd className="text-sm text-gray-800">{employee.Email}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Department</dt>
                <dd className="text-sm text-gray-800 flex items-center gap-2">
                  <Link
                    href={`/departments/${employee.DeptID}`}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 hover:bg-blue-200"
                  >
                    D-{employee.DeptID}
                  </Link>
                  {employee.Department}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Hire Date</dt>
                <dd className="text-sm text-gray-800">{formatDate(employee.HireDate)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Employee ID</dt>
                <dd className="text-sm text-gray-800">#{employee.EmployeeId}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </main>
  )
}
