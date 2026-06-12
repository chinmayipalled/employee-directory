import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Employees' },
  { to: '/departments', label: 'Departments' },
  { to: '/tickets', label: 'Tickets' },
]

export default function NavBar(): JSX.Element {
  return (
    <nav className="bg-white border-b border-gray-200 px-4">
      <div className="max-w-6xl mx-auto flex items-center gap-6 h-14">
        <span className="font-semibold text-gray-900 text-sm">Employee Directory</span>
        <div className="flex items-center gap-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
