'use client'

interface DeactivateDialogProps {
  employeeName: string
  isLoading: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function DeactivateDialog({
  employeeName,
  isLoading,
  onConfirm,
  onCancel,
}: DeactivateDialogProps): JSX.Element {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Deactivate Employee</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to deactivate <span className="font-medium">{employeeName}</span>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Deactivating…' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}
