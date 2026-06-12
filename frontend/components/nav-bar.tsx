'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { label: 'Employees', href: '/' },
  { label: 'Departments', href: '/departments' },
  { label: 'Tickets', href: '/tickets' },
]

export default function NavBar(): JSX.Element {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-0">
      <div className="max-w-6xl mx-auto flex items-center gap-1">
        <span className="text-blue-600 font-bold text-lg mr-6 py-4">EmpDir</span>
        {navLinks.map(({ label, href }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
