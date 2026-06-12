export default function DepartmentsLoading(): JSX.Element {
  return (
    <main className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="h-9 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-72 bg-gray-100 rounded animate-pulse mt-2" />
        </div>
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 flex gap-8">
            {[120, 200, 160].map((w) => (
              <div key={w} className={`h-3 bg-gray-200 rounded animate-pulse`} style={{ width: w }} />
            ))}
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white px-6 py-4 flex gap-8 border-t border-gray-100">
              <div className="h-4 w-10 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-36 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-8 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
