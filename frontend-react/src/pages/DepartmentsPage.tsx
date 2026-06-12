import { useEffect, useState } from 'react'
import type { Department } from '@/types/department'
import DepartmentTable from '@/components/DepartmentTable'

const API_URL = import.meta.env.VITE_API_URL as string

export default function DepartmentsPage(): JSX.Element {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDepartments(): Promise<void> {
      try {
        const res = await fetch(`${API_URL}/departments`)
        if (!res.ok) {
          const body = await res.json().catch(() => ({})) as { message?: string }
          setFetchError(body.message ?? 'Failed to load departments')
          return
        }
        const data: Department[] = await res.json()
        setDepartments(data)
      } catch {
        setFetchError('Failed to load departments')
      } finally {
        setIsLoading(false)
      }
    }
    loadDepartments()
  }, [])

  return (
    <main className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-500 mt-1">All departments and their active employee counts</p>
        </div>

        {isLoading && (
          <div className="text-center py-20 text-gray-400">Loading departments…</div>
        )}

        {!isLoading && fetchError && (
          <div className="text-center py-20 text-red-500">{fetchError}</div>
        )}

        {!isLoading && !fetchError && (
          <DepartmentTable departments={departments} />
        )}
      </div>
    </main>
  )
}
