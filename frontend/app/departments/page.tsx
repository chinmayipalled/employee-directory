import type { Department } from '@/types/department'
import DepartmentTable from '@/components/department-table'

async function fetchDepartments(): Promise<Department[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/departments`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function DepartmentsPage(): Promise<JSX.Element> {
  const departments = await fetchDepartments()

  return (
    <main className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-500 mt-1">All departments and their active employee counts</p>
        </div>
        <DepartmentTable departments={departments} />
      </div>
    </main>
  )
}
