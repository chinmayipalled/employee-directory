'use client'

interface SearchInputProps {
  value: string
  onChange: (query: string) => void
}

export default function SearchInput({ value, onChange }: SearchInputProps): JSX.Element {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by name…"
      aria-label="Search employees by name"
      className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  )
}
