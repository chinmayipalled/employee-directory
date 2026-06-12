import { useState, useEffect } from 'react'
import type { NewEmployeePayload, Employee } from '@/types/employee'
import type { Department } from '@/types/department'

interface AddEmployeeModalProps {
  onClose: () => void
  onSuccess: (employee: Employee) => void
}

const emptyForm: NewEmployeePayload = {
  FirstName: '',
  LastName: '',
  Email: '',
  DepartmentId: 0,
  JobTitle: '',
  HireDate: '',
}

const API_URL = import.meta.env.VITE_API_URL as string

export default function AddEmployeeModal({ onClose, onSuccess }: AddEmployeeModalProps): JSX.Element {
  const [form, setForm] = useState<NewEmployeePayload>(emptyForm)
  const [departments, setDepartments] = useState<Department[]>([])
  const [errors, setErrors] = useState<Partial<Record<keyof NewEmployeePayload, string>>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function loadDepartments(): Promise<void> {
      try {
        const res = await fetch(`${API_URL}/departments`)
        if (!res.ok) return
        const data: Department[] = await res.json()
        setDepartments(data)
      } catch {
        // non-critical — dropdown stays empty
      }
    }
    loadDepartments()
  }, [])

  function validate(): boolean {
    const next: Partial<Record<keyof NewEmployeePayload, string>> = {}
    if (!form.FirstName.trim()) next.FirstName = 'Required'
    if (!form.LastName.trim()) next.LastName = 'Required'
    if (!form.Email.trim()) {
      next.Email = 'Required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email)) {
      next.Email = 'Invalid email'
    }
    if (!form.DepartmentId) next.DepartmentId = 'Required'
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
      const res = await fetch(`${API_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { message?: string }
        setServerError(body.message ?? 'Something went wrong')
        return
      }
      const data: Employee = await res.json()
      onSuccess(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleChange(field: keyof NewEmployeePayload, value: string): void {
    const parsed = field === 'DepartmentId' ? parseInt(value, 10) || 0 : value
    setForm((prev) => ({ ...prev, [field]: parsed }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

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
          {(['FirstName', 'LastName', 'Email', 'JobTitle'] as const).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {key === 'FirstName' ? 'First Name' : key === 'LastName' ? 'Last Name' : key === 'JobTitle' ? 'Job Title' : key}
              </label>
              <input
                type={key === 'Email' ? 'email' : 'text'}
                value={form[key] as string}
                onChange={(e) => handleChange(key, e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors[key] ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={form.DepartmentId || ''}
              onChange={(e) => handleChange('DepartmentId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.DepartmentId ? 'border-red-400' : 'border-gray-300'
              }`}
            >
              <option value="">Select department…</option>
              {departments.map((d) => (
                <option key={d.DepartmentId} value={d.DepartmentId}>
                  {d.DepartmentName}
                </option>
              ))}
            </select>
            {errors.DepartmentId && <p className="text-xs text-red-500 mt-1">{errors.DepartmentId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
            <input
              type="date"
              value={form.HireDate}
              onChange={(e) => handleChange('HireDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.HireDate ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.HireDate && <p className="text-xs text-red-500 mt-1">{errors.HireDate}</p>}
          </div>

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
