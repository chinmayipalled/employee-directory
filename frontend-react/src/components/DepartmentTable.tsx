import type { Department } from '@/types/department'

interface DepartmentTableProps {
  departments: Department[]
}

export default function DepartmentTable({ departments }: DepartmentTableProps): JSX.Element {
  if (departments.length === 0) {
    return <div className="text-center py-20 text-gray-400">No departments found.</div>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Department ID', 'Department Name', 'Active Employees'].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {departments.map((dept) => (
            <tr key={dept.DepartmentId} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-gray-500">{dept.DepartmentId}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{dept.DepartmentName}</td>
              <td className="px-6 py-4 text-gray-600">{dept.ActiveEmployeeCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
