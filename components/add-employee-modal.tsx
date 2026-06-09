'use client'

import { useState } from 'react'
import type { NewEmployeePayload, Employee, ApiResponse } from '@/types/employee'

interface AddEmployeeModalProps {
  onClose: () => void
  onSuccess: (employee: Employee) => void
}

const emptyForm: NewEmployeePayload = {
  FirstName: '',
  LastName: '',
  Email: '',
  Department: '',
  JobTitle: '',
  HireDate: '',
}

export default function AddEmployeeModal({ onClose, onSuccess }: AddEmployeeModalProps): JSX.Element {
  const [form, setForm] = useState<NewEmployeePayload>(emptyForm)
  const [errors, setErrors] = useState<Partial<NewEmployeePayload>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate(): boolean {
    const next: Partial<NewEmployeePayload> = {}
    if (!form.FirstName.trim()) next.FirstName = 'Required'
    if (!form.LastName.trim()) next.LastName = 'Required'
    if (!form.Email.trim()) {
      next.Email = 'Required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email)) {
      next.Email = 'Invalid email'
    }
    if (!form.Department.trim()) next.Department = 'Required'
    if (!form.JobTitle.trim()) next.JobTitle = 'Required'
    if (!form.HireDate) next.HireDate = 'Required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    setServerError(null)
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const { data, error }: ApiResponse<Employee> = await res.json()

      if (error || !data) {
        setServerError(error ?? 'Something went wrong')
        return
      }

      onSuccess(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleChange(field: keyof NewEmployeePayload, value: string): void {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const fields: { key: keyof NewEmployeePayload; label: string; type: string }[] = [
    { key: 'FirstName', label: 'First Name', type: 'text' },
    { key: 'LastName', label: 'Last Name', type: 'text' },
    { key: 'Email', label: 'Email', type: 'email' },
    { key: 'Department', label: 'Department', type: 'text' },
    { key: 'JobTitle', label: 'Job Title', type: 'text' },
    { key: 'HireDate', label: 'Hire Date', type: 'date' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Add Employee</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {fields.map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors[key] ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
            </div>
          ))}

          {serverError && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{serverError}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving…' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
