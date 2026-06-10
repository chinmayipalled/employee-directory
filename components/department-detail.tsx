'use client'

import type { DepartmentDetail } from '@/types/employee'

interface DepartmentDetailProps {
  department: DepartmentDetail
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function DepartmentDetailView({ department }: DepartmentDetailProps): JSX.Element {
  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
            D-{department.DeptID}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{department.DepartmentName}</h1>
        <p className="text-gray-500">
          {department.Description ?? 'No description available.'}
        </p>
      </div>

      <h2 className="text-lg font-semibold text-gray-700 mb-4">Active Employees</h2>

      {department.employees.length === 0 ? (
        <p className="text-gray-400 py-10 text-center">No active employees in this department.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Full Name', 'Job Title', 'Hire Date'].map((header) => (
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
              {department.employees.map((employee) => (
                <tr key={employee.EmployeeId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {employee.FirstName} {employee.LastName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{employee.JobTitle}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(employee.HireDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
