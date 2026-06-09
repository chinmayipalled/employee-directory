'use client'

import type { Employee } from '@/types/employee'

interface EmployeeTableProps {
  employees: Employee[]
  onDeactivate: (employee: Employee) => void
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function EmployeeTable({ employees, onDeactivate }: EmployeeTableProps): JSX.Element {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Full Name', 'Department', 'Job Title', 'Hire Date', 'Status', ''].map((header) => (
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
          {employees.map((employee) => (
            <tr key={employee.EmployeeId} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">
                {employee.FirstName} {employee.LastName}
              </td>
              <td className="px-6 py-4 text-gray-600">{employee.Department}</td>
              <td className="px-6 py-4 text-gray-600">{employee.JobTitle}</td>
              <td className="px-6 py-4 text-gray-600">{formatDate(employee.HireDate)}</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onDeactivate(employee)}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
