'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { DepartmentDetail, ApiResponse } from '@/types/employee'
import DepartmentDetailView from '@/components/department-detail'

export default function DepartmentPage(): JSX.Element {
  const params = useParams()
  const [department, setDepartment] = useState<DepartmentDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDepartment(): Promise<void> {
      try {
        const res = await fetch(`/api/departments/${params.id}`)
        const { data, error: apiError }: ApiResponse<DepartmentDetail> = await res.json()
        if (apiError || !data) {
          setError(apiError ?? 'Failed to load department')
          return
        }
        setDepartment(data)
      } catch {
        setError('Failed to load department')
      } finally {
        setIsLoading(false)
      }
    }
    loadDepartment()
  }, [params.id])

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8"
        >
          ← Back to Directory
        </Link>

        {isLoading && (
          <div className="text-center py-20 text-gray-400">Loading department…</div>
        )}

        {!isLoading && error && (
          <div className="text-center py-20 text-red-500">{error}</div>
        )}

        {!isLoading && !error && department && (
          <DepartmentDetailView department={department} />
        )}
      </div>
    </main>
  )
}
