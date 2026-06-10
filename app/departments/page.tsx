import { getPool } from '@/lib/db'
import type { Department } from '@/types/department'
import DepartmentTable from '@/components/department-table'

async function fetchDepartments(): Promise<Department[]> {
  try {
    const pool = await getPool()
    const result = await pool.request().query<Department>(`
      SELECT
        d.DepartmentId,
        d.DepartmentName,
        COUNT(e.EmployeeId) AS EmployeeCount
      FROM Departments d
      LEFT JOIN Employees e
        ON e.DepartmentId = d.DepartmentId AND e.IsActive = 1
      GROUP BY d.DepartmentId, d.DepartmentName
      ORDER BY d.DepartmentName
    `)
    return result.recordset
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
