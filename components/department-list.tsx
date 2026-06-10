'use client'

import Link from 'next/link'
import type { Department } from '@/types/employee'

interface DepartmentListProps {
  departments: Department[]
}

export default function DepartmentList({ departments }: DepartmentListProps): JSX.Element {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Dept ID', 'Department Name', 'Description'].map((header) => (
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
            <tr key={dept.DeptID} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <Link
                  href={`/departments/${dept.DeptID}`}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  D-{dept.DeptID}
                </Link>
              </td>
              <td className="px-6 py-4 font-medium text-gray-900">{dept.DepartmentName}</td>
              <td className="px-6 py-4 text-gray-500">
                {dept.Description ?? <span className="italic text-gray-400">No description available.</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
