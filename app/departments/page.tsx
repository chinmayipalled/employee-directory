'use client'

import { useEffect, useState } from 'react'
import type { Department, ApiResponse } from '@/types/employee'
import DepartmentList from '@/components/department-list'

export default function DepartmentsPage(): JSX.Element {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDepartments(): Promise<void> {
      try {
        const res = await fetch('/api/departments')
        const { data, error: apiError }: ApiResponse<Department[]> = await res.json()
        if (apiError || !data) {
          setError(apiError ?? 'Failed to load departments')
          return
        }
        setDepartments(data)
      } catch {
        setError('Failed to load departments')
      } finally {
        setIsLoading(false)
      }
    }
    loadDepartments()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-500 mt-1">All departments in the organisation</p>
        </div>

        {isLoading && (
          <div className="text-center py-20 text-gray-400">Loading departments…</div>
        )}

        {!isLoading && error && (
          <div className="text-center py-20 text-red-500">{error}</div>
        )}

        {!isLoading && !error && (
          <DepartmentList departments={departments} />
        )}
      </div>
    </main>
  )
}
