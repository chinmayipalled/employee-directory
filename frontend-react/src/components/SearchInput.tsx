interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchInput({ value, onChange }: SearchInputProps): JSX.Element {
  return (
    <input
      type="search"
      placeholder="Search by name…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full sm:w-72 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  )
}
